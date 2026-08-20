package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.SplitType;

public class PaymentAllocationDTO {
    private Long orderItemId;
    private double amount;
    private Integer quantity;
    private SplitType splitType;

    public PaymentAllocationDTO() {
    }

    public PaymentAllocationDTO(Long orderItemId, double amount, Integer quantity, SplitType splitType) {
        this.orderItemId = orderItemId;
        this.amount = amount;
        this.quantity = quantity;
        this.splitType = splitType;
    }

    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
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
