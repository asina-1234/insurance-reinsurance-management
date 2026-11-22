package com.insurance.insurance_management_system.policy.dto;

import com.insurance.insurance_management_system.common.enums.PolicyStatus;
import com.insurance.insurance_management_system.policy.entity.Policy;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AdminPolicyResponse(
        Long policyId,
        String policyNumber,
        Long customerId,
        String customerName,
        String policyType,
        String addons,
        BigDecimal sumInsured,
        BigDecimal premium,
        LocalDate startDate,
        LocalDate endDate,
        PolicyStatus status,
        long claimsCount) {

    public static AdminPolicyResponse from(Policy policy, long claimsCount) {
        PolicyResponse base = PolicyResponse.from(policy);
        return new AdminPolicyResponse(
                base.policyId(),
                base.policyNumber(),
                policy.getCustomer().getCustomerId(),
                policy.getCustomer().getName(),
                base.policyType(),
                base.addons(),
                base.sumInsured(),
                base.premium(),
                base.startDate(),
                base.endDate(),
                base.status(),
                claimsCount);
    }
}