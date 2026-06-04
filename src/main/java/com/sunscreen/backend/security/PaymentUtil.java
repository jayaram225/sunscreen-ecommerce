package com.sunscreen.backend.security;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class PaymentUtil {

    public static String hmacSHA256(String data, String secret) {
        try {
            String algorithm = "HmacSHA256";

            Mac mac = Mac.getInstance(algorithm);
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(), algorithm);
            mac.init(keySpec);

            byte[] rawHmac = mac.doFinal(data.getBytes());

            // 🔥 Razorpay expects HEX, not Base64
            StringBuilder hex = new StringBuilder(2 * rawHmac.length);
            for (byte b : rawHmac) {
                String hexByte = Integer.toHexString(0xff & b);
                if (hexByte.length() == 1) hex.append('0');
                hex.append(hexByte);
            }

            return hex.toString();

        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC SHA256", e);
        }
    }
}