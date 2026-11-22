package com.insurance.insurance_management_system.policy.catalog;

import com.insurance.insurance_management_system.common.exception.BadRequestException;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Getter
public enum PolicyType {

    HEALTH("Health", "2.00", List.of(
            AddOnOption.of("Maternity", "15"),
            AddOnOption.of("Critical Illness", "20"),
            AddOnOption.of("OPD", "10"),
            AddOnOption.of("Dental", "5"),
            AddOnOption.of("Ambulance", "3"))),

    MOTOR("Motor", "3.00", List.of(
            AddOnOption.of("Zero Depreciation", "15"),
            AddOnOption.of("Engine Protect", "10"),
            AddOnOption.of("Roadside Assistance", "5"),
            AddOnOption.of("Passenger Cover", "8"),
            AddOnOption.of("Consumables", "4"))),

    PROPERTY("Property", "1.00", List.of(
            AddOnOption.of("Fire & Allied", "12"),
            AddOnOption.of("Burglary", "10"),
            AddOnOption.of("Natural Calamity", "15"),
            AddOnOption.of("Terrorism", "6"),
            AddOnOption.of("Electrical Breakdown", "8"))),

    LIFE("Life", "1.50", List.of(
            AddOnOption.of("Accidental Death", "10"),
            AddOnOption.of("Critical Illness Rider", "15"),
            AddOnOption.of("Waiver of Premium", "5"),
            AddOnOption.of("Disability", "8"),
            AddOnOption.of("Income Benefit", "12")));

    private final String label;
    private final BigDecimal baseRatePercent;
    private final List<AddOnOption> addOns;

    PolicyType(String label, String baseRatePercent, List<AddOnOption> addOns) {
        this.label = label;
        this.baseRatePercent = new BigDecimal(baseRatePercent);
        this.addOns = addOns;
    }

    public static PolicyType fromCode(String code) {
        try {
            return PolicyType.valueOf(code.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid policy type");
        }
    }

    public Optional<AddOnOption> findAddOn(String name) {
        return addOns.stream()
                .filter(a -> a.name().equalsIgnoreCase(name))
                .findFirst();
    }
}