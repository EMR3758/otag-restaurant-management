package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.OrderItemCreateDTO;
import com.emirhan.day3.springboot.dto.OrderItemDTO;
import com.emirhan.day3.springboot.model.Order;
import com.emirhan.day3.springboot.model.OrderItem;
import com.emirhan.day3.springboot.model.Product;
import com.emirhan.day3.springboot.repository.OrderItemRepository;
import com.emirhan.day3.springboot.repository.OrderRepository;
import com.emirhan.day3.springboot.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderItemService(OrderItemRepository orderItemRepository,
                            OrderRepository orderRepository,
                            ProductRepository productRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    private OrderItemDTO convertToDTO(OrderItem orderItem) {
        return new OrderItemDTO(
                orderItem.getId(),
                orderItem.getOrder().getId(),
                orderItem.getProduct().getId(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getNote()
        );
    }

    private OrderItem convertToOrderItem(OrderItemCreateDTO dto) {

        Order order = orderRepository.findById(dto.getOrderId()).orElseThrow();

        Product product = productRepository.findById(dto.getProductId()).orElseThrow();

        return new OrderItem(
                order,
                product,
                dto.getQuantity(),
                product.getPrice(),
                dto.getNote()
        );
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

    public void deleteOrderItem(Long id){
        orderItemRepository.deleteById(id);
    }

    public OrderItemDTO updateOrderItem(Long id,OrderItemCreateDTO dto){
        OrderItem orderItem = orderItemRepository.findById(id).orElseThrow();
        Order order = orderRepository.findById(dto.getOrderId()).orElseThrow();
        Product product = productRepository.findById(dto.getProductId()).orElseThrow();

        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(dto.getQuantity());orderItem.setUnitPrice(product.getPrice());
        orderItem.setNote(dto.getNote());

        OrderItem updatedOrderItem = orderItemRepository.save(orderItem);

        return convertToDTO(updatedOrderItem);

    }

}