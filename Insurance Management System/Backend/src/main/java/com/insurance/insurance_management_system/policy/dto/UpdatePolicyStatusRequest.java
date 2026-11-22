package com.insurance.insurance_management_system.policy.dto;

import com.insurance.insurance_management_system.common.enums.PolicyStatus;
import jakarta.validation.constraints.NotNull;

public record UpdatePolicyStatusRequest(
        @NotNull(message = "Status is required") PolicyStatus status) {
}