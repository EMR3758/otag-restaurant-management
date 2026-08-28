package com.emirhan.day3.springboot.controller;

import com.emirhan.day3.springboot.dto.OrderItemCreateDTO;
import com.emirhan.day3.springboot.dto.OrderItemDTO;
import com.emirhan.day3.springboot.model.OrderStatus;
import com.emirhan.day3.springboot.service.OrderItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @GetMapping
    public List<OrderItemDTO> getAllOrderItems() {
        return orderItemService.getAllOrderItem();
    }

    @PostMapping
    public OrderItemDTO createOrderItem(@RequestBody OrderItemCreateDTO dto) {
        return orderItemService.addOrderItem(dto);
    }

    @GetMapping("/{id}")
    public OrderItemDTO getByIdOrderItem(@PathVariable Long id) {
        return orderItemService.getByIdOrderItem(id);
    }

    @PutMapping("/{id}")
    public OrderItemDTO updateOrderItem(@PathVariable Long id,
                                        @RequestBody OrderItemCreateDTO dto) {
        return orderItemService.updateOrderItem(id, dto);
    }
    @PutMapping("/{id}/status")
    public OrderItemDTO updateStatus(@PathVariable Long id, @RequestParam OrderStatus status){
        return orderItemService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void deleteOrderItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
    }
}
