package com.insurance.insurance_management_system.policy.catalog;

import java.math.BigDecimal;

public record AddOnOption(String name, BigDecimal percentage) {

    public static AddOnOption of(String name, String percentage) {
        return new AddOnOption(name, new BigDecimal(percentage));
    }
}