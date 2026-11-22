package com.insurance.insurance_management_system.claim.event;

import com.insurance.insurance_management_system.claim.entity.Claim;

public record ClaimApprovedEvent(Claim claim) {
}