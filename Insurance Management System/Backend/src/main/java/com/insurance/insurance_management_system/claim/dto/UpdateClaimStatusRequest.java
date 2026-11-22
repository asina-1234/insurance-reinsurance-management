package com.insurance.insurance_management_system.claim.dto;

import com.insurance.insurance_management_system.common.enums.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateClaimStatusRequest(
        @NotNull(message = "Status is required") ClaimStatus status) {
}