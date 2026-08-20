package com.emirhan.day3.springboot.dto;

public class AddParticipantRequestDTO {
    private String name;

    public AddParticipantRequestDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
