package com.sunscreen.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.sunscreen.backend.dto.PaymentVerifyRequest;
import com.sunscreen.backend.entity.Payment;
import com.sunscreen.backend.entity.User;
import com.sunscreen.backend.repository.PaymentRepository;
import com.sunscreen.backend.repository.UserRepository;
import com.sunscreen.backend.security.PaymentUtil;


import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${razorpay.key}")
    private String KEY;

    @Value("${razorpay.secret}")
    private String SECRET;

    private final PaymentRepository paymentRepository;
    private final OrderService orderService;
    private final UserRepository userRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          @Lazy OrderService orderService,
                          UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    //  CREATE ORDER
    public Map<String, Object> createOrder(int amount, int userId) throws Exception {

        RazorpayClient client = new RazorpayClient(KEY, SECRET);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100); // Razorpay uses paise
        options.put("currency", "INR");

        Order order = client.orders.create(options);

        //  Save payment in DB
        Payment payment = new Payment();
        payment.setRazorpayOrderId(order.get("id"));
        payment.setAmount(order.get("amount"));
        payment.setStatus("CREATED");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        payment.setUser(user);

        paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("id", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));

        return response;
    }

    //  VERIFY PAYMENT
    public String verifyPayment(PaymentVerifyRequest request, int userId) {

        //  Generate signature
        String payload = request.getRazorpayOrderId() + "|" +
                request.getRazorpayPaymentId();

        String generatedSignature = PaymentUtil.hmacSHA256(payload, SECRET);

        //  Signature mismatch
        if (!generatedSignature.equals(request.getRazorpaySignature())) {
            paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .ifPresent(p -> { p.setStatus("FAILED"); paymentRepository.save(p); });
            return null;
        }

        //  Fetch payment from DB
        Payment payment = paymentRepository
                .findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        //  Prevent duplicate order creation
        if ("SUCCESS".equals(payment.getStatus())) {
            throw new RuntimeException("Payment already processed");
        }

        //  Update payment details
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setSignature(request.getRazorpaySignature());
        payment.setStatus("SUCCESS");



        // ✅ Place order AFTER successful payment
        String orderId = orderService.placeOrder(userId, request.getAddressId().intValue());

        if (orderId.equalsIgnoreCase("Invalid user/address") ||
                orderId.equalsIgnoreCase("Cart is empty")) {
            throw new RuntimeException(orderId);
        }
//  LINK ORDER WITH PAYMENT
        payment.setOrderId(orderId);

// NOW SAVE
        paymentRepository.save(payment);

        return orderId;
    }
    public List<Payment> getUserPayments(int userId) {

        User user = userRepository.findById(userId).orElseThrow();

        return paymentRepository.findByUser(user);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();

    }

    public void refundPayment(int orderId) {

        Payment payment = paymentRepository
                .findByOrderId(String.valueOf(orderId))
                .orElse(null);

        if (payment == null) {
            return;
        }

        if ("REFUNDED".equals(payment.getStatus())) {
            return;
        }

        // ✅ INITIATE REFUND
        payment.setStatus("REFUND_INITIATED");
        paymentRepository.save(payment);

        // ✅ SIMULATION DELAY
        new Thread(() -> {
            try {
                Thread.sleep(3000);

                payment.setStatus("REFUNDED");
                paymentRepository.save(payment);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}