package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock,Long> {
    Optional<Stock> findByProductName(String productName);
}
