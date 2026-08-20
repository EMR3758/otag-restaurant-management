package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.Payment;
import com.emirhan.day3.springboot.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder_Id(Long orderId);
    List<Payment> findByStatusAndCompletedAtBetween(
            PaymentStatus status,
            LocalDateTime start,
            LocalDateTime end
    );
}
