//AddressRepository

package com.sunscreen.backend.repository;

import com.sunscreen.backend.entity.Address;
import com.sunscreen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUser(User user);
}