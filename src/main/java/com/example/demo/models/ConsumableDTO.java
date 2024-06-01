package com.example.demo.models;

import java.time.LocalDateTime;

public class ConsumableDTO {
  private Long id;
  private String name;
  private Double protein;
  private Double carb;
  private Double fat;
  private Double amount;
  private LocalDateTime consumedAt;

  public ConsumableDTO() {
  }

  // This class returns only fields that we need (No user)

  public ConsumableDTO(Long id, String name, Double protein, Double carb, Double fat, Double amount,
      LocalDateTime consumedAt) {
    this.id = id;
    this.name = name;
    this.protein = protein;
    this.carb = carb;
    this.fat = fat;
    this.amount = amount;
    this.consumedAt = consumedAt;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Double getProtein() {
    return protein;
  }

  public void setProtein(Double protein) {
    this.protein = protein;
  }

  public Double getCarb() {
    return carb;
  }

  public void setCarb(Double carb) {
    this.carb = carb;
  }

  public Double getFat() {
    return fat;
  }

  public void setFat(Double fat) {
    this.fat = fat;
  }

  public Double getAmount() {
    return amount;
  }

  public void setAmount(Double amount) {
    this.amount = amount;
  }

  public LocalDateTime getConsumedAt() {
    return consumedAt;
  }

  public void setConsumedAt(LocalDateTime consumedAt) {
    this.consumedAt = consumedAt;
  }
}
