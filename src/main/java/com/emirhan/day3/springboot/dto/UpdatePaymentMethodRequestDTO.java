package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.PaymentMethod;

public class UpdatePaymentMethodRequestDTO {
    private PaymentMethod method;

    public UpdatePaymentMethodRequestDTO() {
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }
}
