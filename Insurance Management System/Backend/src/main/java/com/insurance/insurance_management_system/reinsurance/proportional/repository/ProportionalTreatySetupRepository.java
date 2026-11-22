package com.insurance.insurance_management_system.reinsurance.proportional.repository;

import com.insurance.insurance_management_system.reinsurance.proportional.entity.ProportionalTreatySetup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProportionalTreatySetupRepository
        extends JpaRepository<ProportionalTreatySetup, Long> {
}