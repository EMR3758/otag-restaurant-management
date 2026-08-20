package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.PaymentMethod;

import java.util.List;

public class PaymentParticipantDTO {
    private Long id;
    private String name;
    private PaymentMethod paymentMethod;
    private double personTotal;
    private List<PaymentAllocationDTO> allocations;

    public PaymentParticipantDTO() {
    }

    public PaymentParticipantDTO(Long id, String name, PaymentMethod paymentMethod, double personTotal, List<PaymentAllocationDTO> allocations) {
        this.id = id;
        this.name = name;
        this.paymentMethod = paymentMethod;
        this.personTotal = personTotal;
        this.allocations = allocations;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public double getPersonTotal() {
        return personTotal;
    }

    public void setPersonTotal(double personTotal) {
        this.personTotal = personTotal;
    }

    public List<PaymentAllocationDTO> getAllocations() {
        return allocations;
    }

    public void setAllocations(List<PaymentAllocationDTO> allocations) {
        this.allocations = allocations;
    }
}
