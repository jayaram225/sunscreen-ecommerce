//CartItemResponse
package com.sunscreen.backend.dto;

public class CartItemResponse {

    private int cartId;
    private String name;
    private double price;
    private String imageUrl;
    private int quantity;
    private int stock;

    public CartItemResponse(int cartId, String name, double price, String imageUrl, int quantity,int stock) {
        this.cartId = cartId;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.stock = stock;
    }

    public int getCartId() { return cartId; }
    public String getName() { return name; }
    public double getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
    public int getQuantity() { return quantity; }
    public int getStock() { return stock; }
}