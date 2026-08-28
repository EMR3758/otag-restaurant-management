package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.OrderStatus;
import com.emirhan.day3.springboot.model.RestaurantTable;

import java.time.LocalDateTime;

public class OrderDTO {
    private Long id;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private Long total;
    private RestaurantTable table;
    private String tableNumber;


    public OrderDTO() {
    }
    public OrderDTO(Long id, LocalDateTime orderDate, OrderStatus status,Long total, RestaurantTable table,String tableNumber) {
        this.id = id;
        this.orderDate = orderDate;
        this.status = status;
        this.total=total;
        this.table=table;
        this.tableNumber = tableNumber;
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

    public RestaurantTable getTable() {
        return table;
    }

    public void setTable(RestaurantTable table) {
        this.table = table;
    }
    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }
}
