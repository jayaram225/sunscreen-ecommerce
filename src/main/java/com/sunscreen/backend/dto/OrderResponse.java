//OrderResponse

package com.sunscreen.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private int id;
    private double totalAmount;
    private LocalDateTime orderDate;
    private List<OrderItemResponse> items;
    private String status;
    private String paymentStatus;


    public OrderResponse(int id, double totalAmount, LocalDateTime orderDate, List<OrderItemResponse> items, String status,String paymentStatus) {
        this.id = id;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.items = items;
        this.status=status;
        this.paymentStatus= paymentStatus;
    }

    public int getId() { return id; }
    public double getTotalAmount() { return totalAmount; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public List<OrderItemResponse> getItems() { return items; }
    public String getStatus() { return status; }
    public String getPaymentStatus() {
        return paymentStatus;
    }

}