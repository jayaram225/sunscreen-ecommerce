//Product

package com.sunscreen.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private double price;
    @Column(name="image_url")
    private String imageUrl;

    private int stock;
    private boolean active = true;

    public void setId(int id){
        this.id=id;

    }
    public int getId(){
        return id;
    }

    public void setName(String name){
        this.name= name;
    }
    public String getName(){
        return name;
    }
    public void setPrice(double price){
        this.price=price;
    }
    public double getPrice(){
        return price;
    }
    public void setImageUrl(String imageUrl){
        this.imageUrl=imageUrl;
    }
    public String getImageUrl(){
        return imageUrl;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }


    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }


}