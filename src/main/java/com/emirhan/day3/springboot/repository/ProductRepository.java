package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Long> {
    //Product verileriyle çalışacağım ve Product'ın ID tipi Long.
}
