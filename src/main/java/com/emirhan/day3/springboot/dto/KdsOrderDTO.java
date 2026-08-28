package com.emirhan.day3.springboot.dto;

import java.time.LocalDateTime;
import java.util.List;

public class KdsOrderDTO {
    private Long id;
    private String table;
    private LocalDateTime createdAt;
    private List<KdsOrderItemDTO> items;

    public KdsOrderDTO(){
    }

    public KdsOrderDTO(Long id, String table, LocalDateTime createdAt, List<KdsOrderItemDTO> items) {
        this.id = id;
        this.table = table;
        this.createdAt = createdAt;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<KdsOrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<KdsOrderItemDTO> items) {
        this.items = items;
    }
}
