package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.*;
import com.emirhan.day3.springboot.model.*;
import com.emirhan.day3.springboot.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentParticipantRepository participantRepository;
    private final PaymentAllocationRepository allocationRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public PaymentService(PaymentRepository paymentRepository,
                           PaymentParticipantRepository participantRepository,
                           PaymentAllocationRepository allocationRepository,
                           OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository) {
        this.paymentRepository = paymentRepository;
        this.participantRepository = participantRepository;
        this.allocationRepository = allocationRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // ödeme kaydı yoksa (ilk kez sipariş detayı açıldığında) varsayılan
    // SINGLE/UNPAID bir kayıt oluşturup döner. Frontend her zaman
    // GET ile çalışabilsin diye ayrı bir "create" endpoint'i yok.
    private Payment getOrCreatePayment(Long orderId) {
        Optional<Payment> existing = paymentRepository.findByOrder_Id(orderId);
        if (existing.isPresent()) {
            return existing.get();
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Sipariş bulunamadı"));
        Payment payment = new Payment(order);
        return paymentRepository.save(payment);
    }

    private void ensureNotPaid(Payment payment) {
        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Bu sipariş için ödeme zaten tamamlandı, değişiklik yapılamaz");
        }
    }

    private double round2(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    private double itemSubtotal(OrderItem item) {
        return item.getUnitPrice() * item.getQuantity();
    }

    // ====================================================
    // OKUMA / DTO OLUŞTURMA
    // ====================================================

    public PaymentDTO getPaymentState(Long orderId) {
        Payment payment = getOrCreatePayment(orderId);
        return convertToDTO(payment);
    }

    private PaymentDTO convertToDTO(Payment payment) {
        List<OrderItem> items = orderItemRepository.findByOrder_Id(payment.getOrder().getId());

        double orderTotal = 0;
        for (OrderItem item : items) {
            orderTotal += itemSubtotal(item);
        }
        orderTotal = round2(orderTotal);

        List<PaymentParticipantDTO> participantDTOs = new ArrayList<>();
        double distributed = 0;

        for (PaymentParticipant participant : payment.getParticipants()) {
            List<PaymentAllocationDTO> allocationDTOs = new ArrayList<>();
            double personTotal = 0;

            for (PaymentAllocation allocation : participant.getAllocations()) {
                allocationDTOs.add(new PaymentAllocationDTO(
                        allocation.getOrderItem().getId(),
                        allocation.getAmount(),
                        allocation.getQuantity(),
                        allocation.getSplitType()
                ));
                personTotal += allocation.getAmount();
            }

            personTotal = round2(personTotal);
            distributed += personTotal;

            participantDTOs.add(new PaymentParticipantDTO(
                    participant.getId(),
                    participant.getName(),
                    participant.getPaymentMethod(),
                    personTotal,
                    allocationDTOs
            ));
        }

        distributed = round2(distributed);
        double remaining = round2(orderTotal - distributed);

        boolean readyToComplete;
        if (payment.getMode() == PaymentMode.SINGLE) {
            readyToComplete = payment.getSinglePaymentMethod() != null && orderTotal > 0;
        } else {
            boolean allParticipantsHaveMethod = !participantDTOs.isEmpty()
                    && participantDTOs.stream().allMatch(p -> p.getPaymentMethod() != null);
            readyToComplete = allParticipantsHaveMethod && remaining == 0 && orderTotal > 0;
        }

        return new PaymentDTO(
                payment.getOrder().getId(),
                payment.getMode(),
                payment.getStatus(),
                payment.getSinglePaymentMethod(),
                orderTotal,
                payment.getMode() == PaymentMode.GERMAN ? distributed : orderTotal,
                payment.getMode() == PaymentMode.GERMAN ? remaining : 0,
                readyToComplete,
                payment.getCompletedAt(),
                participantDTOs
        );
    }

    // ====================================================
    // YAZMA
    // ====================================================

    @Transactional
    public PaymentDTO updateMode(Long orderId, PaymentMode mode) {
        Payment payment = getOrCreatePayment(orderId);
        ensureNotPaid(payment);
        payment.setMode(mode);
        paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    @Transactional
    public PaymentDTO updateSingleMethod(Long orderId, PaymentMethod method) {
        Payment payment = getOrCreatePayment(orderId);
        ensureNotPaid(payment);
        payment.setSinglePaymentMethod(method);
        paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    @Transactional
    public PaymentDTO addParticipant(Long orderId, String name) {
        Payment payment = getOrCreatePayment(orderId);
        ensureNotPaid(payment);
        if (name == null || name.isBlank()) {
            throw new RuntimeException("Kişi adı boş olamaz");
        }
        PaymentParticipant participant = new PaymentParticipant(payment, name.trim());
        payment.getParticipants().add(participant);
        paymentRepository.save(payment);
        return convertToDTO(payment);
    }

    @Transactional
    public PaymentDTO removeParticipant(Long orderId, Long participantId) {
        Payment payment = getOrCreatePayment(orderId);
        ensureNotPaid(payment);
        PaymentParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Kişi bulunamadı"));
        if (!participant.getPayment().getId().equals(payment.getId())) {
            throw new RuntimeException("Bu kişi bu siparişe ait değil");
        }
        payment.getParticipants().remove(participant);
        participantRepository.delete(participant);
        return convertToDTO(payment);
    }

    @Transactional
    public PaymentDTO updateParticipantMethod(Long orderId, Long participantId, PaymentMethod method) {
        Payment payment = getOrCreatePayment(orderId);
        ensureNotPaid(payment);
        PaymentParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Kişi bulunamadı"));
        if (!participant.getPayment().getId().equals(payment.getId())) {
            throw new RuntimeException("Bu kişi bu siparişe ait değil");
        }
        participant.setPaymentMethod(method);
        participantRepository.save(participant);
        return convertToDTO(payment);
    }

    @Transactional
    public PaymentDTO saveItemAllocations(Long orderId, Long orderItemId, SaveItemAllocationsRequestDTO request) {
        Payment payment = getOrCreatePayment(orderId);
        ensureNotPaid(payment);

        OrderItem item = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new RuntimeException("Sipariş ürünü bulunamadı"));
        if (!item.getOrder().getId().equals(orderId)) {
            throw new RuntimeException("Bu ürün bu siparişe ait değil");
        }

        double subtotal = round2(itemSubtotal(item));
        SplitType splitType = request.getSplitType();
        List<SaveItemAllocationsRequestDTO.AllocationEntryDTO> entries = request.getEntries() == null
                ? new ArrayList<>() : request.getEntries();

        // Bu item için önceki bölüştürme kayıtlarını temizle, yenisini yaz.
        allocationRepository.deleteByOrderItem_Id(orderItemId);

        List<PaymentAllocation> newAllocations = new ArrayList<>();

        if (splitType == SplitType.EQUAL) {
            int n = entries.size();
            if (n == 0) {
                throw new RuntimeException("Eşit bölüştürme için en az bir kişi seçilmeli");
            }
            double share = round2(subtotal / n);
            double assigned = 0;
            for (int i = 0; i < n; i++) {
                PaymentParticipant participant = requireParticipant(payment, entries.get(i).getParticipantId());
                // Küsurat farkını son kişiye yansıt, toplam tam tutsun.
                double amount = (i == n - 1) ? round2(subtotal - assigned) : share;
                assigned = round2(assigned + amount);
                newAllocations.add(new PaymentAllocation(participant, item, amount, null, SplitType.EQUAL));
            }
        } else if (splitType == SplitType.BY_QUANTITY) {
            int totalQuantity = 0;
            for (SaveItemAllocationsRequestDTO.AllocationEntryDTO entry : entries) {
                int qty = entry.getQuantity() == null ? 0 : entry.getQuantity();
                if (qty < 0) {
                    throw new RuntimeException("Adet negatif olamaz");
                }
                totalQuantity += qty;
            }
            if (totalQuantity > item.getQuantity()) {
                throw new RuntimeException("Dağıtılan adet ürünün toplam adedini geçemez");
            }
            for (SaveItemAllocationsRequestDTO.AllocationEntryDTO entry : entries) {
                int qty = entry.getQuantity() == null ? 0 : entry.getQuantity();
                if (qty == 0) {
                    continue;
                }
                PaymentParticipant participant = requireParticipant(payment, entry.getParticipantId());
                double amount = round2(item.getUnitPrice() * qty);
                newAllocations.add(new PaymentAllocation(participant, item, amount, qty, SplitType.BY_QUANTITY));
            }
        } else if (splitType == SplitType.MANUAL) {
            double assigned = 0;
            for (SaveItemAllocationsRequestDTO.AllocationEntryDTO entry : entries) {
                double amount = entry.getAmount() == null ? 0 : entry.getAmount();
                if (amount < 0) {
                    throw new RuntimeException("Tutar negatif olamaz");
                }
                assigned = round2(assigned + amount);
                if (amount == 0) {
                    continue;
                }
                PaymentParticipant participant = requireParticipant(payment, entry.getParticipantId());
                newAllocations.add(new PaymentAllocation(participant, item, round2(amount), null, SplitType.MANUAL));
            }
            if (assigned > subtotal) {
                throw new RuntimeException("Dağıtılan tutar ürünün toplam fiyatını geçemez");
            }
        } else {
            throw new RuntimeException("Geçersiz bölüştürme tipi");
        }

        allocationRepository.saveAll(newAllocations);
        return getPaymentState(orderId);
    }

    private PaymentParticipant requireParticipant(Payment payment, Long participantId) {
        PaymentParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new RuntimeException("Kişi bulunamadı"));
        if (!participant.getPayment().getId().equals(payment.getId())) {
            throw new RuntimeException("Bu kişi bu siparişe ait değil");
        }
        return participant;
    }

    @Transactional
    public PaymentDTO completePayment(Long orderId) {
        Payment payment = getOrCreatePayment(orderId);
        ensureNotPaid(payment);

        PaymentDTO current = convertToDTO(payment);
        if (!current.isReadyToComplete()) {
            throw new RuntimeException("Ödeme tamamlanamaz: tutarlar dağıtılmamış veya ödeme yöntemi eksik");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setCompletedAt(LocalDateTime.now());
        paymentRepository.save(payment);
        return convertToDTO(payment);
    }
}
