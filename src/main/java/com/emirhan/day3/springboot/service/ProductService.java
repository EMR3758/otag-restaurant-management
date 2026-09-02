package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.ProductCreateDTO;
import com.emirhan.day3.springboot.dto.ProductDTO;
import com.emirhan.day3.springboot.model.Category;
import com.emirhan.day3.springboot.model.OrderItem;
import com.emirhan.day3.springboot.model.Product;
import com.emirhan.day3.springboot.repository.CategoryRepository;
import com.emirhan.day3.springboot.repository.OrderItemRepository;
import com.emirhan.day3.springboot.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
    private final OrderItemRepository orderItemRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
                           OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.categoryRepository= categoryRepository;
        this.orderItemRepository = orderItemRepository;
    }

    private ProductDTO convertToDTO(Product product){
        ProductDTO dto = new ProductDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getCategory().getName(),
                product.getStock(),
                product.getImageUrl()
        );

        dto.setKdsStation(product.getKdsStation());

        return dto;
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
        product.setKdsStation(dto.getKdsStation());

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

    // En çok satılan ürünler. Admin Dashboard'daki "Popüler Ürünler" kartıyla
    // (Dashboard.jsx) BİREBİR AYNI mantık: tüm OrderItem'lar üzerinden (durumdan
    // bağımsız), ürün başına toplam satılan adet hesaplanır, azalan sırayla
    // sıralanır. Müşteri sitesindeki "Öne Çıkan Lezzetler" de bu metodu
    // kullanır — böylece dashboard'da en çok satan ürünlerle ana sayfada
    // gösterilen ürünler aynı gerçek satış verisinden gelir.
    public List<ProductDTO> getPopularProducts(int limit) {
        Map<Long, Long> soldQuantityByProductId = new LinkedHashMap<>();
        for (OrderItem item : orderItemRepository.findAll()) {
            if (item.getProduct() == null) {
                continue;
            }
            soldQuantityByProductId.merge(item.getProduct().getId(), (long) item.getQuantity(), Long::sum);
        }

        return productRepository.findAll().stream()
                .filter(product -> soldQuantityByProductId.getOrDefault(product.getId(), 0L) > 0)
                .sorted((a, b) -> Long.compare(
                        soldQuantityByProductId.getOrDefault(b.getId(), 0L),
                        soldQuantityByProductId.getOrDefault(a.getId(), 0L)
                ))
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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
            product.setKdsStation(dto.getKdsStation());

            // Görsel URL'si boş bırakılırsa imageUrl null/boş olarak kaydedilir.
            product.setImageUrl(dto.getImageUrl());

            Product updatedProduct = productRepository.save(product);

            return convertToDTO(updatedProduct);
        }

        return null;
    }


}