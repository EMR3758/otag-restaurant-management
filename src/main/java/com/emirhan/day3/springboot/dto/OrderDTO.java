package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.OrderStatus;

import java.time.LocalDateTime;

public class OrderDTO {
    private Long id;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private Long total;

    public OrderDTO() {
    }
    public OrderDTO(Long id, LocalDateTime orderDate, OrderStatus status,Long total) {
        this.id = id;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
