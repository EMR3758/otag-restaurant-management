package com.emirhan.day3.springboot.dto;

// Product nesnesini al
// → DTO'da göstermek istediğim alanları çek
// → Yeni ProductDTO oluştur
// → Oluşturduğum DTO'yu geri döndür

import com.emirhan.day3.springboot.model.Category;

public class ProductDTO {
    private Long id;
    private String name;
    private double price;
    private String categoryName;

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public  ProductDTO(){
    }
    public ProductDTO(Long id, String name, double price, String categoryName){
        this.id=id;
        this.name=name;
        this.price=price;
        this.categoryName=categoryName;
    }


    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
