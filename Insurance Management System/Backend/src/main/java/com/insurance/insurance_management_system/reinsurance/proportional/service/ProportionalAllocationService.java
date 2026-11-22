package com.insurance.insurance_management_system.reinsurance.proportional.service;

import com.insurance.insurance_management_system.claim.entity.Claim;
import com.insurance.insurance_management_system.common.enums.AllocationType;
import com.insurance.insurance_management_system.policy.entity.Policy;
import com.insurance.insurance_management_system.reinsurance.proportional.dto.ProportionalTreatyResponse;
import com.insurance.insurance_management_system.reinsurance.proportional.entity.ProportionalTreatyAllocation;
import com.insurance.insurance_management_system.reinsurance.proportional.entity.ProportionalTreatySetup;
import com.insurance.insurance_management_system.reinsurance.proportional.repository.ProportionalTreatyAllocationRepository;
import com.insurance.insurance_management_system.reinsurance.proportional.repository.ProportionalTreatySetupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProportionalAllocationService {

    private static final BigDecimal HUNDRED = new BigDecimal("100");

    private final ProportionalTreatySetupRepository setupRepository;
    private final ProportionalTreatyAllocationRepository allocationRepository;

    /** Policy approved: one row for sum insured and one row for premium. */
    @Transactional
    public void allocatePolicy(Policy policy) {
        ProportionalTreatySetup setup = getSetup();
        allocationRepository.save(
                build(setup, policy, null, AllocationType.SUM_INSURED, policy.getSumInsured()));
        allocationRepository.save(
                build(setup, policy, null, AllocationType.PREMIUM, policy.getPremium()));
    }

    /** Claim approved: one CLAIM row. The caller passes its retention on to the non-proportional step. */
    @Transactional
    public ProportionalTreatyAllocation allocateClaim(Claim claim) {
        return allocationRepository.save(build(
                getSetup(), claim.getPolicy(), claim, AllocationType.CLAIM, claim.getApprovedAmount()));
    }

    @Transactional(readOnly = true)
    public ProportionalTreatyResponse getTreatyView() {
        ProportionalTreatySetup s = getSetup();
        ProportionalTreatyResponse.Setup setup = new ProportionalTreatyResponse.Setup(
                s.getRetentionPercentage(), s.getQuotaSharePercentage(), s.getSurplusPercentage());

        List<ProportionalTreatyResponse.Allocation> allocations =
                allocationRepository.findAllWithDetails().stream()
                        .map(a -> new ProportionalTreatyResponse.Allocation(
                                a.getId(),
                                a.getPolicy().getPolicyNumber(),
                                a.getClaim() == null ? null : a.getClaim().getClaimNumber(),
                                a.getAllocationType(),
                                a.getTotalAmount(),
                                a.getRetentionAmount(),
                                a.getQuotaShareAmount(),
                                a.getSurplusAmount()))
                        .toList();
        return new ProportionalTreatyResponse(setup, allocations);
    }

    private ProportionalTreatySetup getSetup() {
        return setupRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("Proportional treaty setup is missing"));
    }

    private ProportionalTreatyAllocation build(ProportionalTreatySetup setup, Policy policy,
                                               Claim claim, AllocationType type, BigDecimal total) {
        BigDecimal retention = percentOf(total, setup.getRetentionPercentage());
        BigDecimal quotaShare = percentOf(total, setup.getQuotaSharePercentage());
        BigDecimal surplus = total.subtract(retention).subtract(quotaShare); // parts always add up

        return ProportionalTreatyAllocation.builder()
                .policy(policy)
                .claim(claim)
                .allocationType(type)
                .totalAmount(total)
                .retentionAmount(retention)
                .quotaShareAmount(quotaShare)
                .surplusAmount(surplus)
                .build();
    }

    private BigDecimal percentOf(BigDecimal total, BigDecimal percentage) {
        return total.multiply(percentage).divide(HUNDRED, 2, RoundingMode.HALF_UP);
    }
}