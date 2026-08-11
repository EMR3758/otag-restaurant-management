package com.emirhan.day3.springboot.model;

import jakarta.persistence.*;

@Entity //Bu Java classı veritabanında saklanacak ve bir tabloyla eşleştirilecek.
public class Product {

    @Id //Bu alan entity'nin primary key alanı.
    @GeneratedValue(strategy = GenerationType.IDENTITY) //“Bu ID otomatik üretilecek.
    private Long id;

    private String name;
    private int stock;
    private double price;

    @ManyToOne
    @JoinColumn(name="category_id")
    private Category category;

    public Product(){
    }
    public Product(String name,int stock,double price,Category category){
        this.name=name;
        this.stock=stock;
        this.price=price;
        this.category=category;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getStock() {
        return stock;
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

    public void setStock(int stock) {
        this.stock = stock;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
