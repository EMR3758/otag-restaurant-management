package com.emirhan.day3.springboot.controller;
import com.emirhan.day3.springboot.dto.CategoryCreateDTO;
import com.emirhan.day3.springboot.dto.CategoryDTO;
import com.emirhan.day3.springboot.model.Category;
import com.emirhan.day3.springboot.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public List<CategoryDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping("/categories")
    public CategoryDTO addCategory(@RequestBody CategoryCreateDTO dto) {
        return categoryService.addCategory(dto);
    }

    @GetMapping("/categories/{id}")
    public CategoryDTO getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);

    }

    @PutMapping("/categories/{id}")
    public CategoryDTO updateCategory(@PathVariable Long id, @RequestBody CategoryCreateDTO dto) {
        return categoryService.updateCategory(id, dto);
    }
}
