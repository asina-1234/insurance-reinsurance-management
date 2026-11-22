package com.insurance.insurance_management_system.customer.dto;

import java.time.LocalDateTime;

public record AdminCustomerResponse(
        Long customerId,
        String name,
        String email,
        String phone,
        String address,
        LocalDateTime registrationDate,
        long policiesCount,
        long claimsCount) {
}