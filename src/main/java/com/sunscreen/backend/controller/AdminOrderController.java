//AdminOrderController

package com.sunscreen.backend.controller;

import com.sunscreen.backend.entity.Order;
import com.sunscreen.backend.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/orders")
public class AdminOrderController {

    private final OrderRepository orderRepository;

    public AdminOrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    //  GET ALL ORDERS (ADMIN)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public String updateStatus(@PathVariable int id, @RequestParam String status) {

        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return "Order not found";
        }
        if ("CANCELLED".equals(order.getStatus())) {
            return "Cannot update cancelled order";
        }


        if (!List.of("PENDING", "SHIPPED", "DELIVERED").contains(status)) {
            return "Invalid status";
        }

        order.setStatus(status);
        orderRepository.save(order);
        return "Status updated";
    }
}