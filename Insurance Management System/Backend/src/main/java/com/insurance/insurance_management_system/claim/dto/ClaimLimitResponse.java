package com.insurance.insurance_management_system.claim.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ClaimLimitResponse(
        Long policyId,
        String policyNumber,
        BigDecimal sumInsured,
        BigDecimal claimedAmount,
        BigDecimal remainingLimit,
        LocalDate startDate,
        LocalDate endDate) {
}