package com.example.demo.repository;

import com.example.demo.models.Consumable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsumableRepository extends JpaRepository<Consumable, Long> {
    List<Consumable> findByUserId(Long userId);

    List<Consumable> findByUserIdAndConsumedAtBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);

    List<Consumable> findByConsumedAtBetween(LocalDateTime start, LocalDateTime end);
}
