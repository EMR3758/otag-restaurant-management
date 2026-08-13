package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.OrderStatus;
import com.emirhan.day3.springboot.model.RestaurantTable;

import java.time.LocalDateTime;
import java.util.List;

public class OrderCreateDTO {
    private LocalDateTime orderDate;
    private OrderStatus status;
    private Long total;
    private Long tableId;
    private List<OrderItemCreateDTO> items;

    public OrderCreateDTO() {
    }
    public OrderCreateDTO(LocalDateTime orderDate, OrderStatus status,Long total,Long tableId,List<OrderItemCreateDTO> items) {
        this.orderDate = orderDate;
        this.status = status;
        this.total=total;
        this.tableId=tableId;
        this.items = items;
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

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public List<OrderItemCreateDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemCreateDTO> items) {
        this.items = items;
    }
}
