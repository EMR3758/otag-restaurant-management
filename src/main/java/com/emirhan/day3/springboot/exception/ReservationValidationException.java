package com.emirhan.day3.springboot.exception;

public class ReservationValidationException extends RuntimeException {
    public ReservationValidationException(String message) {
        super(message);
    }
}
