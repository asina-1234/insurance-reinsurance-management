package com.insurance.insurance_management_system.reinsurance.proportional.dto;

import com.insurance.insurance_management_system.common.enums.AllocationType;

import java.math.BigDecimal;
import java.util.List;

public record ProportionalTreatyResponse(Setup setup, List<Allocation> allocations) {

    public record Setup(
            BigDecimal retentionPercentage,
            BigDecimal quotaSharePercentage,
            BigDecimal surplusPercentage) {
    }

    public record Allocation(
            Long id,
            String policyNumber,
            String claimNumber,
            AllocationType allocationType,
            BigDecimal totalAmount,
            BigDecimal retentionAmount,
            BigDecimal quotaShareAmount,
            BigDecimal surplusAmount) {
    }
}