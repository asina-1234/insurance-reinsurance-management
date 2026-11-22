package com.insurance.insurance_management_system.reinsurance.proportional.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "proportional_treaty_setup")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProportionalTreatySetup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proportional_treaty_setup_id")
    private Long id;

    @Column(name = "retention_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal retentionPercentage;

    @Column(name = "quota_share_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal quotaSharePercentage;

    @Column(name = "surplus_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal surplusPercentage;
}