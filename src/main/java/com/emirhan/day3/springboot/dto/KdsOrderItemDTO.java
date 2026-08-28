package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.KdsStation;
import com.emirhan.day3.springboot.model.OrderStatus;

public class KdsOrderItemDTO {
    private Long id;
    private String productName;
    private KdsStation station;
    private int quantity;
    private String note;
    private OrderStatus status;

    public KdsOrderItemDTO(Long id, String productName, KdsStation station, int quantity, String note, OrderStatus status) {
        this.id = id;
        this.productName = productName;
        this.station = station;
        this.quantity = quantity;
        this.note = note;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public KdsStation getStation() {
        return station;
    }

    public void setStation(KdsStation station) {
        this.station = station;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
