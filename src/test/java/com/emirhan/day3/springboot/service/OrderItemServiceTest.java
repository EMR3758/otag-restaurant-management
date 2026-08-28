package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.OrderItemCreateDTO;
import com.emirhan.day3.springboot.dto.OrderItemDTO;
import com.emirhan.day3.springboot.model.*;
import com.emirhan.day3.springboot.repository.OrderItemRepository;
import com.emirhan.day3.springboot.repository.OrderRepository;
import com.emirhan.day3.springboot.repository.ProductRepository;
import com.emirhan.day3.springboot.repository.RecipeItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderItemServiceTest {

    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private StockService stockService;
    @Mock
    private RecipeItemRepository recipeItemRepository;

    private OrderItemService orderItemService;

    private Product burger;
    private Stock kofteStock;
    private Stock ekmekStock;
    private Order order;

    @BeforeEach
    void setUp() {
        orderItemService = new OrderItemService(
                orderItemRepository, orderRepository, productRepository, stockService, recipeItemRepository
        );

        Category category = new Category("Burgerler", "");
        category.setId(1L);

        burger = new Product("Klasik Burger", 0, 150.0, category);
        burger.setId(1L);

        kofteStock = new Stock(10L, "Köfte", new BigDecimal("10.000"), new BigDecimal("1.000"), StockUnit.KG);
        ekmekStock = new Stock(11L, "Ekmek", new BigDecimal("50"), new BigDecimal("5"), StockUnit.ADET);

        order = new Order();
        order.setId(100L);
    }

    private OrderItem newOrderItem(int quantity, boolean stockDeducted, OrderStatus status) {
        OrderItem orderItem = new OrderItem(order, burger, quantity, burger.getPrice(), null, status, stockDeducted);
        orderItem.setId(1L);
        return orderItem;
    }

    private List<RecipeItem> burgerRecipe() {
        RecipeItem kofte = new RecipeItem(burger, kofteStock, new BigDecimal("0.150"));
        RecipeItem ekmek = new RecipeItem(burger, ekmekStock, new BigDecimal("1"));
        return List.of(kofte, ekmek);
    }

    @Test
    void updateStatus_readyFirstTime_deductsStockAccordingToRecipeAndQuantity() {
        OrderItem orderItem = newOrderItem(2, false, OrderStatus.PREPARING);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));
        when(recipeItemRepository.findByProductId(1L)).thenReturn(burgerRecipe());
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderItemDTO dto = orderItemService.updateStatus(1L, OrderStatus.READY);

        ArgumentCaptor<BigDecimal> kofteAmount = ArgumentCaptor.forClass(BigDecimal.class);
        verify(stockService).decreaseStock(eq(10L), kofteAmount.capture());
        assertThat(kofteAmount.getValue()).isEqualByComparingTo("0.300");

        ArgumentCaptor<BigDecimal> ekmekAmount = ArgumentCaptor.forClass(BigDecimal.class);
        verify(stockService).decreaseStock(eq(11L), ekmekAmount.capture());
        assertThat(ekmekAmount.getValue()).isEqualByComparingTo("2");

        verify(stockService, never()).increaseStock(any(), any());
        assertThat(dto.isStockDeducted()).isTrue();
    }

    @Test
    void updateStatus_fireFirstTime_deductsStockLikeReady() {
        OrderItem orderItem = newOrderItem(1, false, OrderStatus.PREPARING);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));
        when(recipeItemRepository.findByProductId(1L)).thenReturn(burgerRecipe());
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderItemDTO dto = orderItemService.updateStatus(1L, OrderStatus.FIRE);

        verify(stockService).decreaseStock(eq(10L), argThat(a -> a.compareTo(new BigDecimal("0.150")) == 0));
        verify(stockService).decreaseStock(eq(11L), argThat(a -> a.compareTo(BigDecimal.ONE) == 0));
        assertThat(dto.isStockDeducted()).isTrue();
    }

    @Test
    void updateStatus_alreadyDeducted_doesNotDeductTwice() {
        OrderItem orderItem = newOrderItem(2, true, OrderStatus.READY);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(inv -> inv.getArgument(0));

        orderItemService.updateStatus(1L, OrderStatus.READY);

        verifyNoInteractions(stockService);
        verify(recipeItemRepository, never()).findByProductId(any());
    }

    @Test
    void updateStatus_waitingPreparingDelivered_neverTouchStock() {
        for (OrderStatus status : List.of(OrderStatus.WAITING, OrderStatus.PREPARING, OrderStatus.DELIVERED)) {
            OrderItem orderItem = newOrderItem(2, false, OrderStatus.WAITING);
            when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));
            when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(inv -> inv.getArgument(0));

            orderItemService.updateStatus(1L, status);
        }

        verifyNoInteractions(stockService);
    }

    @Test
    void updateStatus_cancelledAfterDeduction_reversesStockAndClearsFlag() {
        OrderItem orderItem = newOrderItem(2, true, OrderStatus.READY);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));
        when(recipeItemRepository.findByProductId(1L)).thenReturn(burgerRecipe());
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderItemDTO dto = orderItemService.updateStatus(1L, OrderStatus.CANCELLED);

        verify(stockService).increaseStock(eq(10L), argThat(a -> a.compareTo(new BigDecimal("0.300")) == 0));
        verify(stockService).increaseStock(eq(11L), argThat(a -> a.compareTo(new BigDecimal("2")) == 0));
        verify(stockService, never()).decreaseStock(any(), any());
        assertThat(dto.isStockDeducted()).isFalse();
    }

    @Test
    void updateStatus_cancelledWithoutPriorDeduction_doesNothing() {
        OrderItem orderItem = newOrderItem(2, false, OrderStatus.WAITING);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(inv -> inv.getArgument(0));

        orderItemService.updateStatus(1L, OrderStatus.CANCELLED);

        verifyNoInteractions(stockService);
    }

    @Test
    void updateOrderItem_quantityChangedAfterDeduction_reversesOldThenDeductsNew() {
        OrderItem orderItem = newOrderItem(2, true, OrderStatus.READY);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));
        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));
        when(productRepository.findById(1L)).thenReturn(Optional.of(burger));
        when(recipeItemRepository.findByProductId(1L)).thenReturn(burgerRecipe());
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderItemCreateDTO dto = new OrderItemCreateDTO(100L, 1L, 3, null);
        orderItemService.updateOrderItem(1L, dto);

        // eski adet (2) geri eklendi
        verify(stockService).increaseStock(eq(10L), argThat(a -> a.compareTo(new BigDecimal("0.300")) == 0));
        verify(stockService).increaseStock(eq(11L), argThat(a -> a.compareTo(new BigDecimal("2")) == 0));
        // yeni adet (3) tekrar düşüldü
        verify(stockService).decreaseStock(eq(10L), argThat(a -> a.compareTo(new BigDecimal("0.450")) == 0));
        verify(stockService).decreaseStock(eq(11L), argThat(a -> a.compareTo(new BigDecimal("3")) == 0));
    }

    @Test
    void updateOrderItem_notYetDeducted_doesNotTouchStock() {
        OrderItem orderItem = newOrderItem(2, false, OrderStatus.WAITING);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));
        when(orderRepository.findById(100L)).thenReturn(Optional.of(order));
        when(productRepository.findById(1L)).thenReturn(Optional.of(burger));
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderItemCreateDTO dto = new OrderItemCreateDTO(100L, 1L, 5, null);
        orderItemService.updateOrderItem(1L, dto);

        verifyNoInteractions(stockService);
        verifyNoInteractions(recipeItemRepository);
    }

    @Test
    void deleteOrderItem_stockDeducted_reversesStockBeforeDeleting() {
        OrderItem orderItem = newOrderItem(2, true, OrderStatus.READY);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));
        when(recipeItemRepository.findByProductId(1L)).thenReturn(burgerRecipe());

        orderItemService.deleteOrderItem(1L);

        verify(stockService).increaseStock(eq(10L), argThat(a -> a.compareTo(new BigDecimal("0.300")) == 0));
        verify(stockService).increaseStock(eq(11L), argThat(a -> a.compareTo(new BigDecimal("2")) == 0));
        verify(orderItemRepository).deleteById(1L);
    }

    @Test
    void deleteOrderItem_notDeducted_deletesWithoutTouchingStock() {
        OrderItem orderItem = newOrderItem(2, false, OrderStatus.WAITING);
        when(orderItemRepository.findById(1L)).thenReturn(Optional.of(orderItem));

        orderItemService.deleteOrderItem(1L);

        verifyNoInteractions(stockService);
        verifyNoInteractions(recipeItemRepository);
        verify(orderItemRepository).deleteById(1L);
    }
}
