package com.example.lied.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
    @RequestMapping("/")
    public String index() {
        return "html/home";
    }

    @RequestMapping("/list")
    public String goToList() {
        return "html/list";
    }
    
    @RequestMapping("/measurement")
    public String goToMeasurement() {
        return "html/measurement";
    }
}
