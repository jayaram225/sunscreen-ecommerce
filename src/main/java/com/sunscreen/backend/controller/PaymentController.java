package com.sunscreen.backend.controller;

import com.sunscreen.backend.dto.PaymentVerifyRequest;
import com.sunscreen.backend.entity.Payment;
import com.sunscreen.backend.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@CrossOrigin("*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ✅ CREATE ORDER
    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestParam int amount,
                                           HttpServletRequest request) throws Exception {

        // 🔥 Get userId from JwtFilter
        int userId = (int) request.getAttribute("userId");

        return paymentService.createOrder(amount, userId);
    }

    // ✅ VERIFY PAYMENT
    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody PaymentVerifyRequest request,
                                      HttpServletRequest httpRequest) {

        int userId = (int) httpRequest.getAttribute("userId");

        Map<String, Object> response = new HashMap<>();

        try {
            String orderId = paymentService.verifyPayment(request, userId);

            boolean success = (orderId != null);

            response.put("success", success);
            response.put("orderId", orderId);
            response.put("message", success ? "Payment verified & order placed" : "Payment verification failed");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }

        return response;
    }

    @GetMapping("/history")
    public List<Payment> getPaymentHistory(HttpServletRequest request) {

        int userId = (int) request.getAttribute("userId");

        return paymentService.getUserPayments(userId);
    }

}