package com.insurance.insurance_management_system.reinsurance.nonproportional.repository;

import com.insurance.insurance_management_system.reinsurance.nonproportional.entity.NonProportionalTreatySetup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NonProportionalTreatySetupRepository
        extends JpaRepository<NonProportionalTreatySetup, Long> {
}