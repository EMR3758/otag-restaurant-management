package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.ProductCreateDTO;
import com.emirhan.day3.springboot.dto.ProductDTO;
import com.emirhan.day3.springboot.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ProductController {
    private final ProductService productService;
    public ProductController(ProductService productService){
        this.productService=productService;
    }

    @GetMapping("/products")
    public List<ProductDTO> getAllProducts() {
        return  productService.getAllProducts();
    }

    // Müşteri sitesindeki "Öne Çıkan Lezzetler" için: admin Dashboard'daki
    // "Popüler Ürünler" ile aynı gerçek satış verisine (OrderItem toplamları)
    // dayalı, en çok satılan ürünler. bkz. ProductService.getPopularProducts.
    @GetMapping("/products/popular")
    public List<ProductDTO> getPopularProducts(@RequestParam(defaultValue = "4") int limit) {
        return productService.getPopularProducts(limit);
    }

    @PostMapping("/products")
    public ProductDTO addProduct(@RequestBody ProductCreateDTO dto){
        return productService.addProduct(dto);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id){
        ProductDTO productDTO = productService.getProductById(id);
        if (productDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productDTO);
    }
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProducts(id);

    }

    @PutMapping("/products/{id}")
    public ProductDTO updateProduct(@PathVariable Long id,@RequestBody ProductCreateDTO dto){
        return productService.updateProduct(id, dto);
    }





}
