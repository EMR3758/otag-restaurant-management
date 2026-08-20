package com.emirhan.day3.springboot.model;

import jakarta.persistence.*;

// Bir OrderItem'ın tutarının ne kadarının hangi katılımcıya (PaymentParticipant)
// düştüğünü tutar. "Bölüştür" modalındaki Eşit Böl / Adet Bazlı / Manuel Tutar
// seçiminin sonucu burada satır satır saklanır.
@Entity
@Table(name = "payment_allocations")
public class PaymentAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private PaymentParticipant participant;

    @ManyToOne
    @JoinColumn(name = "order_item_id")
    private OrderItem orderItem;

    // Bu katılımcıya düşen ₺ tutarı.
    private double amount;

    // BY_QUANTITY bölüştürmesinde bu katılımcıya düşen adet (opsiyonel).
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    private SplitType splitType;

    public PaymentAllocation() {
    }

    public PaymentAllocation(PaymentParticipant participant, OrderItem orderItem, double amount, Integer quantity, SplitType splitType) {
        this.participant = participant;
        this.orderItem = orderItem;
        this.amount = amount;
        this.quantity = quantity;
        this.splitType = splitType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PaymentParticipant getParticipant() {
        return participant;
    }

    public void setParticipant(PaymentParticipant participant) {
        this.participant = participant;
    }

    public OrderItem getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(OrderItem orderItem) {
        this.orderItem = orderItem;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public SplitType getSplitType() {
        return splitType;
    }

    public void setSplitType(SplitType splitType) {
        this.splitType = splitType;
    }
}
