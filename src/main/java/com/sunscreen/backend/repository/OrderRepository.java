//OrderRepository

package com.sunscreen.backend.repository;

import com.sunscreen.backend.entity.Order;
import com.sunscreen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUser(User user);
}