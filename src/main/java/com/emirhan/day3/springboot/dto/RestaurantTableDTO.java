package com.emirhan.day3.springboot.dto;

public class RestaurantTableDTO {

    private Long id;
    private String tableNumber;
    private int capacity;
    private boolean available;
    private String tableType;
    private String location;

    public RestaurantTableDTO() {
    }

    public RestaurantTableDTO(Long id, String tableNumber, int capacity, boolean available,String tableType,String location) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.available = available;
        this.tableType=tableType;
        this.location=location;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getTableType() {
        return tableType;
    }

    public void setTableType(String tableType) {
        this.tableType = tableType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}