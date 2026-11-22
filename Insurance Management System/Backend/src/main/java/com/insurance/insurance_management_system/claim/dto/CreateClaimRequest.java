package com.insurance.insurance_management_system.claim.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateClaimRequest(
        @NotNull(message = "Policy is required") Long policyId,
        @NotNull(message = "Claim amount is required")
        @DecimalMin(value = "1", message = "Claim amount must be greater than zero")
        @Digits(integer = 16, fraction = 2, message = "Invalid claim amount")
        BigDecimal claimAmount,
        @NotNull(message = "Incident date is required") LocalDate incidentDate,
        @NotBlank(message = "Reason is required")
        @Size(max = 500, message = "Reason must be at most 500 characters")
        String reason) {
}