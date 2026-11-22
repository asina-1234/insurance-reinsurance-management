package com.insurance.insurance_management_system.reinsurance.nonproportional.service;

import com.insurance.insurance_management_system.claim.entity.Claim;
import com.insurance.insurance_management_system.reinsurance.nonproportional.dto.NonProportionalTreatyResponse;
import com.insurance.insurance_management_system.reinsurance.nonproportional.entity.NonProportionalTreatyAllocation;
import com.insurance.insurance_management_system.reinsurance.nonproportional.entity.NonProportionalTreatySetup;
import com.insurance.insurance_management_system.reinsurance.nonproportional.repository.NonProportionalTreatyAllocationRepository;
import com.insurance.insurance_management_system.reinsurance.nonproportional.repository.NonProportionalTreatySetupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NonProportionalAllocationService {

    private final NonProportionalTreatySetupRepository setupRepository;
    private final NonProportionalTreatyAllocationRepository allocationRepository;

    /**
     * Receives ONLY the retention amount of the proportional claim allocation.
     * Retention up to the priority limit creates no row. Above it, the retention is spread over
     * priority and layers 1-3; anything above the layer 3 limit goes to priority.
     */
    @Transactional
    public void allocate(Claim claim, BigDecimal retention) {
        NonProportionalTreatySetup s = getSetup();
        if (retention.compareTo(s.getPriorityTo()) <= 0) {
            return;
        }

        BigDecimal layer1 = portion(retention, s.getLayer1From(), s.getLayer1To());
        BigDecimal layer2 = portion(retention, s.getLayer2From(), s.getLayer2To());
        BigDecimal layer3 = portion(retention, s.getLayer3From(), s.getLayer3To());
        BigDecimal excess = retention.subtract(s.getLayer3To()).max(BigDecimal.ZERO);
        BigDecimal priority = s.getPriorityTo().subtract(s.getPriorityFrom()).add(excess);

        allocationRepository.save(NonProportionalTreatyAllocation.builder()
                .policy(claim.getPolicy())
                .claim(claim)
                .retentionAmount(retention)
                .priority(priority)
                .layer1(layer1)
                .layer2(layer2)
                .layer3(layer3)
                .build());
    }

    @Transactional(readOnly = true)
    public NonProportionalTreatyResponse getTreatyView() {
        NonProportionalTreatySetup s = getSetup();
        NonProportionalTreatyResponse.Setup setup = new NonProportionalTreatyResponse.Setup(
                s.getPriorityFrom(), s.getPriorityTo(),
                s.getLayer1From(), s.getLayer1To(),
                s.getLayer2From(), s.getLayer2To(),
                s.getLayer3From(), s.getLayer3To());

        List<NonProportionalTreatyResponse.Allocation> allocations =
                allocationRepository.findAllWithDetails().stream()
                        .map(a -> new NonProportionalTreatyResponse.Allocation(
                                a.getId(),
                                a.getPolicy().getPolicyNumber(),
                                a.getClaim().getClaimNumber(),
                                a.getRetentionAmount(),
                                a.getPriority(),
                                a.getLayer1(),
                                a.getLayer2(),
                                a.getLayer3()))
                        .toList();
        return new NonProportionalTreatyResponse(setup, allocations);
    }

    /** Part of the amount that falls inside the range from..to. */
    private BigDecimal portion(BigDecimal amount, BigDecimal from, BigDecimal to) {
        return amount.min(to).subtract(from).max(BigDecimal.ZERO);
    }

    private NonProportionalTreatySetup getSetup() {
        return setupRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("Non-proportional treaty setup is missing"));
    }
}