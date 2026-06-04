//AdminProductController

package com.sunscreen.backend.controller;

import com.sunscreen.backend.entity.Product;
import com.sunscreen.backend.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

    private final ProductRepository productRepository;

    public AdminProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 👉 ADD PRODUCT
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        product.setActive(true);
        return productRepository.save(product);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable int id) {
        Product product = productRepository.findById(id).orElse(null);

        if (product == null) {
            return "Product not found";
        }

        product.setActive(false);
        productRepository.save(product);



        return "Product removed successfully";
    }


    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable int id, @RequestBody Product updatedProduct) {

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(updatedProduct.getName());
        existing.setPrice(updatedProduct.getPrice());
        existing.setImageUrl(updatedProduct.getImageUrl());
        existing.setStock(updatedProduct.getStock());

        return productRepository.save(existing);
    }

    @PutMapping("/{id}/restore")
    public String restoreProduct(@PathVariable int id) {

        Product product = productRepository.findById(id).orElse(null);

        if (product == null) {
            return "Product not found";
        }

        product.setActive(true);
        productRepository.save(product);

        return "Product restored successfully ✅";
    }


}