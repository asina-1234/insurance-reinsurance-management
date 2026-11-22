package com.insurance.insurance_management_system.reinsurance.nonproportional.entity;

import com.insurance.insurance_management_system.claim.entity.Claim;
import com.insurance.insurance_management_system.policy.entity.Policy;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "non_proportional_treaty_allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NonProportionalTreatyAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "non_proportional_treaty_allocation_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    @Column(name = "retention_amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal retentionAmount;

    @Column(nullable = false, precision = 18, scale = 2)
    private BigDecimal priority;

    @Column(name = "layer_1", nullable = false, precision = 18, scale = 2)
    private BigDecimal layer1;

    @Column(name = "layer_2", nullable = false, precision = 18, scale = 2)
    private BigDecimal layer2;

    @Column(name = "layer_3", nullable = false, precision = 18, scale = 2)
    private BigDecimal layer3;
}