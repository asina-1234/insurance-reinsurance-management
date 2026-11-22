package com.insurance.insurance_management_system.reinsurance.service;

import com.insurance.insurance_management_system.claim.event.ClaimApprovedEvent;
import com.insurance.insurance_management_system.policy.event.PolicyApprovedEvent;
import com.insurance.insurance_management_system.reinsurance.nonproportional.service.NonProportionalAllocationService;
import com.insurance.insurance_management_system.reinsurance.proportional.entity.ProportionalTreatyAllocation;
import com.insurance.insurance_management_system.reinsurance.proportional.service.ProportionalAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Runs inside the same database transaction as the approval, so a failed allocation
 * rolls the approval back and no half-finished data is ever saved.
 */
@Component
@RequiredArgsConstructor
public class ReinsuranceEventListener {

    private final ProportionalAllocationService proportionalService;
    private final NonProportionalAllocationService nonProportionalService;

    @EventListener
    public void onPolicyApproved(PolicyApprovedEvent event) {
        proportionalService.allocatePolicy(event.policy());
    }

    @EventListener
    public void onClaimApproved(ClaimApprovedEvent event) {
        ProportionalTreatyAllocation allocation = proportionalService.allocateClaim(event.claim());
        nonProportionalService.allocate(event.claim(), allocation.getRetentionAmount());
    }
}