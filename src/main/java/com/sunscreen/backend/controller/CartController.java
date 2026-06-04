//CartController
package com.sunscreen.backend.controller;

import com.sunscreen.backend.dto.CartItemResponse;
import com.sunscreen.backend.dto.AddToCartRequest;
import com.sunscreen.backend.dto.CheckoutRequest;
import com.sunscreen.backend.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.sunscreen.backend.service.OrderService;


import java.util.List;

@RestController
@CrossOrigin
public class CartController {

    private final CartService cartService;
    private final OrderService orderService;

    public CartController(CartService cartService,OrderService orderService) {
        this.cartService = cartService;
        this.orderService = orderService;
    }

    @PostMapping("/cart")
    public String addToCart(@RequestBody @Valid AddToCartRequest request,
                            HttpServletRequest httpRequest) {

        int userId = (int) httpRequest.getAttribute("userId");

        return cartService.addToCart(userId, request.getProductId(), request.getQuantity());
    }

    @GetMapping("/cart")
    public List<CartItemResponse> getCart(HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        return cartService.getCartByUser(userId);
    }

    @DeleteMapping("/cart/{id}")
    public String remove(@PathVariable int id, HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        return cartService.remove(userId, id);
    }

    @PutMapping("/cart/increase/{id}")
    public String increase(@PathVariable int id, HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        return cartService.increase(userId, id);
    }

    @PutMapping("/cart/decrease/{id}")
    public String decrease(@PathVariable int id, HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        return cartService.decrease(userId, id);
    }

    @DeleteMapping("/cart/clear")
    public String clear(HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        return cartService.clear(userId);
    }

    @PostMapping("/cart/checkout")
    public String checkout(@RequestBody CheckoutRequest request,
                           HttpServletRequest httpRequest) {

        // 👉 Only validate + allow payment
        return "Proceed to payment";
    }

}