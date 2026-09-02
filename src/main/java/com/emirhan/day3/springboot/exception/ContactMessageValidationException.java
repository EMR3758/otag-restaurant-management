package com.emirhan.day3.springboot.exception;

public class ContactMessageValidationException extends RuntimeException {
    public ContactMessageValidationException(String message) {
        super(message);
    }
}
