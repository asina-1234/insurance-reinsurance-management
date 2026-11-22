package com.insurance.insurance_management_system.claim.repository;

import com.insurance.insurance_management_system.claim.entity.Claim;
import com.insurance.insurance_management_system.common.dto.IdCount;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByCustomer_CustomerIdOrderBySubmittedDateDesc(Long customerId);

    /** Total claimed on a policy. Null if there are no claims yet. */
    @Query("select sum(c.claimAmount) from Claim c where c.policy.policyId = :policyId")
    BigDecimal sumClaimedAmount(@Param("policyId") Long policyId);

    @Query("select c from Claim c join fetch c.policy join fetch c.customer "
            + "order by c.submittedDate desc")
    List<Claim> findAllWithDetails();

    @Query("select c from Claim c join fetch c.policy join fetch c.customer "
            + "where c.customer.customerId = :customerId order by c.submittedDate desc")
    List<Claim> findByCustomerIdWithDetails(@Param("customerId") Long customerId);

    @Query("select c from Claim c join fetch c.policy join fetch c.customer "
            + "where c.policy.policyId = :policyId order by c.submittedDate desc")
    List<Claim> findByPolicyIdWithDetails(@Param("policyId") Long policyId);

    @Query("select c.customer.customerId as id, count(c) as total "
            + "from Claim c group by c.customer.customerId")
    List<IdCount> countGroupedByCustomer();

    @Query("select c.policy.policyId as id, count(c) as total "
            + "from Claim c group by c.policy.policyId")
    List<IdCount> countGroupedByPolicy();

    long countByPolicy_PolicyId(Long policyId);

    /** Locks the claim row so it cannot be approved twice at the same time. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Claim c where c.claimId = :id")
    Optional<Claim> findByIdForUpdate(@Param("id") Long id);
}