package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.KdsStation;
import com.emirhan.day3.springboot.model.OrderStatus;


public class OrderItemDTO {
    private Long id;
    private Long orderId;
    private Long productId;
    private int quantity;
    private double unitPrice;
    private String note;
    private OrderStatus status;
    private boolean stockDeducted;
    private String productName;
    private KdsStation station;

    public OrderItemDTO(){}

    public OrderItemDTO(Long id, Long orderId, Long productId, int quantity, double unitPrice, String note,OrderStatus status,boolean stockDeducted,String productName,KdsStation kdsStation) {
        this.id = id;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.note = note;
        this.status=status;
        this.stockDeducted=stockDeducted;
        this.productName=productName;
        this.station=kdsStation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
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

    public boolean isStockDeducted() {
        return stockDeducted;
    }

    public void setStockDeducted(boolean stockDeducted) {
        this.stockDeducted = stockDeducted;
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
}
