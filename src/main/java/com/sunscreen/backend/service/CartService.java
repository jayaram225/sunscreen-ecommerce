//CartService

package com.sunscreen.backend.service;

import com.sunscreen.backend.entity.Cart;
import com.sunscreen.backend.entity.Product;
import com.sunscreen.backend.entity.User;
import com.sunscreen.backend.repository.CartRepository;
import com.sunscreen.backend.repository.ProductRepository;
import com.sunscreen.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.sunscreen.backend.dto.CartItemResponse;

import java.util.*;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
                       UserRepository userRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // ADD TO CART
    public String addToCart(int userId, int productId,int quantity) {

        User user = userRepository.findById(userId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        if (user == null || product == null) {
            return "Invalid request";
        }

        if (!product.isActive()) {
            return "Product is no longer available";
        }

        //  STOCK CHECK
        if (product.getStock() < quantity) {
            return "Only " + product.getStock() + " items available";
        }

        Optional<Cart> existingCart = cartRepository.findByUser(user)
                .stream()
                .filter(c -> c.getProduct().getId() == productId)
                .findFirst();

        if (existingCart.isPresent()) {

            Cart cart = existingCart.get();

            int newQty = cart.getQuantity() + quantity;

            //  CHECK AGAIN
            if (product.getStock() < newQty) {
                return "Only " + product.getStock() + " items available";
            }

            cart.setQuantity(newQty);
            cartRepository.save(cart);

        } else {

            Cart cart = new Cart();
            cart.setUser(user);
            cart.setProduct(product);
            cart.setQuantity(quantity);
            cartRepository.save(cart);
        }

        return "Added";
    }

    // GET CART
    public List<CartItemResponse> getCartByUser(int userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) return new ArrayList<>();

        List<Cart> cartItems = cartRepository.findByUser(user);

        List<CartItemResponse> response = new ArrayList<>();

        for (Cart cart : cartItems) {

            Product product = cart.getProduct();

            if (product != null) {
                response.add(new CartItemResponse(
                        cart.getId(),
                        product.getName(),
                        product.getPrice(),
                        product.getImageUrl(),
                        cart.getQuantity(),
                        product.getStock()
                ));
            }
        }

        return response;
    }

    // REMOVE
    public String remove(int userId, int cartId) {

        Cart cart = cartRepository.findById(cartId).orElse(null);

        if (cart != null && cart.getUser().getId() == userId) {
            cartRepository.deleteById(cartId);
            return "Removed";
        }

        return "Not allowed";
    }

    // INCREASE
    public String increase(int userId, int cartId) {

        Cart cart = cartRepository.findById(cartId).orElse(null);

        if (cart != null && cart.getUser().getId() == userId) {
            cart.setQuantity(cart.getQuantity() + 1);
            cartRepository.save(cart);
            return "Increased";
        }

        return "Not allowed";
    }

    // DECREASE
    public String decrease(int userId, int cartId) {

        Cart cart = cartRepository.findById(cartId).orElse(null);

        if (cart != null && cart.getUser().getId() == userId) {

            if (cart.getQuantity() > 1) {
                cart.setQuantity(cart.getQuantity() - 1);
                cartRepository.save(cart);
            } else {
                cartRepository.deleteById(cartId);
            }

            return "Updated";
        }

        return "Not allowed";
    }

    // CLEAR CART
    public String clear(int userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) return "Invalid user";

        List<Cart> carts = cartRepository.findByUser(user);
        cartRepository.deleteAll(carts);

        return "Cart cleared for user " + userId;
    }

    //getCartEntitiesByUser
    public List<Cart> getCartEntitiesByUser(int userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return new ArrayList<>();
        }

        return cartRepository.findByUser(user);
    }
}