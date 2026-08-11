package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
