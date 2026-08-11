package com.emirhan.day3.springboot.dto;

public class CategoryCreateDTO {
    private String name;
    private String description;
    public CategoryCreateDTO(){}

    public CategoryCreateDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
