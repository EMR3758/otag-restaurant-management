package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.PaymentParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentParticipantRepository extends JpaRepository<PaymentParticipant, Long> {
}
