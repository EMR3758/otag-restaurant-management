package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.CategoryCreateDTO;
import com.emirhan.day3.springboot.dto.CategoryDTO;
import com.emirhan.day3.springboot.model.Category;
import com.emirhan.day3.springboot.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    private CategoryDTO convertToDTO(Category category){
        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }
    private Category convertToCategory(CategoryCreateDTO dto){
        return new Category(
                dto.getName(),
                dto.getDescription()
        );
    }
    public List<CategoryDTO> getAllCategories(){
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDTO> categoryDTOList = new ArrayList<>();
        for(Category category : categories){
            CategoryDTO dto = convertToDTO(category);
            categoryDTOList.add(dto);
        }
        return categoryDTOList;
    }

    public CategoryDTO addCategory(CategoryCreateDTO dto){
        Category category = convertToCategory(dto);
        Category categorySaved = categoryRepository.save(category);
        CategoryDTO categoryDTO = convertToDTO(categorySaved);
        return categoryDTO;
    }
    public CategoryDTO getCategoryById(Long id){
        Optional<Category> categoryOptional = categoryRepository.findById(id);
        if (categoryOptional.isPresent()){
            Category category = categoryOptional.get();
            return convertToDTO(category);
        }
        return null;
    }
    public void deleteCategory(Long id){
        categoryRepository.deleteById(id);
    }
    public CategoryDTO updateCategory(Long id,CategoryCreateDTO dto){
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if(optionalCategory.isPresent()){
            Category category = optionalCategory.get();
            category.setName(dto.getName());
            category.setDescription(dto.getDescription());
            Category updatedCategory = categoryRepository.save(category);
            return convertToDTO(updatedCategory);
        }
        return null;
    }


}
