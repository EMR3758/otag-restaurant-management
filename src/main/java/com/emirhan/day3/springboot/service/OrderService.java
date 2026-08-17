package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.OrderCreateDTO;
import com.emirhan.day3.springboot.dto.OrderDTO;
import com.emirhan.day3.springboot.dto.OrderItemCreateDTO;
import com.emirhan.day3.springboot.model.Order;
import com.emirhan.day3.springboot.model.OrderItem;
import com.emirhan.day3.springboot.model.Product;
import com.emirhan.day3.springboot.model.RestaurantTable;
import com.emirhan.day3.springboot.repository.OrderItemRepository;
import com.emirhan.day3.springboot.repository.OrderRepository;
import com.emirhan.day3.springboot.repository.ProductRepository;
import com.emirhan.day3.springboot.repository.RestaurantTableRepository;
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

    public OrderService(OrderRepository orderRepository,RestaurantTableRepository restaurantTableRepository,OrderItemRepository orderItemRepository,ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.restaurantTableRepository=restaurantTableRepository;
        this.orderItemRepository=orderItemRepository;
        this.productRepository=productRepository;
    }

    private OrderDTO convertToDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotal(),
                order.getTable()

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
            orderItemRepository.save(orderItem);
        }

        //5.Sipariş başarıyla oluşturuldu, masayı dolu olarak işaretle
        table.setAvailable(false);
        restaurantTableRepository.save(table);

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

    public OrderDTO updateOrder(Long id, OrderCreateDTO dto) {
        Optional<Order> optionalOrder = orderRepository.findById(id);

        if (optionalOrder.isPresent()) {

            Order order = optionalOrder.get();

            order.setOrderDate(dto.getOrderDate());
            order.setStatus(dto.getStatus());
            order.setTotal(dto.getTotal());

            RestaurantTable table = restaurantTableRepository
                    .findById(dto.getTableId())
                    .orElseThrow(() -> new RuntimeException("Masa bulunamadı"));

            order.setTable(table);

            Order updatedOrder = orderRepository.save(order);

            return convertToDTO(updatedOrder);
        }

        return null;
    }

    @Transactional
    public void deleteOrder(Long id) {
        // Order silinmeden önce, ona bağlı OrderItem'lar silinmeli.
        // Aksi halde order_item.order_id foreign key kısıtlaması yüzünden
        // orders satırı silinirken DataIntegrityViolationException oluşur.
        orderItemRepository.deleteByOrder_Id(id);
        orderRepository.deleteById(id);
    }

}