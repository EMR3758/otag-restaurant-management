package com.emirhan.day3.springboot.service;

import com.emirhan.day3.springboot.dto.OrderCreateDTO;
import com.emirhan.day3.springboot.dto.OrderDTO;
import com.emirhan.day3.springboot.model.Order;
import com.emirhan.day3.springboot.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    private OrderDTO convertToDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotal()

        );
    }

    private Order convertToOrder(OrderCreateDTO dto) {
        return new Order(
                dto.getOrderDate(),
                dto.getStatus(),
                dto.getTotal()
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
        Order order = convertToOrder(dto);
        Order savedOrder = orderRepository.save(order);
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

            Order updatedOrder = orderRepository.save(order);

            return convertToDTO(updatedOrder);
        }

        return null;
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

}