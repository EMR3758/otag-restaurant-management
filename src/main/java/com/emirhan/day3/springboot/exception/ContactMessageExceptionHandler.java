package com.emirhan.day3.springboot.exception;

import com.emirhan.day3.springboot.controller.ContactMessageController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

// ReservationExceptionHandler ile aynı yaklaşım: sadece ContactMessageController
// için scoped, diğer controller'ların (bare RuntimeException -> 500)
// davranışını değiştirmiyor.
@RestControllerAdvice(assignableTypes = ContactMessageController.class)
public class ContactMessageExceptionHandler {

    @ExceptionHandler(ContactMessageValidationException.class)
    public ResponseEntity<Map<String, String>> handleValidation(ContactMessageValidationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }
}
