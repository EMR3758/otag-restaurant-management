package com.emirhan.day3.springboot.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

// Alman usulü ödemede masadaki bir kişiyi temsil eder.
// Sistemdeki personel (User) hesaplarından bağımsızdır; sadece
// bu siparişin ödemesi için girilen bir isimdir.
@Entity
@Table(name = "payment_participants")
public class PaymentParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;

    private String name;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentAllocation> allocations = new ArrayList<>();

    public PaymentParticipant() {
    }

    public PaymentParticipant(Payment payment, String name) {
        this.payment = payment;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public List<PaymentAllocation> getAllocations() {
        return allocations;
    }

    public void setAllocations(List<PaymentAllocation> allocations) {
        this.allocations = allocations;
    }
}
