package com.emirhan.day3.springboot.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Bir Order'ın ödeme sürecini tutar: tek kişi mi yoksa Alman usulü mü
// ödeneceği, ödeme durumu ve (tek kişi modunda) seçilen ödeme yöntemi.
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Order order;

    @Enumerated(EnumType.STRING)
    private PaymentMode mode = PaymentMode.SINGLE;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.UNPAID;

    // Sadece "Tek Kişi" modunda kullanılır.
    @Enumerated(EnumType.STRING)
    private PaymentMethod singlePaymentMethod;

    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentParticipant> participants = new ArrayList<>();

    public Payment() {
    }

    public Payment(Order order) {
        this.order = order;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public PaymentMode getMode() {
        return mode;
    }

    public void setMode(PaymentMode mode) {
        this.mode = mode;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public PaymentMethod getSinglePaymentMethod() {
        return singlePaymentMethod;
    }

    public void setSinglePaymentMethod(PaymentMethod singlePaymentMethod) {
        this.singlePaymentMethod = singlePaymentMethod;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<PaymentParticipant> getParticipants() {
        return participants;
    }

    public void setParticipants(List<PaymentParticipant> participants) {
        this.participants = participants;
    }
}
