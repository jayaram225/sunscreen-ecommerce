//User

package com.sunscreen.backend.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String password;

    private String role;
    private boolean active = true;

    public int getId() {
        return id;
    }
    public String getUsername(){
        return username;
    }
    public String getPassword(){
        return password;
    }
    public String getRole(){
        return role;
    }

    public boolean isActive() {
        return active;
    }



    public void setUsername(String username){
        this.username=username;
    }
    public void setPassword(String password){
        this.password=password;
    }
    public void setRole(String role){
        this.role = role;
    }
    public void setActive(boolean active) {
        this.active = active;
    }
}