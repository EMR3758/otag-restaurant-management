package com.emirhan.day3.springboot.dto;

import com.emirhan.day3.springboot.model.Category;
import com.emirhan.day3.springboot.model.KdsStation;

public class ProductCreateDTO {
    private String name;
    private int stock;
    private double price;
    private Long categoryId;
    private String imageUrl;
    private KdsStation kdsStation;

    public ProductCreateDTO(){}

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
    public KdsStation getKdsStation() {
        return kdsStation;
    }

    public void setKdsStation(KdsStation kdsStation) {
        this.kdsStation = kdsStation;
    }
}
