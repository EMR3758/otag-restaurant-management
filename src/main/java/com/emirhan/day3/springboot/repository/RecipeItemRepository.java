package com.emirhan.day3.springboot.repository;

import com.emirhan.day3.springboot.model.RecipeItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeItemRepository extends JpaRepository<RecipeItem, Long> {
    List<RecipeItem> findByProductId(Long productId);
}
