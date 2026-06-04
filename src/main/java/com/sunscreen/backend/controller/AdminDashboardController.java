//AdminDashboardController

package com.sunscreen.backend.controller;

import com.sunscreen.backend.repository.UserRepository;
import com.sunscreen.backend.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/dashboard")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminDashboardController(UserRepository userRepository,
                                    OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public Map<String, Object> getDashboardData() {

        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();

        double totalRevenue = orderRepository.findAll()
                .stream()
                .mapToDouble(o -> o.getTotalAmount())
                .sum();

        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", totalUsers);
        data.put("totalOrders", totalOrders);
        data.put("totalRevenue", totalRevenue);

        return data;
    }
}