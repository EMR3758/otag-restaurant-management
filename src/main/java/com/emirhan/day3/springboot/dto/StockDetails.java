package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.StockUnit;

import java.math.BigDecimal;

public class StockDetails {

    private String productName;
    private BigDecimal quantity;
    private BigDecimal minimumQuantity;
    private StockUnit unit;

    public StockDetails() {
    }

    public StockDetails(String productName, BigDecimal quantity, BigDecimal minimumQuantity, StockUnit unit) {
        this.productName = productName;
        this.quantity = quantity;
        this.minimumQuantity = minimumQuantity;
        this.unit = unit;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getMinimumQuantity() {
        return minimumQuantity;
    }

    public void setMinimumQuantity(BigDecimal minimumQuantity) {
        this.minimumQuantity = minimumQuantity;
    }

    public StockUnit getUnit() {
        return unit;
    }

    public void setUnit(StockUnit unit) {
        this.unit = unit;
    }
}