//AuthController
package com.sunscreen.backend.controller;

import com.sunscreen.backend.dto.RegisterRequest;
import com.sunscreen.backend.entity.User;
import com.sunscreen.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user) {

        Map<String, Object> response = authService.login(user);

        if (Boolean.FALSE.equals(response.get("success"))) {
            return ResponseEntity.status(401).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}