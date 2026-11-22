package com.insurance.insurance_management_system.policy.event;

import com.insurance.insurance_management_system.policy.entity.Policy;

public record PolicyApprovedEvent(Policy policy) {
}