//OrderService

package com.sunscreen.backend.service;

import com.sunscreen.backend.dto.OrderItemResponse;
import com.sunscreen.backend.dto.OrderResponse;
import com.sunscreen.backend.entity.*;
import com.sunscreen.backend.repository.CartRepository;
import com.sunscreen.backend.repository.OrderRepository;
import com.sunscreen.backend.repository.ProductRepository;
import com.sunscreen.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.sunscreen.backend.repository.AddressRepository;
import com.sunscreen.backend.service.PaymentService;
import com.sunscreen.backend.repository.PaymentRepository;

import java.security.PrivateKey;
import java.util.ArrayList;
import java.util.List;


@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;



    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        AddressRepository addressRepository,
                        PaymentService paymentService,
                        PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
    }



    @Transactional

    public String placeOrder(int userId,int addressId) {

        System.out.println("=== ORDER DEBUG START ===");
        System.out.println("UserId: " + userId);
        System.out.println("AddressId: " + addressId);

        User user = userRepository.findById(userId).orElse(null);
        Address address = addressRepository.findById(addressId).orElse(null);

        System.out.println("User Found: " + (user != null));
        System.out.println("Address Found: " + (address != null));

        if (user == null || address == null) {
            return "Invalid user/address";
        }


        List<Cart> cartItems = cartRepository.findByUser(user);

        System.out.println("Cart Items Count: " + cartItems.size());

        if (cartItems.isEmpty()) {
            return "Cart is empty";
        }

        double total = 0;

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(java.time.LocalDateTime.now());

        //  SAVE ADDRESS
        order.setAddress(address.getFullAddress());

        //Set status
        order.setStatus("PENDING");


        List<OrderItem> items = new ArrayList<>();

        System.out.println("Starting stock validation...");

        for (Cart cart : cartItems) {

            Product product = cart.getProduct();
            System.out.println("Checking product: " + product.getName());
            System.out.println("Stock: " + product.getStock() + " | Required: " + cart.getQuantity());


            //  FINAL VALIDATION
            if (product.getStock() < cart.getQuantity()) {
                throw new RuntimeException("Product out of stock: " + product.getName());
            }
        }
        for (Cart cart : cartItems) {

            Product product = cart.getProduct();


            //  REDUCE STOCK
            product.setStock(product.getStock() - cart.getQuantity());
            productRepository.save(product);

            total += product.getPrice() * cart.getQuantity();

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setProductName(product.getName()); // snapshot
            item.setPrice(product.getPrice());      // snapshot
            item.setQuantity(cart.getQuantity());
            items.add(item);
        }

        order.setItems(items);
        order.setTotalAmount(total);

        System.out.println("Saving order with total: " + total);
        order = orderRepository.saveAndFlush(order);
        System.out.println("Order Saved ID: " + order.getId());
        System.out.println("Clearing cart...");

        cartRepository.deleteAll(cartItems);
        System.out.println("=== ORDER DEBUG END ===");
        return String.valueOf(order.getId());

    }

    @Transactional
    public String cancelOrder(int userId, int orderId) {

        Order order = orderRepository.findById(orderId).orElse(null);

        // ✅ Order check
        if (order == null) {
            return "Order not found";
        }

        // ✅ Ownership check
        if (order.getUser().getId() != userId) {
            return "Not allowed";
        }

        // ✅ Status check
        if (!"PENDING".equals(order.getStatus())) {
            return "Cannot cancel after shipped or delivered";
        }

        // ✅ Restore stock
        for (OrderItem item : order.getItems()) {

            Product product = item.getProduct();

            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }

        // ✅ Change status
        order.setStatus("CANCELLED");

        orderRepository.save(order);
        paymentService.refundPayment(orderId);

        return "Order cancelled successfully";

    }

    public List<OrderResponse> getOrdersByUser(int userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) return new ArrayList<>();

        List<Order> orders = orderRepository.findByUser(user);

        List<OrderResponse> response = new ArrayList<>();

        for (Order order : orders) {

            List<OrderItemResponse> items = new ArrayList<>();

            for (OrderItem item : order.getItems()) {
                items.add(new OrderItemResponse(
                        item.getProductName(),
                        item.getPrice(),
                        item.getQuantity()
                ));
            }

// ✅ ADD PaymentStatus BLOCK
            String paymentStatus = paymentRepository
                    .findByOrderId(String.valueOf(order.getId()))
                    .map(Payment::getStatus)
                    .orElse("UNKNOWN");



            response.add(new OrderResponse(
                    order.getId(),
                    order.getTotalAmount(),
                    order.getOrderDate(),
                    items,
                    order.getStatus(),
                    paymentStatus
            ));
        }

        return response;
    }
}