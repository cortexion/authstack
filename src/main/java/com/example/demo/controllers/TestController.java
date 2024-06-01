package com.example.demo.controllers;

import com.example.demo.models.Consumable;
import com.example.demo.models.DailyConsumables;
import com.example.demo.models.ConsumableDTO;
import com.example.demo.models.User;
import com.example.demo.repository.ConsumableRepository;
import com.example.demo.security.jwt.JwtUtils;
import com.example.demo.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private ConsumableRepository consumableRepository;

    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping(value = "/consumables", produces = "application/json")
    public ResponseEntity<List<DailyConsumables>> getConsumables(HttpServletRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(30);

        List<Consumable> consumables = consumableRepository.findByUserIdAndConsumedAtBetween(userDetails.getId(),
                startDate, endDate);

        List<ConsumableDTO> consumableDTOs = consumables.stream()
                .map(consumable -> new ConsumableDTO(
                        consumable.getId(),
                        consumable.getName(),
                        consumable.getProtein(),
                        consumable.getCarb(),
                        consumable.getFat(),
                        consumable.getAmount(),
                        consumable.getConsumedAt()))
                .collect(Collectors.toList());

        List<DailyConsumables> dailyConsumablesList = createDailyConsumablesList(startDate, endDate, consumableDTOs);

        return new ResponseEntity<>(dailyConsumablesList, HttpStatus.OK);
    }

    private List<DailyConsumables> createDailyConsumablesList(LocalDateTime startDate, LocalDateTime endDate,
            List<ConsumableDTO> consumables) {
        Map<LocalDate, List<ConsumableDTO>> consumablesByDate = consumables.stream()
                .collect(Collectors.groupingBy(consumable -> consumable.getConsumedAt().toLocalDate()));

        List<DailyConsumables> dailyConsumablesList = new ArrayList<>();

        for (LocalDate date = startDate.toLocalDate(); !date.isAfter(endDate.toLocalDate()); date = date.plusDays(1)) {
            List<ConsumableDTO> dailyConsumables = consumablesByDate.getOrDefault(date, new ArrayList<>());
            dailyConsumablesList.add(new DailyConsumables(date, dailyConsumables));
        }

        return dailyConsumablesList;
    }

    @PostMapping(value = "/consumables/add", produces = "application/json")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Consumable> addConsumable(HttpServletRequest request, @RequestBody Consumable consumable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User currentUser = new User();
        currentUser.setId(userDetails.getId());

        consumable.setName(consumable.getName()); // consumable.getName()
        consumable.setProtein(consumable.getProtein()); // consumable.getProtein()
        consumable.setCarb(consumable.getCarb()); // consumable.getCarb()
        consumable.setFat(consumable.getFat()); // consumable.getFat()
        consumable.setAmount(consumable.getAmount()); // consumable.getAmount()
        consumable.setConsumedAt(consumable.getConsumedAt()); // Set consumedAt
        consumable.setUser(currentUser);

        // Save the consumable
        Consumable savedConsumable = consumableRepository.save(consumable);

        // Log out the added consumable
        System.out.println("Consumable added: " + savedConsumable.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedConsumable);
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public String userAccess() {
        return "User Content.";
    }

    @GetMapping("/mod")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public String moderatorAccess() {
        return "Moderator Board.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Board.";
    }
}
