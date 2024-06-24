package com.example.demo.models;

import java.util.List;

public class EditConsumablesRequest {
    private String date;
    private List<Consumable> consumables;

    // Getters and Setters
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<Consumable> getConsumables() {
        return consumables;
    }

    public void setConsumables(List<Consumable> consumables) {
        this.consumables = consumables;
    }
}