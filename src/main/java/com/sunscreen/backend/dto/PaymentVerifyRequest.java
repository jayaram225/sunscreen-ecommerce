//PaymentVerifyRequest

package com.sunscreen.backend.dto;

public class PaymentVerifyRequest {

    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    private Long addressId;

    // 🔹 GETTERS

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public String getRazorpaySignature() {
        return razorpaySignature;
    }

    public Long getAddressId() {
        return addressId;
    }

    // 🔹 SETTERS

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public void setRazorpaySignature(String razorpaySignature) {
        this.razorpaySignature = razorpaySignature;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }
}