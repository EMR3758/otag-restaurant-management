package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.StockUnit;

import java.math.BigDecimal;

public class RecipeItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Long stockId;
    private String stockName;
    private BigDecimal quantityPerUnit;
    private StockUnit unit;

    public RecipeItemDTO() {
    }

    public RecipeItemDTO(Long id, Long productId, String productName, Long stockId, String stockName,
                          BigDecimal quantityPerUnit, StockUnit unit) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.stockId = stockId;
        this.stockName = stockName;
        this.quantityPerUnit = quantityPerUnit;
        this.unit = unit;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getStockId() {
        return stockId;
    }

    public void setStockId(Long stockId) {
        this.stockId = stockId;
    }

    public String getStockName() {
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }

    public BigDecimal getQuantityPerUnit() {
        return quantityPerUnit;
    }

    public void setQuantityPerUnit(BigDecimal quantityPerUnit) {
        this.quantityPerUnit = quantityPerUnit;
    }

    public StockUnit getUnit() {
        return unit;
    }

    public void setUnit(StockUnit unit) {
        this.unit = unit;
    }
}
