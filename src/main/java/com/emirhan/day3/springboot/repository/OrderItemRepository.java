package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository  extends JpaRepository<OrderItem,Long> {
}
