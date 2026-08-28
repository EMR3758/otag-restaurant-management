package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.OrderItemCreateDTO;
import com.emirhan.day3.springboot.dto.OrderItemDTO;
import com.emirhan.day3.springboot.dto.RecipeItemCreateDTO;
import com.emirhan.day3.springboot.dto.StockDetails;
import com.emirhan.day3.springboot.model.*;
import com.emirhan.day3.springboot.repository.CategoryRepository;
import com.emirhan.day3.springboot.repository.OrderRepository;
import com.emirhan.day3.springboot.repository.ProductRepository;
import com.emirhan.day3.springboot.repository.RecipeItemRepository;
import com.emirhan.day3.springboot.repository.StockRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Gerçek servisler (mock yok) ile uçtan uca reçete tabanlı stok tüketimi senaryosu.
 * @Transactional: test sonunda DB değişiklikleri rollback edilir, dev veritabanı kirlenmez.
 */
@SpringBootTest
@Transactional
class OrderItemStockScenarioTest {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private StockRepository stockRepository;
    @Autowired
    private StockService stockService;
    @Autowired
    private RecipeItemService recipeItemService;
    @Autowired
    private RecipeItemRepository recipeItemRepository;
    @Autowired
    private OrderItemService orderItemService;
    @Autowired
    private EntityManager entityManager;

    private Product klasikBurger;
    private Stock domatesStock;
    private Stock kofteStock;
    private Stock ekmekStock;
    private Order order;

    @BeforeEach
    void setUp() {
        Category category = categoryRepository.save(new Category("Burgerler-Test", "senaryo testi"));

        klasikBurger = productRepository.save(new Product("Klasik Burger (Senaryo)", 0, 150.0, category));

        domatesStock = stockService.createStock(
                new StockDetails("Domates (Senaryo)", new BigDecimal("20"), new BigDecimal("2"), StockUnit.KG));
        kofteStock = stockService.createStock(
                new StockDetails("Köfte (Senaryo)", new BigDecimal("20"), new BigDecimal("2"), StockUnit.KG));
        ekmekStock = stockService.createStock(
                new StockDetails("Ekmek (Senaryo)", new BigDecimal("50"), new BigDecimal("5"), StockUnit.ADET));

        recipeItemService.addRecipeItem(new RecipeItemCreateDTO(klasikBurger.getId(), domatesStock.getId(), new BigDecimal("0.05")));
        recipeItemService.addRecipeItem(new RecipeItemCreateDTO(klasikBurger.getId(), kofteStock.getId(), new BigDecimal("0.15")));
        recipeItemService.addRecipeItem(new RecipeItemCreateDTO(klasikBurger.getId(), ekmekStock.getId(), new BigDecimal("1")));

        order = orderRepository.save(new Order(LocalDateTime.now(), OrderStatus.WAITING, 0L, null));
    }

    private Stock reload(Stock stock) {
        return stockRepository.findById(stock.getId()).orElseThrow();
    }

    @Test
    void fullScenario_ready_cancel_readyAgain_unitsIsolated() {
        OrderItemCreateDTO createDTO = new OrderItemCreateDTO(order.getId(), klasikBurger.getId(), 10, null);
        OrderItemDTO orderItemDTO = orderItemService.addOrderItem(createDTO);
        Long orderItemId = orderItemDTO.getId();

        // --- 1) READY: 10 adet Klasik Burger için reçeteye göre stok düşmeli ---
        OrderItemDTO afterReady = orderItemService.updateStatus(orderItemId, OrderStatus.READY);
        assertThat(afterReady.isStockDeducted()).isTrue();

        Stock domatesAfterReady = reload(domatesStock);
        Stock kofteAfterReady = reload(kofteStock);
        Stock ekmekAfterReady = reload(ekmekStock);

        // 20 - (0.05 * 10) = 19.5 KG
        assertThat(domatesAfterReady.getQuantity()).isEqualByComparingTo("19.50");
        // 20 - (0.15 * 10) = 18.5 KG
        assertThat(kofteAfterReady.getQuantity()).isEqualByComparingTo("18.50");
        // 50 - (1 * 10) = 40 ADET
        assertThat(ekmekAfterReady.getQuantity()).isEqualByComparingTo("40");

        // birimler değişmedi
        assertThat(domatesAfterReady.getUnit()).isEqualTo(StockUnit.KG);
        assertThat(kofteAfterReady.getUnit()).isEqualTo(StockUnit.KG);
        assertThat(ekmekAfterReady.getUnit()).isEqualTo(StockUnit.ADET);

        // --- 2) CANCELLED: stoklar tamamen eski haline dönmeli ---
        OrderItemDTO afterCancel = orderItemService.updateStatus(orderItemId, OrderStatus.CANCELLED);
        assertThat(afterCancel.isStockDeducted()).isFalse();

        assertThat(reload(domatesStock).getQuantity()).isEqualByComparingTo("20");
        assertThat(reload(kofteStock).getQuantity()).isEqualByComparingTo("20");
        assertThat(reload(ekmekStock).getQuantity()).isEqualByComparingTo("50");

        // --- 3) READY -> READY: ikinci READY'de tekrar düşüm olmamalı ---
        orderItemService.updateStatus(orderItemId, OrderStatus.READY);

        Stock domatesAfterFirstReady = reload(domatesStock);
        Stock kofteAfterFirstReady = reload(kofteStock);
        Stock ekmekAfterFirstReady = reload(ekmekStock);
        assertThat(domatesAfterFirstReady.getQuantity()).isEqualByComparingTo("19.50");
        assertThat(kofteAfterFirstReady.getQuantity()).isEqualByComparingTo("18.50");
        assertThat(ekmekAfterFirstReady.getQuantity()).isEqualByComparingTo("40");

        OrderItemDTO afterSecondReady = orderItemService.updateStatus(orderItemId, OrderStatus.READY);
        assertThat(afterSecondReady.isStockDeducted()).isTrue();

        // ikinci READY sonrası miktarlar birebir aynı kalmalı (ikinci kez düşülmedi)
        assertThat(reload(domatesStock).getQuantity()).isEqualByComparingTo("19.50");
        assertThat(reload(kofteStock).getQuantity()).isEqualByComparingTo("18.50");
        assertThat(reload(ekmekStock).getQuantity()).isEqualByComparingTo("40");

        // --- 4) Farklı birimlerdeki stoklar birbirine karışmamalı ---
        // KG stokları (domates/köfte) ondalıklı düştü, ADET stoku (ekmek) tam sayı düştü;
        // her stok yalnızca kendi reçete satırındaki miktar kadar etkilendi.
        assertThat(reload(domatesStock).getUnit()).isEqualTo(StockUnit.KG);
        assertThat(reload(kofteStock).getUnit()).isEqualTo(StockUnit.KG);
        assertThat(reload(ekmekStock).getUnit()).isEqualTo(StockUnit.ADET);
        assertThat(reload(domatesStock).getQuantity()).isNotEqualByComparingTo(reload(kofteStock).getQuantity());
        assertThat(reload(ekmekStock).getQuantity()).isNotEqualByComparingTo(reload(domatesStock).getQuantity());
    }

    @Test
    void quantityPerUnit_threeDecimalPrecision_isPersistedWithoutRounding() {
        RecipeItem recipeItem = new RecipeItem(klasikBurger, kofteStock, new BigDecimal("0.125"));
        RecipeItem saved = recipeItemRepository.saveAndFlush(recipeItem);

        // birinci seviye önbelleği devre dışı bırakıp veriyi doğrudan DB'den okuyoruz
        entityManager.clear();

        RecipeItem reloaded = recipeItemRepository.findById(saved.getId()).orElseThrow();

        assertThat(reloaded.getQuantityPerUnit()).isEqualByComparingTo("0.125");
    }
}
