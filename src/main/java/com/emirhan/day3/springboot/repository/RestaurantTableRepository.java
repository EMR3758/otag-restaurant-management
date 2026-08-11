package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable,Long> {
}
