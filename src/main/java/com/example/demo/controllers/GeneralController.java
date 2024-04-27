package com.example.demo.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/")
public class GeneralController {
    @GetMapping("/**")
    public String frontPage() {
        return "Frontpage.";
    }

    // @GetMapping("/*/*")
    // public String frontPage2() {
    // return "Frontpage 2.";
    // }

    // @GetMapping("/*/*/*")
    // public String frontPage3() {
    // return "Frontpage 3.";
    // }
}
