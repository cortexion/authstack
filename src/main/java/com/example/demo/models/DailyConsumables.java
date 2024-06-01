package com.example.demo.models;

import java.time.LocalDate;
import java.util.List;

public class DailyConsumables {
  private LocalDate date;
  private List<ConsumableDTO> consumables;

  public DailyConsumables(LocalDate date, List<ConsumableDTO> consumables) {
    this.date = date;
    this.consumables = consumables;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public List<ConsumableDTO> getConsumables() {
    return consumables;
  }

  public void setConsumables(List<ConsumableDTO> consumables) {
    this.consumables = consumables;
  }
}
