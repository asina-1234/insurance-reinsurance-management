package com.insurance.insurance_management_system.customer.dto;

import com.insurance.insurance_management_system.policy.dto.PolicyResponse;

import java.util.List;

public record ProfileResponse(
        Long customerId,
        String name,
        String email,
        String phone,
        String address,
        List<PolicyResponse> policies) {
}