package com.insurance.insurance_management_system.policy.repository;

import com.insurance.insurance_management_system.common.dto.IdCount;
import com.insurance.insurance_management_system.policy.entity.Policy;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    List<Policy> findByCustomer_CustomerIdOrderByCreatedAtDesc(Long customerId);

    @Query("select p from Policy p join fetch p.customer order by p.createdAt desc")
    List<Policy> findAllWithCustomer();

    @Query("select p from Policy p join fetch p.customer "
            + "where p.customer.customerId = :customerId order by p.createdAt desc")
    List<Policy> findByCustomerIdWithCustomer(@Param("customerId") Long customerId);

    @Query("select p.customer.customerId as id, count(p) as total "
            + "from Policy p group by p.customer.customerId")
    List<IdCount> countGroupedByCustomer();

    /** Locks the policy row so two simultaneous requests cannot conflict. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Policy p where p.policyId = :id")
    Optional<Policy> findByIdForUpdate(@Param("id") Long id);
}