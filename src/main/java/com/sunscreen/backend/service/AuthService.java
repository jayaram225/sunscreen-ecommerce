//AuthService

package com.sunscreen.backend.service;

import com.sunscreen.backend.dto.RegisterRequest;
import com.sunscreen.backend.entity.User;
import com.sunscreen.backend.repository.UserRepository;
import com.sunscreen.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> login(User user) {

        User dbUser = userRepository
                .findByUsername(user.getUsername())
                .orElse(null);

        if (dbUser == null || !passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            return Map.of(
                    "success", false,
                    "message", "Invalid username or password. If you are a new user, please register."
            );
        }

        if (!dbUser.isActive()) {
            return Map.of(
                    "success", false,
                    "message", "User is blocked"
            );
        }

        String token = JwtUtil.generateToken(dbUser.getId(), dbUser.getRole());

        return Map.of(
                "success", true,
                "token", token,
                "username", dbUser.getUsername(),
                "id", dbUser.getId(),
                "role", dbUser.getRole()
        );
    }


    public String register(RegisterRequest request) {

        if(userRepository.existsByUsername(request.getUsername())) {
            return "Username already exists";
        }

        User user = new User();
        user.setUsername(request.getUsername());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        //  ADD THIS LINE
        user.setRole("USER");

        userRepository.save(user);

        return "User registered successfully";
    }
}