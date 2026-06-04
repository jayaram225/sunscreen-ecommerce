//AdminController

package com.sunscreen.backend.controller;

import com.sunscreen.backend.entity.Payment;
import com.sunscreen.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sunscreen.backend.repository.PaymentRepository;

import java.util.List;


@RestController
public class AdminController {


    private final PaymentService paymentService;

    public AdminController(PaymentService paymentService) {

        this.paymentService=paymentService;
    }


    @GetMapping("/admin/test")
    public String adminTest() {
        return "Admin API Working ";
    }

    @GetMapping("/admin/all")
    public List<Payment> getAllPayments(HttpServletRequest request) {

        String role = (String) request.getAttribute("role");

        if (!"ADMIN".equals(role)) {
            throw new RuntimeException("Access Denied ❌");
        }

        return paymentService.getAllPayments();
    }
}