package com.insurance.insurance_management_system.reinsurance.proportional.entity;

import com.insurance.insurance_management_system.claim.entity.Claim;
import com.insurance.insurance_management_system.common.enums.AllocationType;
import com.insurance.insurance_management_system.policy.entity.Policy;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "proportional_treaty_allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProportionalTreatyAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proportional_treaty_allocation_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id")
    private Claim claim;

    @Enumerated(EnumType.STRING)
    @Column(name = "allocation_type", nullable = false, length = 20)
    private AllocationType allocationType;

    @Column(name = "total_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "retention_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal retentionAmount;

    @Column(name = "quota_share_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal quotaShareAmount;

    @Column(name = "surplus_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal surplusAmount;
}