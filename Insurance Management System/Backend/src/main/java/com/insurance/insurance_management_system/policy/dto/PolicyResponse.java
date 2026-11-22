package com.insurance.insurance_management_system.policy.dto;

import com.insurance.insurance_management_system.common.enums.PolicyStatus;
import com.insurance.insurance_management_system.policy.entity.Policy;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PolicyResponse(
        Long policyId,
        String policyNumber,
        String policyType,
        String addons,
        BigDecimal sumInsured,
        BigDecimal premium,
        LocalDate startDate,
        LocalDate endDate,
        PolicyStatus status) {

    /** An ACTIVE policy whose end date has passed is shown as EXPIRED. */
    public static PolicyResponse from(Policy policy) {
        PolicyStatus status = policy.getStatus();
        if (status == PolicyStatus.ACTIVE && policy.getEndDate().isBefore(LocalDate.now())) {
            status = PolicyStatus.EXPIRED;
        }
        return new PolicyResponse(
                policy.getPolicyId(),
                policy.getPolicyNumber(),
                policy.getPolicyType(),
                policy.getAddons(),
                policy.getSumInsured(),
                policy.getPremium(),
                policy.getStartDate(),
                policy.getEndDate(),
                status);
    }
}