package com.emirhan.day3.springboot.model;

import jakarta.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Bir siparişin içinde birçok OrderItem olabilir.
    // Ama her OrderItem sadece bir Order'a aittir.
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // Bir ürün birçok siparişte bulunabilir.
    // Ama her OrderItem sadece bir Product'a aittir.
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    // Sipariş verildiği andaki fiyat
    private double unitPrice;

    // Örneğin: "Soğansız", "Acısız", "Bol ketçap"
    private String note;

    public OrderItem() {
    }

    public OrderItem(Order order, Product product, int quantity, double unitPrice, String note) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public Product getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public String getNote() {
        return note;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public void setNote(String note) {
        this.note = note;
    }
}