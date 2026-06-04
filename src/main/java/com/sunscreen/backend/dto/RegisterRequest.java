//RegisterRequest

package com.sunscreen.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class RegisterRequest {
    @NotBlank(message="Username required")
    @Size(min = 4, message = "Please enter more than 4 characters for username")
    private String username;

    @NotBlank(message="Password required")
    @Size(min = 6, message = "Please enter more than 6 characters for password")
    private String password;


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
