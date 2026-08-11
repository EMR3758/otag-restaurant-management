package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.OrderCreateDTO;
import com.emirhan.day3.springboot.dto.OrderDTO;
import com.emirhan.day3.springboot.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping
    public OrderDTO createOrder(@RequestBody OrderCreateDTO dto) {
        return orderService.createOrder(dto);
    }

    @GetMapping("/{id}")
    public OrderDTO getByIdOrder(@PathVariable Long id) {
        return orderService.getByIdOrder(id);
    }

    @PutMapping("/{id}")
    public OrderDTO updateOrder(@PathVariable Long id,
                                @RequestBody OrderCreateDTO dto) {
        return orderService.updateOrder(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
}