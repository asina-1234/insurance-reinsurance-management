package com.insurance.insurance_management_system.policy.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreatePolicyRequest(
        @NotBlank(message = "Policy type is required") String policyType,
        List<String> addons,
        @NotNull(message = "Sum insured is required")
        @DecimalMin(value = "1", message = "Sum insured must be greater than zero")
        @Digits(integer = 16, fraction = 2, message = "Invalid sum insured")
        BigDecimal sumInsured) {
}