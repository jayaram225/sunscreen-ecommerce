//ProductRepository

package com.sunscreen.backend.repository;

import com.sunscreen.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByActiveTrue();
    Optional<Product> findByIdAndActiveTrue(int id);


}