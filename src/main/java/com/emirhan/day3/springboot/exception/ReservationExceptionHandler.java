package com.emirhan.day3.springboot.exception;

import com.emirhan.day3.springboot.controller.ReservationController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

// Sadece ReservationController için: mevcut controller'ların (bare
// RuntimeException -> 500) davranışını değiştirmemek adına global
// değil, tek bir controller'a scoped bir exception handler.
@RestControllerAdvice(assignableTypes = ReservationController.class)
public class ReservationExceptionHandler {

    @ExceptionHandler(ReservationNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ReservationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(ReservationValidationException.class)
    public ResponseEntity<Map<String, String>> handleValidation(ReservationValidationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(ReservationConflictException.class)
    public ResponseEntity<Map<String, String>> handleConflict(ReservationConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
    }
}
