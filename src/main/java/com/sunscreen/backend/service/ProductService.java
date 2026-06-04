//ProductService

package com.sunscreen.backend.service;

import com.sunscreen.backend.entity.Product;
import com.sunscreen.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findByActiveTrue();
    }

    public Product getById(int id) {
        return productRepository.findByIdAndActiveTrue(id).orElse(null);
    }
}