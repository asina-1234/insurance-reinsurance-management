package com.insurance.insurance_management_system.policy.service;

import com.insurance.insurance_management_system.policy.catalog.AddOnOption;
import com.insurance.insurance_management_system.policy.catalog.PolicyType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class PremiumCalculator {

    private static final BigDecimal HUNDRED = new BigDecimal("100");

    /** premium = (sumInsured x baseRate%) x (1 + total add-on %) */
    public BigDecimal calculate(PolicyType type, List<AddOnOption> addOns, BigDecimal sumInsured) {
        BigDecimal base = sumInsured.multiply(type.getBaseRatePercent()).divide(HUNDRED);
        BigDecimal addOnPercent = addOns.stream()
                .map(AddOnOption::percentage)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal factor = BigDecimal.ONE.add(addOnPercent.divide(HUNDRED));
        return base.multiply(factor).setScale(2, RoundingMode.HALF_UP);
    }
}