//AdminUserController

package com.sunscreen.backend.controller;

import com.sunscreen.backend.entity.User;
import com.sunscreen.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //  GET ALL USERS
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}/toggle")
    public String toggleUser(@PathVariable int id, @RequestAttribute("userId") int currentUserId) {

        // Prevent self-block
        if (id == currentUserId) {
            return "You cannot block yourself";
        }

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return "User not found";
        }

        user.setActive(!user.isActive());
        userRepository.save(user);

        return user.isActive() ? "User Activated" : "User Blocked";
    }
}