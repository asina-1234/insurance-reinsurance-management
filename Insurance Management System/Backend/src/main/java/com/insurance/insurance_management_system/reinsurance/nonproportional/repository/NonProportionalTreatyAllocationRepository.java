package com.insurance.insurance_management_system.reinsurance.nonproportional.repository;

import com.insurance.insurance_management_system.reinsurance.nonproportional.entity.NonProportionalTreatyAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NonProportionalTreatyAllocationRepository
        extends JpaRepository<NonProportionalTreatyAllocation, Long> {

    @Query("select a from NonProportionalTreatyAllocation a join fetch a.policy "
            + "join fetch a.claim order by a.id desc")
    List<NonProportionalTreatyAllocation> findAllWithDetails();
}