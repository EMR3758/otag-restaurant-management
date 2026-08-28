package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.RecipeItemCreateDTO;
import com.emirhan.day3.springboot.dto.RecipeItemDTO;
import com.emirhan.day3.springboot.model.Product;
import com.emirhan.day3.springboot.model.RecipeItem;
import com.emirhan.day3.springboot.model.Stock;
import com.emirhan.day3.springboot.repository.ProductRepository;
import com.emirhan.day3.springboot.repository.RecipeItemRepository;
import com.emirhan.day3.springboot.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecipeItemService {

    private final RecipeItemRepository recipeItemRepository;
    private final ProductRepository productRepository;
    private final StockRepository stockRepository;

    public RecipeItemService(RecipeItemRepository recipeItemRepository,
                              ProductRepository productRepository,
                              StockRepository stockRepository) {
        this.recipeItemRepository = recipeItemRepository;
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    private RecipeItemDTO convertToDTO(RecipeItem recipeItem) {
        return new RecipeItemDTO(
                recipeItem.getId(),
                recipeItem.getProduct().getId(),
                recipeItem.getProduct().getName(),
                recipeItem.getStock().getId(),
                recipeItem.getStock().getProductName(),
                recipeItem.getQuantityPerUnit(),
                recipeItem.getStock().getUnit()
        );
    }

    private RecipeItem convertToRecipeItem(RecipeItemCreateDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı."));
        Stock stock = stockRepository.findById(dto.getStockId())
                .orElseThrow(() -> new RuntimeException("Stok kalemi bulunamadı."));
        return new RecipeItem(product, stock, dto.getQuantityPerUnit());
    }

    public List<RecipeItemDTO> getAllRecipeItems() {
        List<RecipeItemDTO> result = new ArrayList<>();
        for (RecipeItem recipeItem : recipeItemRepository.findAll()) {
            result.add(convertToDTO(recipeItem));
        }
        return result;
    }

    public List<RecipeItemDTO> getRecipeItemsByProduct(Long productId) {
        List<RecipeItemDTO> result = new ArrayList<>();
        for (RecipeItem recipeItem : recipeItemRepository.findByProductId(productId)) {
            result.add(convertToDTO(recipeItem));
        }
        return result;
    }

    public RecipeItemDTO addRecipeItem(RecipeItemCreateDTO dto) {
        RecipeItem recipeItem = convertToRecipeItem(dto);
        return convertToDTO(recipeItemRepository.save(recipeItem));
    }

    public RecipeItemDTO updateRecipeItem(Long id, RecipeItemCreateDTO dto) {
        RecipeItem recipeItem = recipeItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reçete kalemi bulunamadı."));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı."));
        Stock stock = stockRepository.findById(dto.getStockId())
                .orElseThrow(() -> new RuntimeException("Stok kalemi bulunamadı."));

        recipeItem.setProduct(product);
        recipeItem.setStock(stock);
        recipeItem.setQuantityPerUnit(dto.getQuantityPerUnit());

        return convertToDTO(recipeItemRepository.save(recipeItem));
    }

    public void deleteRecipeItem(Long id) {
        recipeItemRepository.deleteById(id);
    }
}
