package com.emirhan.day3.springboot.dto;

public class  OrderItemCreateDTO {
    private Long orderId;
    private Long productId;
    private int quantity;
    private String note;

    public OrderItemCreateDTO(){}
    public OrderItemCreateDTO(Long orderId, Long productId, int quantity, String note) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.note = note;
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
