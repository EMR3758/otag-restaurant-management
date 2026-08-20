package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.PaymentMode;

public class UpdatePaymentModeRequestDTO {
    private PaymentMode mode;

    public UpdatePaymentModeRequestDTO() {
    }

    public PaymentMode getMode() {
        return mode;
    }

    public void setMode(PaymentMode mode) {
        this.mode = mode;
    }
}
