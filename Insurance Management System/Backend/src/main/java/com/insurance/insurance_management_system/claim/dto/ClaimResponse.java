package com.insurance.insurance_management_system.claim.dto;

import com.insurance.insurance_management_system.claim.entity.Claim;
import com.insurance.insurance_management_system.common.enums.ClaimStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ClaimResponse(
        Long claimId,
        String claimNumber,
        Long policyId,
        String policyNumber,
        String policyType,
        BigDecimal claimAmount,
        BigDecimal approvedAmount,
        LocalDate incidentDate,
        String reason,
        ClaimStatus status,
        LocalDateTime submittedDate) {

    public static ClaimResponse from(Claim claim) {
        return new ClaimResponse(
                claim.getClaimId(),
                claim.getClaimNumber(),
                claim.getPolicy().getPolicyId(),
                claim.getPolicy().getPolicyNumber(),
                claim.getPolicy().getPolicyType(),
                claim.getClaimAmount(),
                claim.getApprovedAmount(),
                claim.getIncidentDate(),
                claim.getReason(),
                claim.getStatus(),
                claim.getSubmittedDate());
    }
}