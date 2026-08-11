package com.emirhan.day3.springboot.repository;
import com.emirhan.day3.springboot.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category,Long> {
}
