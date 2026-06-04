package com.sunscreen.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/config")
public class ConfigController {

    @Value("${razorpay.key}")
    private String razorpayKey;

    @GetMapping
    public Map<String, String> getConfig() {
        return Map.of("key", razorpayKey);
    }
}