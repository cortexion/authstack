package com.example.demo.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/search/")
public class SearchController {
    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping(value = "/{query}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<String>> searchFoods(@PathVariable String query) {
        final String uri = "https://fineli.fi/fineli/api/v1/foods?q=" + query;

        WebClient client = WebClient.create();
        return client.get()
                .uri(uri)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(response));
    }
}
