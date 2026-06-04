//OrderItemResponse

package com.sunscreen.backend.dto;

public class OrderItemResponse {

    private String productName;
    private double price;
    private int quantity;

    public OrderItemResponse(String productName, double price, int quantity) {
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }

    public String getProductName() { return productName; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
}