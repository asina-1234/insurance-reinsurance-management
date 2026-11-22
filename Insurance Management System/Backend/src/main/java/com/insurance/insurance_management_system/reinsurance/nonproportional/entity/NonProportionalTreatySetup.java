package com.insurance.insurance_management_system.reinsurance.nonproportional.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "non_proportional_treaty_setup")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NonProportionalTreatySetup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "non_proportional_treaty_setup_id")
    private Long id;

    @Column(name = "priority_from", nullable = false, precision = 18, scale = 2)
    private BigDecimal priorityFrom;

    @Column(name = "priority_to", nullable = false, precision = 18, scale = 2)
    private BigDecimal priorityTo;

    @Column(name = "layer_1_from", nullable = false, precision = 18, scale = 2)
    private BigDecimal layer1From;

    @Column(name = "layer_1_to", nullable = false, precision = 18, scale = 2)
    private BigDecimal layer1To;

    @Column(name = "layer_2_from", nullable = false, precision = 18, scale = 2)
    private BigDecimal layer2From;

    @Column(name = "layer_2_to", nullable = false, precision = 18, scale = 2)
    private BigDecimal layer2To;

    @Column(name = "layer_3_from", nullable = false, precision = 18, scale = 2)
    private BigDecimal layer3From;

    @Column(name = "layer_3_to", nullable = false, precision = 18, scale = 2)
    private BigDecimal layer3To;
}