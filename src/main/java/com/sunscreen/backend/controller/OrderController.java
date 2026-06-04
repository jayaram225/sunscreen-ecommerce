//OrderController
package com.sunscreen.backend.controller;

import com.sunscreen.backend.dto.OrderResponse;
import com.sunscreen.backend.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/orders")
    public List<OrderResponse> getOrders(HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        return orderService.getOrdersByUser(userId);
    }

    @PostMapping("/orders/place")
    public String placeOrderAfterPayment(@RequestParam int addressId,
                                         HttpServletRequest httpRequest) {

        int userId = (int) httpRequest.getAttribute("userId");

        return orderService.placeOrder(userId, addressId);
    }

    @PutMapping("/orders/{id}/cancel")
    public String cancelOrder(@PathVariable int id, HttpServletRequest request) {

        int userId = (int) request.getAttribute("userId");

        return orderService.cancelOrder(userId, id);
    }
}