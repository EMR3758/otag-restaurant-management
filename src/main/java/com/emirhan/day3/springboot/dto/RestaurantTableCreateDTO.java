package com.emirhan.day3.springboot.dto;

public class RestaurantTableCreateDTO {
    private String tableNumber;
    private int capacity;
    private String tableType;
    private String location;
    private boolean available;


    public RestaurantTableCreateDTO() {
    }

    public RestaurantTableCreateDTO(String tableNumber, int capacity,String tableType,String location,boolean available) {
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.tableType=tableType;
        this.location=location;
        this.available=available;
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

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
