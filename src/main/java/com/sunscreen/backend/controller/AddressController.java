//AddressController
package com.sunscreen.backend.controller;

import com.sunscreen.backend.dto.AddressRequest;
import com.sunscreen.backend.entity.Address;
import com.sunscreen.backend.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/address")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping
    public String addAddress(@Valid @RequestBody AddressRequest request,
                             HttpServletRequest httpRequest) {

        int userId = (int) httpRequest.getAttribute("userId");

        return addressService.addAddress(userId, request);
    }

    @GetMapping
    public List<Address> getAddresses(HttpServletRequest request) {

        int userId = (int) request.getAttribute("userId");

        return addressService.getUserAddresses(userId);
    }
}
