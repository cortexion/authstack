package com.example.demo.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
// @RequestMapping(path = "/{path:(?!api).*$}")
@RequestMapping("/")
public class GeneralController {
    @RequestMapping(value = "/{path:[^\\.]*}", method = RequestMethod.GET)
    public ModelAndView forwardWithParams(HttpServletRequest request) {
        return new ModelAndView("forward:/");
    }
}
