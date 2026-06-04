//AddressService

package com.sunscreen.backend.service;

import com.sunscreen.backend.dto.AddressRequest;
import com.sunscreen.backend.entity.Address;
import com.sunscreen.backend.entity.User;
import com.sunscreen.backend.repository.AddressRepository;
import com.sunscreen.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository,
                          UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public String addAddress(int userId, AddressRequest request) {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return "Invalid user";

        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        addressRepository.save(address);

        return "Address added successfully";
    }

    public List<Address> getUserAddresses(int userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();

        return addressRepository.findByUser(user);
    }
}