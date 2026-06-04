//OrderItemRepository

package com.sunscreen.backend.repository;

import com.sunscreen.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {}