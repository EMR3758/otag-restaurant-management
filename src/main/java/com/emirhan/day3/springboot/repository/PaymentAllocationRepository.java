package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.PaymentAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentAllocationRepository extends JpaRepository<PaymentAllocation, Long> {
    List<PaymentAllocation> findByOrderItem_Id(Long orderItemId);

    void deleteByOrderItem_Id(Long orderItemId);

    void deleteByParticipant_Id(Long participantId);
}
