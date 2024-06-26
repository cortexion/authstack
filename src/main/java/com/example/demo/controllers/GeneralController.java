package com.example.demo.controllers;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.io.IOException;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
// @RequestMapping(path = "/{path:(?!api).*$}")
@RequestMapping("/")
public class GeneralController {
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<Resource> serveIndexAtRoot() throws IOException {
        return serveIndexFile();
    }

    @RequestMapping(value = "/date/**", method = RequestMethod.GET)
    public ResponseEntity<Resource> serveIndexAtDate() throws IOException {
        return serveIndexFile();
    }

    private ResponseEntity<Resource> serveIndexFile() throws IOException {
        Resource resource = new ClassPathResource("static/index.html");

        if (!resource.exists()) {
            throw new IOException("Index file not found");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/html")
                .body(resource);
    }
}
