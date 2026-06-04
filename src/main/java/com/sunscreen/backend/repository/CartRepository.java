//CartRepository

package com.sunscreen.backend.repository;
import java.util.List;

import com.sunscreen.backend.entity.Cart;
import com.sunscreen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
   // Optional<Cart> findByProductIdAndUser(int productId, User user);
    List<Cart> findByUser(User user);
}
