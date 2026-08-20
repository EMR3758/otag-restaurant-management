package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.ProductCreateDTO;
import com.emirhan.day3.springboot.dto.ProductDTO;
import com.emirhan.day3.springboot.model.Category;
import com.emirhan.day3.springboot.model.Product;
import com.emirhan.day3.springboot.repository.CategoryRepository;
import com.emirhan.day3.springboot.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    /*
     * ================= DEPENDENCY INJECTION MANTIĞI =================
     *
     * SHOPPING PROJESİ                  SPRING BOOT
     *
     * CartItem                          ProductService
     *    ↓                                  ↓
     * Product'a ihtiyacı var            ProductRepository'ye ihtiyacı var
     *    ↓                                  ↓
     * private Product product;          private ProductRepository productRepository;
     *    ↓                                  ↓
     * Constructor'dan alır              Constructor'dan alır
     *
     *
     * ÖNEMLİ FARK:
     *
     * Shopping projesinde Product'ı BİZ oluşturuyorduk:
     *
     * Product laptop = new Product(...);
     * CartItem item = new CartItem(laptop, 2);
     *
     *
     * Spring Boot'ta ProductRepository'yi biz "new" yapmıyoruz.
     *
     * Spring oluşturuyor ve ProductService'e veriyor.
     *
     * Buna:
     *
     *              DEPENDENCY INJECTION
     *
     * denir.
     *
     * Kısaca:
     *
     * "İhtiyacım olan nesneyi kendim oluşturmak yerine
     *  Spring bana veriyor."
     *
     * ================================================================
     */


    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository= categoryRepository;
    }

    private ProductDTO convertToDTO(Product product){
        return new ProductDTO(
          product.getId(),
          product.getName(),
          product.getPrice(),
          product.getCategory().getName(),
          product.getStock(),
          product.getImageUrl()
        );
    }

    private Product convertToProduct(ProductCreateDTO dto) {

        Category category = categoryRepository
                .findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Kategori bulunamadı"));

        Product product = new Product(
                dto.getName(),
                dto.getStock(),
                dto.getPrice(),
                category
        );
        product.setImageUrl(dto.getImageUrl());

        return product;
    }


    // DB'den Product'ları getir
    // → Boş DTO listesi oluştur
    // → Her Product'ı DTO'ya çevir
    // → DTO listesine ekle
    // → DTO listesini döndür
    public List<ProductDTO> getAllProducts(){
         List<Product> products= productRepository.findAll();
         List<ProductDTO> productDTOList = new ArrayList<>();
         for(Product product : products){
             ProductDTO dto = convertToDTO(product);
             productDTOList.add(dto);
         }
         return productDTOList;

    }
        public ProductDTO addProduct(ProductCreateDTO dto){
          Product product = convertToProduct(dto);
          Product savedProduct = productRepository.save(product);
          ProductDTO productDTO = convertToDTO(savedProduct);
          return productDTO;
    }
    public ProductDTO getProductById(Long id){
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()){
            Product product = productOptional.get();
            return convertToDTO(product);
        }
        return null;
    }
    public void deleteProducts(Long id){
        productRepository.deleteById(id);
    }

        public ProductDTO updateProduct(Long id,ProductCreateDTO dto){
        Optional<Product> productOptional =
                productRepository.findById(id);
        if(productOptional.isPresent()){
            Product product = productOptional.get();

            Category category = categoryRepository
                    .findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Kategori bulunamadı"));

            product.setName(dto.getName());
            product.setStock(dto.getStock());
            product.setPrice(dto.getPrice());
            product.setCategory(category);

            // Görsel URL'si boş bırakılırsa imageUrl null/boş olarak kaydedilir.
            product.setImageUrl(dto.getImageUrl());

            Product updatedProduct = productRepository.save(product);

            return convertToDTO(updatedProduct);
        }

        return null;
    }


}