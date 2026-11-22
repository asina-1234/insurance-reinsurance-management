package com.insurance.insurance_management_system.claim.dto;

import com.insurance.insurance_management_system.claim.entity.Claim;
import com.insurance.insurance_management_system.common.enums.ClaimStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record AdminClaimResponse(
        Long claimId,
        String claimNumber,
        Long policyId,
        String policyNumber,
        Long customerId,
        String customerName,
        BigDecimal claimAmount,
        BigDecimal approvedAmount,
        LocalDate incidentDate,
        String reason,
        ClaimStatus status,
        LocalDateTime submittedDate) {

    public static AdminClaimResponse from(Claim claim) {
        return new AdminClaimResponse(
                claim.getClaimId(),
                claim.getClaimNumber(),
                claim.getPolicy().getPolicyId(),
                claim.getPolicy().getPolicyNumber(),
                claim.getCustomer().getCustomerId(),
                claim.getCustomer().getName(),
                claim.getClaimAmount(),
                claim.getApprovedAmount(),
                claim.getIncidentDate(),
                claim.getReason(),
                claim.getStatus(),
                claim.getSubmittedDate());
    }
}