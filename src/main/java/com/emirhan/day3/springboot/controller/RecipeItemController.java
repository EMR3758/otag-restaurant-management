package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.RecipeItemCreateDTO;
import com.emirhan.day3.springboot.dto.RecipeItemDTO;
import com.emirhan.day3.springboot.service.RecipeItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipe-items")
public class RecipeItemController {

    private final RecipeItemService recipeItemService;

    public RecipeItemController(RecipeItemService recipeItemService) {
        this.recipeItemService = recipeItemService;
    }

    @GetMapping
    public ResponseEntity<List<RecipeItemDTO>> getAllRecipeItems() {
        return ResponseEntity.ok(recipeItemService.getAllRecipeItems());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<RecipeItemDTO>> getRecipeItemsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(recipeItemService.getRecipeItemsByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<RecipeItemDTO> addRecipeItem(@RequestBody RecipeItemCreateDTO dto) {
        return ResponseEntity.ok(recipeItemService.addRecipeItem(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeItemDTO> updateRecipeItem(@PathVariable Long id, @RequestBody RecipeItemCreateDTO dto) {
        return ResponseEntity.ok(recipeItemService.updateRecipeItem(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipeItem(@PathVariable Long id) {
        recipeItemService.deleteRecipeItem(id);
        return ResponseEntity.noContent().build();
    }
}
