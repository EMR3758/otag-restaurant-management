package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.ReservationCreateDTO;
import com.emirhan.day3.springboot.dto.ReservationResponseDTO;
import com.emirhan.day3.springboot.dto.ReservationUpdateDTO;
import com.emirhan.day3.springboot.exception.ReservationConflictException;
import com.emirhan.day3.springboot.exception.ReservationNotFoundException;
import com.emirhan.day3.springboot.exception.ReservationValidationException;
import com.emirhan.day3.springboot.model.Reservation;
import com.emirhan.day3.springboot.model.ReservationStatus;
import com.emirhan.day3.springboot.model.RestaurantTable;
import com.emirhan.day3.springboot.repository.ReservationRepository;
import com.emirhan.day3.springboot.repository.RestaurantTableRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {

    // Çakışma kontrolünde "aktif" kabul edilen durumlar.
    private static final List<ReservationStatus> ACTIVE_STATUSES = List.of(
            ReservationStatus.PENDING,
            ReservationStatus.CONFIRMED,
            ReservationStatus.ARRIVED
    );

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository restaurantTableRepository;

    public ReservationService(ReservationRepository reservationRepository,
                               RestaurantTableRepository restaurantTableRepository) {
        this.reservationRepository = reservationRepository;
        this.restaurantTableRepository = restaurantTableRepository;
    }

    private ReservationResponseDTO convertToDTO(Reservation reservation) {
        return new ReservationResponseDTO(
                reservation.getId(),
                reservation.getCustomerName(),
                reservation.getCustomerPhone(),
                reservation.getCustomerEmail(),
                reservation.getReservationDate(),
                reservation.getReservationTime(),
                reservation.getGuestCount(),
                reservation.getTable(),
                reservation.getStatus(),
                reservation.getNote(),
                reservation.getCreatedAt()
        );
    }

    // Create/Update ortak validasyonu. tableId zaten çözülmüş RestaurantTable
    // ile birlikte çağrılır; guestCount ve tarih/saat burada kontrol edilir.
    private void validateCore(String customerName, String customerPhone,
                               LocalDate reservationDate, LocalTime reservationTime,
                               int guestCount, RestaurantTable table) {

        if (customerName == null || customerName.isBlank()) {
            throw new ReservationValidationException("Müşteri adı boş olamaz");
        }
        if (customerPhone == null || customerPhone.isBlank()) {
            throw new ReservationValidationException("Telefon numarası boş olamaz");
        }
        if (reservationDate == null) {
            throw new ReservationValidationException("Rezervasyon tarihi boş olamaz");
        }
        if (reservationTime == null) {
            throw new ReservationValidationException("Rezervasyon saati boş olamaz");
        }
        if (guestCount <= 0) {
            throw new ReservationValidationException("Kişi sayısı 0'dan büyük olmalı");
        }
        if (guestCount > table.getCapacity()) {
            throw new ReservationValidationException(
                    "Kişi sayısı (" + guestCount + ") seçilen masanın kapasitesini (" + table.getCapacity() + ") aşıyor"
            );
        }

        LocalDateTime reservationDateTime = LocalDateTime.of(reservationDate, reservationTime);
        if (reservationDateTime.isBefore(LocalDateTime.now())) {
            throw new ReservationValidationException("Geçmiş bir tarih/saat için rezervasyon oluşturulamaz");
        }
    }

    private void checkConflict(Long tableId, LocalDate reservationDate, LocalTime reservationTime, Long excludeReservationId) {
        List<Reservation> clashing = reservationRepository
                .findByTable_IdAndReservationDateAndReservationTimeAndStatusIn(
                        tableId, reservationDate, reservationTime, ACTIVE_STATUSES
                );

        boolean hasConflict = clashing.stream()
                .anyMatch(r -> excludeReservationId == null || !r.getId().equals(excludeReservationId));

        if (hasConflict) {
            throw new ReservationConflictException("Bu masa seçilen tarih ve saatte zaten rezerve.");
        }
    }

    public List<ReservationResponseDTO> getAll() {
        List<ReservationResponseDTO> result = new ArrayList<>();
        for (Reservation reservation : reservationRepository.findAll()) {
            result.add(convertToDTO(reservation));
        }
        return result;
    }

    public ReservationResponseDTO getById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException("Rezervasyon bulunamadı"));
        return convertToDTO(reservation);
    }

    public List<ReservationResponseDTO> getByDate(LocalDate date) {
        List<ReservationResponseDTO> result = new ArrayList<>();
        for (Reservation reservation : reservationRepository.findByReservationDate(date)) {
            result.add(convertToDTO(reservation));
        }
        return result;
    }

    public ReservationResponseDTO create(ReservationCreateDTO dto) {
        RestaurantTable table = restaurantTableRepository.findById(dto.getTableId())
                .orElseThrow(() -> new ReservationNotFoundException("Masa bulunamadı"));

        validateCore(dto.getCustomerName(), dto.getCustomerPhone(), dto.getReservationDate(),
                dto.getReservationTime(), dto.getGuestCount(), table);

        checkConflict(table.getId(), dto.getReservationDate(), dto.getReservationTime(), null);

        Reservation reservation = new Reservation();
        reservation.setCustomerName(dto.getCustomerName());
        reservation.setCustomerPhone(dto.getCustomerPhone());
        reservation.setCustomerEmail(dto.getCustomerEmail());
        reservation.setReservationDate(dto.getReservationDate());
        reservation.setReservationTime(dto.getReservationTime());
        reservation.setGuestCount(dto.getGuestCount());
        reservation.setTable(table);
        reservation.setStatus(dto.getStatus() != null ? dto.getStatus() : ReservationStatus.PENDING);
        reservation.setNote(dto.getNote());
        reservation.setCreatedAt(LocalDateTime.now());

        Reservation saved = reservationRepository.save(reservation);
        return convertToDTO(saved);
    }

    public ReservationResponseDTO update(Long id, ReservationUpdateDTO dto) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException("Rezervasyon bulunamadı"));

        RestaurantTable table = restaurantTableRepository.findById(dto.getTableId())
                .orElseThrow(() -> new ReservationNotFoundException("Masa bulunamadı"));

        validateCore(dto.getCustomerName(), dto.getCustomerPhone(), dto.getReservationDate(),
                dto.getReservationTime(), dto.getGuestCount(), table);

        checkConflict(table.getId(), dto.getReservationDate(), dto.getReservationTime(), reservation.getId());

        reservation.setCustomerName(dto.getCustomerName());
        reservation.setCustomerPhone(dto.getCustomerPhone());
        reservation.setCustomerEmail(dto.getCustomerEmail());
        reservation.setReservationDate(dto.getReservationDate());
        reservation.setReservationTime(dto.getReservationTime());
        reservation.setGuestCount(dto.getGuestCount());
        reservation.setTable(table);
        if (dto.getStatus() != null) {
            reservation.setStatus(dto.getStatus());
        }
        reservation.setNote(dto.getNote());

        Reservation updated = reservationRepository.save(reservation);
        return convertToDTO(updated);
    }

    public ReservationResponseDTO updateStatus(Long id, ReservationStatus status) {
        if (status == null) {
            throw new ReservationValidationException("Durum boş olamaz");
        }
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException("Rezervasyon bulunamadı"));

        reservation.setStatus(status);
        Reservation updated = reservationRepository.save(reservation);
        return convertToDTO(updated);
    }

    public void delete(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new ReservationNotFoundException("Rezervasyon bulunamadı");
        }
        reservationRepository.deleteById(id);
    }
}
