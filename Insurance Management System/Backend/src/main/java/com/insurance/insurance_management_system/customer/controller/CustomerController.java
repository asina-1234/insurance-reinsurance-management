package com.insurance.insurance_management_system.customer.controller;

import com.insurance.insurance_management_system.common.response.ApiResponse;
import com.insurance.insurance_management_system.customer.dto.ProfileResponse;
import com.insurance.insurance_management_system.customer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Profile fetched", customerService.getProfile(authentication.getName())));
    }
}