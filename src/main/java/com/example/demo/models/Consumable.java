package com.example.demo.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime; // Import LocalDateTime

@Entity
@Table(name = "consumables")
public class Consumable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  private String name;

  @NotNull
  private Double protein;

  @NotNull
  private Double carb;

  @NotNull
  private Double fat;

  @NotNull
  private Double amount;

  @NotNull
  private LocalDateTime consumedAt;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  public Consumable() {
  }

  public Consumable(String name, Double protein, Double carb, Double fat, Double amount, LocalDateTime consumedAt,
      User user) {
    this.name = name;
    this.protein = protein;
    this.carb = carb;
    this.fat = fat;
    this.amount = amount;
    this.consumedAt = consumedAt;
    this.user = user;
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

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }
}
