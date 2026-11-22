package com.insurance.insurance_management_system.common.config;

import com.insurance.insurance_management_system.reinsurance.nonproportional.entity.NonProportionalTreatySetup;
import com.insurance.insurance_management_system.reinsurance.nonproportional.repository.NonProportionalTreatySetupRepository;
import com.insurance.insurance_management_system.reinsurance.proportional.entity.ProportionalTreatySetup;
import com.insurance.insurance_management_system.reinsurance.proportional.repository.ProportionalTreatySetupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class TreatySetupSeeder implements CommandLineRunner {

    private final ProportionalTreatySetupRepository proportionalRepo;
    private final NonProportionalTreatySetupRepository nonProportionalRepo;

    @Override
    public void run(String... args) {
        if (proportionalRepo.count() == 0) {
            proportionalRepo.save(ProportionalTreatySetup.builder()
                    .retentionPercentage(new BigDecimal("20.00"))
                    .quotaSharePercentage(new BigDecimal("30.00"))
                    .surplusPercentage(new BigDecimal("50.00"))
                    .build());
        }
        if (nonProportionalRepo.count() == 0) {
            nonProportionalRepo.save(NonProportionalTreatySetup.builder()
                    .priorityFrom(new BigDecimal("0.00"))
                    .priorityTo(new BigDecimal("50000.00"))
                    .layer1From(new BigDecimal("50000.00"))
                    .layer1To(new BigDecimal("150000.00"))
                    .layer2From(new BigDecimal("150000.00"))
                    .layer2To(new BigDecimal("250000.00"))
                    .layer3From(new BigDecimal("250000.00"))
                    .layer3To(new BigDecimal("350000.00"))
                    .build());
        }
    }
}