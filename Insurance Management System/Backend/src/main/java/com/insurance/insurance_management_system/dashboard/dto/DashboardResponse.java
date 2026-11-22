package com.insurance.insurance_management_system.dashboard.dto;

import com.insurance.insurance_management_system.common.enums.AllocationType;
import com.insurance.insurance_management_system.common.enums.ClaimStatus;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        List<MonthlyCount> customersPerMonth,
        List<PolicyTypeTotal> policyByType,
        List<ClaimStatusTotal> claimsByStatus,
        List<ProportionalShare> proportionalShare) {

    public record MonthlyCount(String month, String label, long count) {
    }

    public record PolicyTypeTotal(String policyType, BigDecimal sumInsured, BigDecimal premium) {
    }

    public record ClaimStatusTotal(ClaimStatus status, long count, BigDecimal amount) {
    }

    public record ProportionalShare(
            AllocationType allocationType,
            BigDecimal retention,
            BigDecimal quotaShare,
            BigDecimal surplus) {
    }
}