package com.insurance.insurance_management_system.reinsurance.proportional.repository;

import com.insurance.insurance_management_system.reinsurance.proportional.entity.ProportionalTreatyAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProportionalTreatyAllocationRepository
        extends JpaRepository<ProportionalTreatyAllocation, Long> {

    @Query("select a from ProportionalTreatyAllocation a join fetch a.policy "
            + "left join fetch a.claim order by a.id desc")
    List<ProportionalTreatyAllocation> findAllWithDetails();
}