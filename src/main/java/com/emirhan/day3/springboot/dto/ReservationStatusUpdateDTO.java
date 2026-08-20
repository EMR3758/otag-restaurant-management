package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.ReservationStatus;

public class ReservationStatusUpdateDTO {
    private ReservationStatus status;

    public ReservationStatusUpdateDTO() {
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
}
