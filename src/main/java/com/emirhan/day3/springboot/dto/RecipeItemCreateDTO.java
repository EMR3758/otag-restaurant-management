package com.emirhan.day3.springboot.dto;

import java.math.BigDecimal;

public class RecipeItemCreateDTO {
    private Long productId;
    private Long stockId;
    private BigDecimal quantityPerUnit;

    public RecipeItemCreateDTO() {
    }

    public RecipeItemCreateDTO(Long productId, Long stockId, BigDecimal quantityPerUnit) {
        this.productId = productId;
        this.stockId = stockId;
        this.quantityPerUnit = quantityPerUnit;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getStockId() {
        return stockId;
    }

    public void setStockId(Long stockId) {
        this.stockId = stockId;
    }

    public BigDecimal getQuantityPerUnit() {
        return quantityPerUnit;
    }

    public void setQuantityPerUnit(BigDecimal quantityPerUnit) {
        this.quantityPerUnit = quantityPerUnit;
    }
}
