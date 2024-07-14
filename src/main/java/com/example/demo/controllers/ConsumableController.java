package com.example.demo.controllers;

import com.example.demo.models.Consumable;
import com.example.demo.models.ApiResponse;
import com.example.demo.models.DailyConsumables;
import com.example.demo.models.EditConsumablesRequest;
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
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/manage")
public class ConsumableController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private ConsumableRepository consumableRepository;

    @GetMapping("/all")
    public String allAccess() {
        return "Public Content!";
    }

    @GetMapping(value = "/checkItems", produces = "application/json")
    public ResponseEntity<?> hasConsumablesToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);

        List<Consumable> consumables = consumableRepository.findByConsumedAtBetween(startOfToday, endOfToday);
        boolean hasConsumablesToday = !consumables.isEmpty();

        if (!hasConsumablesToday) {
            try {
                removeAndAddHardcodedConsumables();
                // return new ResponseEntity<>(new ApiResponse("Hardcoded consumables added
                // successfully"), HttpStatus.OK);
                return new ResponseEntity<>(consumables, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(new ApiResponse("Failed to add hardcoded consumables"),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity<>(new ApiResponse("No need for updating"), HttpStatus.OK);
        }

        // return new ResponseEntity<>(consumables, HttpStatus.OK);
    }

    private void removeAndAddHardcodedConsumables() {
        consumableRepository.deleteAll();

        List<Consumable> hardcodedConsumables = new ArrayList<>();
        User testUser = new User(); // Assuming a test user
        testUser.setId(1L);

        LocalDateTime now = LocalDateTime.now();

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 300.0, now.minusDays(0), testUser));
        hardcodedConsumables.add(
                new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 100.0, now.minusDays(0), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 100.0, now.minusDays(1), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-kauraseos", 374.1, 10.87, 69.49, 4.13, 200.0, now.minusDays(1), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 100.0, now.minusDays(2), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-maissikakku", 364.33, 7.45, 73.64, 2.61, 100.0, now.minusDays(2), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 300.0, now.minusDays(3), testUser));
        hardcodedConsumables.add(
                new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 100.0, now.minusDays(3), testUser));

        hardcodedConsumables.add(new Consumable("Kana, keitetty, suolaton", 218.97, 23.55, 0.0, 13.95, 190.0,
                now.minusDays(4), testUser));
        hardcodedConsumables.add(
                new Consumable("Kananmuna, keitetty", 134.11, 12.61, 0.3, 9.24, 120.0, now.minusDays(4), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-maissikakku", 364.33, 7.45, 73.64, 2.61, 100.0, now.minusDays(4), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 300.0, now.minusDays(5), testUser));
        hardcodedConsumables.add(
                new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 100.0, now.minusDays(5), testUser));

        hardcodedConsumables.add(new Consumable("Kana, keitetty, suolaton", 218.97, 23.55, 0.0, 13.95, 300.0,
                now.minusDays(6), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-maissikakku", 364.33, 7.45, 73.64, 2.61, 100.0, now.minusDays(6), testUser));

        hardcodedConsumables.add(new Consumable("Kanakeitto, perunaa ja kasviksia", 86.28, 8.05, 3.19, 4.45, 300.0,
                now.minusDays(7), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 100.0, now.minusDays(8), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-maissikakku", 364.33, 7.45, 73.64, 2.61, 200.0, now.minusDays(8), testUser));

        hardcodedConsumables.add(new Consumable("Kana, keitetty, suolaton", 218.97, 23.55, 0.0, 13.95, 300.0,
                now.minusDays(9), testUser));
        hardcodedConsumables.add(
                new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 100.0, now.minusDays(9), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 200.0, now.minusDays(10), testUser));
        hardcodedConsumables.add(
                new Consumable("Riisi-maissikakku", 364.33, 7.45, 73.64, 2.61, 150.0, now.minusDays(10), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 230.0, now.minusDays(11), testUser));
        hardcodedConsumables.add(
                new Consumable("Riisi-maissikakku", 364.33, 7.45, 73.64, 2.61, 100.0, now.minusDays(11), testUser));

        hardcodedConsumables.add(new Consumable("Kana, keitetty, suolaton", 218.97, 23.55, 0.0, 13.95, 200.0,
                now.minusDays(12), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-kauraseos", 374.1, 10.87, 69.49, 4.13, 200.0, now.minusDays(12), testUser));

        hardcodedConsumables.add(new Consumable("Kana-vuohenjuustopasta, hk via, valmisateria", 122.58, 8.37, 9.85,
                5.11, 300.0, now.minusDays(13), testUser));
        hardcodedConsumables.add(new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 100.0,
                now.minusDays(13), testUser));

        hardcodedConsumables.add(new Consumable("Kanakeitto, perunaa ja kasviksia", 86.28, 8.05, 3.19, 4.45, 300.0,
                now.minusDays(14), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 230.0, now.minusDays(15), testUser));
        hardcodedConsumables.add(new Consumable("Kanakeitto, perunaa ja kasviksia", 86.28, 8.05, 3.19, 4.45, 200.0,
                now.minusDays(15), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 330.0, now.minusDays(16), testUser));
        hardcodedConsumables.add(new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 100.0,
                now.minusDays(16), testUser));

        hardcodedConsumables.add(
                new Consumable("Kana, keitetty, suolaa", 239.94, 25.8, 0.0, 15.29, 400.0, now.minusDays(17), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-kauraseos", 374.1, 10.87, 69.49, 4.13, 200.0, now.minusDays(17), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 230.0, now.minusDays(18), testUser));
        hardcodedConsumables.add(new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 100.0,
                now.minusDays(18), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 130.0, now.minusDays(19), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-kauraseos", 374.1, 10.87, 69.49, 4.13, 200.0, now.minusDays(19), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 300.0, now.minusDays(20), testUser));
        hardcodedConsumables.add(new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 100.0,
                now.minusDays(20), testUser));

        hardcodedConsumables.add(new Consumable("Kana, keitetty, suolaton", 218.97, 23.55, 0.0, 13.95, 220.0,
                now.minusDays(21), testUser));
        hardcodedConsumables.add(new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 200.0,
                now.minusDays(21), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 300.0, now.minusDays(22), testUser));
        hardcodedConsumables.add(new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 100.0,
                now.minusDays(22), testUser));

        hardcodedConsumables.add(
                new Consumable("Kana, keitetty, suolaa", 239.94, 25.8, 0.0, 15.29, 300.0, now.minusDays(23), testUser));
        hardcodedConsumables.add(new Consumable("Riisi, keitetty, suolaa", 101.58, 1.8, 22.44, 0.21, 200.0,
                now.minusDays(23), testUser));

        hardcodedConsumables.add(
                new Consumable("Kana, keitetty, suolaa", 239.94, 25.8, 0.0, 15.29, 300.0, now.minusDays(24), testUser));
        hardcodedConsumables.add(
                new Consumable("Riisi-maissikakku", 364.33, 7.45, 73.64, 2.61, 200.0, now.minusDays(24), testUser));

        hardcodedConsumables.add(new Consumable("Kana, keitetty, suolaton", 218.97, 23.55, 0.0, 13.95, 400.0,
                now.minusDays(25), testUser));
        hardcodedConsumables.add(
                new Consumable("Riisi-maissikakku", 364.33, 7.45, 73.64, 2.61, 300.0, now.minusDays(25), testUser));

        hardcodedConsumables.add(new Consumable("Kana, keitetty, suolaton", 218.97, 23.55, 0.0, 13.95, 200.0,
                now.minusDays(26), testUser));
        hardcodedConsumables.add(
                new Consumable("Riisi-maissikakku", 364.33, 7.45, 73.64, 2.61, 200.0, now.minusDays(26), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 400.0, now.minusDays(27), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-kauraseos", 374.1, 10.87, 69.49, 4.13, 200.0, now.minusDays(27), testUser));

        hardcodedConsumables.add(new Consumable("Kana, keitetty, suolaton", 218.97, 23.55, 0.0, 13.95, 300.0,
                now.minusDays(28), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-kauraseos", 374.1, 10.87, 69.49, 4.13, 200.0, now.minusDays(28), testUser));

        hardcodedConsumables.add(new Consumable("Kana", 188.32, 20.25, 0.0, 12.0, 350.0, now.minusDays(29), testUser));
        hardcodedConsumables
                .add(new Consumable("Riisi-kauraseos", 374.1, 10.87, 69.49, 4.13, 250.0, now.minusDays(19), testUser));

        consumableRepository.saveAll(hardcodedConsumables);
    }

    @GetMapping(value = "/consumables", produces = "application/json")
    public ResponseEntity<List<DailyConsumables>> getConsumables(HttpServletRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusWeeks(4).toLocalDate().atStartOfDay();

        List<Consumable> consumables = consumableRepository.findByUserIdAndConsumedAtBetween(
                userDetails.getId(), startDate, endDate);

        List<ConsumableDTO> consumableDTOs = consumables.stream()
                .map(consumable -> new ConsumableDTO(
                        consumable.getId(),
                        consumable.getName(),
                        consumable.getEnergyKcal(),
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
        consumable.setEnergyKcal(consumable.getEnergyKcal()); // consumable.getEnergyKcal()
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

    @PostMapping(value = "/consumables/edit", produces = "application/json")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Consumable>> editDates(HttpServletRequest request,
            @RequestBody EditConsumablesRequest editConsumablesRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Get the current user
        Long userId = userDetails.getId();

        // Parse the date string to LocalDate
        LocalDate date = LocalDate.parse(editConsumablesRequest.getDate());
        LocalDateTime startDateTime = date.atStartOfDay();
        LocalDateTime endDateTime = date.atTime(LocalTime.MAX);

        System.out.println("Consumable update date: " + date);

        // Fetch all existing consumables for the user within the specified date range
        List<Consumable> existingConsumables = consumableRepository.findByUserIdAndConsumedAtBetween(
                userId, startDateTime, endDateTime);

        // List to hold updated or new consumables
        List<Consumable> updatedConsumables = new ArrayList<>();

        // Process the request consumables
        for (Consumable requestConsumable : editConsumablesRequest.getConsumables()) {
            Consumable existingConsumable = existingConsumables.stream()
                    .filter(consumable -> consumable.getId().equals(requestConsumable.getId()))
                    .findFirst()
                    .orElse(null);

            if (existingConsumable != null) {
                // Check if the existing consumable belongs to the current user
                if (existingConsumable.getUser().getId().equals(userId)) {
                    // Update the fields of the existing consumable with the new values
                    existingConsumable.setName(requestConsumable.getName());
                    existingConsumable.setEnergyKcal(requestConsumable.getEnergyKcal());
                    existingConsumable.setProtein(requestConsumable.getProtein());
                    existingConsumable.setCarb(requestConsumable.getCarb());
                    existingConsumable.setFat(requestConsumable.getFat());
                    existingConsumable.setAmount(requestConsumable.getAmount());
                    updatedConsumables.add(consumableRepository.save(existingConsumable));
                }
            }
        }

        // Remove extra consumables that are in the database but not in the request
        for (Consumable existingConsumable : existingConsumables) {
            if (!editConsumablesRequest.getConsumables().stream()
                    .anyMatch(consumable -> consumable.getId().equals(existingConsumable.getId()))) {
                consumableRepository.delete(existingConsumable);
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(updatedConsumables);
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
