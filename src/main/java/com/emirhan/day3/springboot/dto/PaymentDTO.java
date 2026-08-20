package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.PaymentMethod;
import com.emirhan.day3.springboot.model.PaymentMode;
import com.emirhan.day3.springboot.model.PaymentStatus;

import java.time.LocalDateTime;
import java.util.List;

public class PaymentDTO {
    private Long orderId;
    private PaymentMode mode;
    private PaymentStatus status;
    private PaymentMethod singlePaymentMethod;
    private double orderTotal;
    private double distributedAmount;
    private double remainingAmount;
    private boolean readyToComplete;
    private LocalDateTime completedAt;
    private List<PaymentParticipantDTO> participants;

    public PaymentDTO() {
    }

    public PaymentDTO(Long orderId, PaymentMode mode, PaymentStatus status, PaymentMethod singlePaymentMethod,
                       double orderTotal, double distributedAmount, double remainingAmount,
                       boolean readyToComplete, LocalDateTime completedAt, List<PaymentParticipantDTO> participants) {
        this.orderId = orderId;
        this.mode = mode;
        this.status = status;
        this.singlePaymentMethod = singlePaymentMethod;
        this.orderTotal = orderTotal;
        this.distributedAmount = distributedAmount;
        this.remainingAmount = remainingAmount;
        this.readyToComplete = readyToComplete;
        this.completedAt = completedAt;
        this.participants = participants;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
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

    public double getOrderTotal() {
        return orderTotal;
    }

    public void setOrderTotal(double orderTotal) {
        this.orderTotal = orderTotal;
    }

    public double getDistributedAmount() {
        return distributedAmount;
    }

    public void setDistributedAmount(double distributedAmount) {
        this.distributedAmount = distributedAmount;
    }

    public double getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(double remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public boolean isReadyToComplete() {
        return readyToComplete;
    }

    public void setReadyToComplete(boolean readyToComplete) {
        this.readyToComplete = readyToComplete;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<PaymentParticipantDTO> getParticipants() {
        return participants;
    }

    public void setParticipants(List<PaymentParticipantDTO> participants) {
        this.participants = participants;
    }
}
