package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.OrderItemCreateDTO;
import com.emirhan.day3.springboot.dto.OrderItemDTO;
import com.emirhan.day3.springboot.model.*;
import com.emirhan.day3.springboot.repository.OrderItemRepository;
import com.emirhan.day3.springboot.repository.OrderRepository;
import com.emirhan.day3.springboot.repository.ProductRepository;
import com.emirhan.day3.springboot.repository.RecipeItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final StockService stockService;
    private final RecipeItemRepository recipeItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository,
                            OrderRepository orderRepository,
                            ProductRepository productRepository,
                            StockService stockService,
                            RecipeItemRepository recipeItemRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.stockService = stockService;
        this.recipeItemRepository = recipeItemRepository;
    }

    private OrderItemDTO convertToDTO(OrderItem orderItem) {
        return new OrderItemDTO(
                orderItem.getId(),
                orderItem.getOrder().getId(),
                orderItem.getProduct().getId(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getNote(),
                orderItem.getStatus(),
                orderItem.isStockDeducted(),
                orderItem.getProduct().getName(),
                orderItem.getStation()
        );
    }

    private OrderItem convertToOrderItem(OrderItemCreateDTO dto) {

        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow();

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow();

        OrderItem orderItem = new OrderItem(
                order,
                product,
                dto.getQuantity(),
                product.getPrice(),
                dto.getNote(),
                OrderStatus.WAITING,
                false
        );
        orderItem.setStation(product.getKdsStation());
        return orderItem;
    }

    // Ürünün reçetesindeki her stok kalemini, sipariş adediyle çarpıp düşer/geri ekler.
    private void adjustStockForOrderItem(Product product, int quantity, boolean deduct) {
        List<RecipeItem> recipeItems = recipeItemRepository.findByProductId(product.getId());
        for (RecipeItem recipeItem : recipeItems) {
            BigDecimal amount = recipeItem.getQuantityPerUnit().multiply(BigDecimal.valueOf(quantity));
            if (deduct) {
                stockService.decreaseStock(recipeItem.getStock().getId(), amount);
            } else {
                stockService.increaseStock(recipeItem.getStock().getId(), amount);
            }
        }
    }

    public List<OrderItemDTO> getAllOrderItem(){
        List<OrderItem> orderItems = orderItemRepository.findAll();
        List<OrderItemDTO> orderItemDTOList = new ArrayList<>();
        for(OrderItem orderItem : orderItems ){
            orderItemDTOList.add(convertToDTO(orderItem));
        }
        return orderItemDTOList;
    }
    public OrderItemDTO addOrderItem(OrderItemCreateDTO dto){
        OrderItem orderItem = convertToOrderItem(dto);
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        OrderItemDTO orderItemDTO = convertToDTO(savedOrderItem);
        return orderItemDTO;
    }

    public OrderItemDTO getByIdOrderItem(Long id) {

        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow();

        return convertToDTO(orderItem);
    }

    @Transactional
    public void deleteOrderItem(Long id){
        OrderItem orderItem = orderItemRepository.findById(id).orElseThrow();
        if (orderItem.isStockDeducted()) {
            adjustStockForOrderItem(orderItem.getProduct(), orderItem.getQuantity(), false);
        }
        orderItemRepository.deleteById(id);
    }

    @Transactional
    public OrderItemDTO updateOrderItem(Long id,OrderItemCreateDTO dto){
        OrderItem orderItem = orderItemRepository.findById(id).orElseThrow();
        Order order = orderRepository.findById(dto.getOrderId()).orElseThrow();
        Product newProduct = productRepository.findById(dto.getProductId()).orElseThrow();

        boolean productChanged = !orderItem.getProduct().getId().equals(newProduct.getId());
        boolean quantityChanged = orderItem.getQuantity() != dto.getQuantity();

        if (orderItem.isStockDeducted() && (productChanged || quantityChanged)) {
            // Daha önce düşülmüş stoğu eski ürün/adet üzerinden geri ekle,
            // sonra yeni ürün/adet üzerinden tekrar düş. Böylece stok tutarsızlığı oluşmaz.
            adjustStockForOrderItem(orderItem.getProduct(), orderItem.getQuantity(), false);
            adjustStockForOrderItem(newProduct, dto.getQuantity(), true);
        }

        orderItem.setOrder(order);
        orderItem.setProduct(newProduct);
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setUnitPrice(newProduct.getPrice());
        orderItem.setNote(dto.getNote());

        OrderItem updatedOrderItem = orderItemRepository.save(orderItem);

        return convertToDTO(updatedOrderItem);

    }

    @Transactional
    public OrderItemDTO updateStatus(Long id,OrderStatus newStatus){
        OrderItem orderItem = orderItemRepository.findById(id).orElseThrow(()->new RuntimeException("Sipariş ürünü bulunamadı."));
        orderItem.setStatus(newStatus);
        if((newStatus == OrderStatus.READY || newStatus == OrderStatus.FIRE) && !orderItem.isStockDeducted()){
            adjustStockForOrderItem(orderItem.getProduct(), orderItem.getQuantity(), true);
            orderItem.setStockDeducted(true);
        } else if (newStatus == OrderStatus.CANCELLED && orderItem.isStockDeducted()) {
            adjustStockForOrderItem(orderItem.getProduct(), orderItem.getQuantity(), false);
            orderItem.setStockDeducted(false);
        }
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);

        // KDS'den (veya başka bir yerden) bir kalem CANCELLED yapıldığında,
        // aynı siparişe ait bütün kalemler de CANCELLED ise siparişin kendisi
        // de CANCELLED olarak işaretlenir. Herhangi bir kalem hâlâ aktifse
        // Order.status'a dokunulmaz (sipariş kısmen devam ediyor demektir).
        if (newStatus == OrderStatus.CANCELLED) {
            cancelOrderIfAllItemsCancelled(savedOrderItem.getOrder());
        }

        return convertToDTO(savedOrderItem);

    }

    private void cancelOrderIfAllItemsCancelled(Order order) {
        if (order.getStatus() == OrderStatus.CANCELLED) {
            return;
        }
        List<OrderItem> items = orderItemRepository.findByOrder_Id(order.getId());
        boolean allCancelled = items.stream().allMatch(item -> item.getStatus() == OrderStatus.CANCELLED);
        if (allCancelled) {
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        }
    }


}
