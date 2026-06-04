package com.sunscreen.backend.repository;

import com.sunscreen.backend.entity.Payment;
import com.sunscreen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);
    List<Payment> findByUser(User user);
    Optional<Payment> findByOrderId(String orderId);
}
