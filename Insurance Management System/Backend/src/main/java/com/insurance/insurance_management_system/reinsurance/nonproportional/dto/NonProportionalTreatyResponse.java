package com.insurance.insurance_management_system.reinsurance.nonproportional.dto;

import java.math.BigDecimal;
import java.util.List;

public record NonProportionalTreatyResponse(Setup setup, List<Allocation> allocations) {

    public record Setup(
            BigDecimal priorityFrom,
            BigDecimal priorityTo,
            BigDecimal layer1From,
            BigDecimal layer1To,
            BigDecimal layer2From,
            BigDecimal layer2To,
            BigDecimal layer3From,
            BigDecimal layer3To) {
    }

    public record Allocation(
            Long id,
            String policyNumber,
            String claimNumber,
            BigDecimal retentionAmount,
            BigDecimal priority,
            BigDecimal layer1,
            BigDecimal layer2,
            BigDecimal layer3) {
    }
}