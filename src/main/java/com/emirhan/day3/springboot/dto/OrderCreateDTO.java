package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.OrderStatus;

import java.time.LocalDateTime;

public class OrderCreateDTO {
    private LocalDateTime orderDate;
    private OrderStatus status;
    private Long total;

    public OrderCreateDTO() {
    }
    public OrderCreateDTO(LocalDateTime orderDate, OrderStatus status,Long total) {
        this.orderDate = orderDate;
        this.status = status;
        this.total=total;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}
