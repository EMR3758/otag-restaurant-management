package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.*;
import com.emirhan.day3.springboot.model.*;
import com.emirhan.day3.springboot.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    private final OrderItemService orderItemService;

    public OrderService(OrderRepository orderRepository,RestaurantTableRepository restaurantTableRepository,OrderItemRepository orderItemRepository,ProductRepository productRepository,NotificationService notificationService,OrderItemService orderItemService) {
        this.orderRepository = orderRepository;
        this.restaurantTableRepository=restaurantTableRepository;
        this.orderItemRepository=orderItemRepository;
        this.productRepository=productRepository;
        this.notificationService=notificationService;
        this.orderItemService=orderItemService;
    }

    private OrderDTO convertToDTO(Order order) {
        String tableNumber;
        if (order.getTable() != null) {
            tableNumber = order.getTable().getTableNumber();
        } else {
            tableNumber = "Dışarıdan Sipariş";
        }
        return new OrderDTO(
                order.getId(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotal(),
                order.getTable(),
                tableNumber
        );
    }

    private Order convertToOrder(OrderCreateDTO dto) {
        RestaurantTable table = restaurantTableRepository.findById(dto.getTableId()).orElseThrow(()-> new RuntimeException("Masa bulunamadı"));
        return new Order(
                dto.getOrderDate(),
                dto.getStatus(),
                dto.getTotal(),
                table
        );
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderDTO> orderDTOList = new ArrayList<>();

        for (Order order : orders) {
            orderDTOList.add(convertToDTO(order));
        }

        return orderDTOList;
    }

    public OrderDTO createOrder(OrderCreateDTO dto) {
        //1.Masa Kontrolü
        RestaurantTable table = restaurantTableRepository.findById(dto.getTableId()).orElseThrow(()->new RuntimeException("Masa bulunamadı"));
        //2.Sipariş oluştur
        Order order = new Order(
                dto.getOrderDate(),
                dto.getStatus(),
                dto.getTotal(),
                table
        );
        //3.Siparişi kaydet
        Order savedOrder = orderRepository.save(order);

        //4.OrderItem'ları oluştur ve kaydet
        for(OrderItemCreateDTO itemDto : dto.getItems()){
            Product product = productRepository.findById(itemDto.getProductId()).orElseThrow(()->new RuntimeException("Ürün bulunamadı: "+itemDto.getProductId() ));
            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    product,
                    itemDto.getQuantity(),
                    product.getPrice(),
                    itemDto.getNote()
            );
            orderItem.setStation(product.getKdsStation());
            orderItem.setStatus(OrderStatus.WAITING);
            orderItemRepository.save(orderItem);
        }

        //5.Sipariş başarıyla oluşturuldu, masayı dolu olarak işaretle
        table.setAvailable(false);
        restaurantTableRepository.save(table);

        notificationService.createNotification(
                1L,
                 "Yeni Sipariş",
                 "Yeni bir sipariş oluşturuldu.Masa: " +table.getId(),
                "ORDER"
        );

        //.Oluşturulan siparişi döndür
        return convertToDTO(savedOrder);
    }

    public OrderDTO getByIdOrder(Long id) {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {
            return convertToDTO(optionalOrder.get());
        }

        return null;
    }

    @Transactional
    public OrderDTO updateOrder(Long id, OrderCreateDTO dto) {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {

            Order order = optionalOrder.get();

            order.setOrderDate(dto.getOrderDate());
            order.setStatus(dto.getStatus());
            order.setTotal(dto.getTotal());

            if (dto.getTableId() != null) {

                RestaurantTable table = restaurantTableRepository
                        .findById(dto.getTableId())
                        .orElseThrow(() -> new RuntimeException("Masa bulunamadı"));

                order.setTable(table);

            }

            Order updatedOrder = orderRepository.save(order);

            // Sipariş iptal edildiğinde, ona bağlı bütün OrderItem'lar da CANCELLED
            // yapılmalı (aksi halde KDS ekranı bu kalemleri hâlâ aktif gösterir).
            // Stok geri ekleme/idempotentlik dahil mevcut kural OrderItemService.updateStatus()
            // içinde zaten var; burada tekrar yazmak yerine aynen o metot çağrılıyor.
            if (dto.getStatus() == OrderStatus.CANCELLED) {
                List<OrderItem> items = orderItemRepository.findByOrder_Id(id);
                for (OrderItem item : items) {
                    orderItemService.updateStatus(item.getId(), OrderStatus.CANCELLED);
                }
            }

            return convertToDTO(updatedOrder);
        }

        return null;
    }

    @Transactional
    public void deleteOrder(Long id) {
        orderItemRepository.deleteByOrder_Id(id);
        orderRepository.deleteById(id);
    }

}