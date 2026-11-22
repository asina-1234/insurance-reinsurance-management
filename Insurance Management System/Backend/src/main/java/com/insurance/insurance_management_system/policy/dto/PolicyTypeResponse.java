package com.insurance.insurance_management_system.policy.dto;

import java.math.BigDecimal;
import java.util.List;

public record PolicyTypeResponse(
        String code,
        String label,
        BigDecimal baseRatePercent,
        List<AddOnResponse> addOns) {
}