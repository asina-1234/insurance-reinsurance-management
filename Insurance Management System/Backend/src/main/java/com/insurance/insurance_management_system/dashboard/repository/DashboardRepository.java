package com.insurance.insurance_management_system.dashboard.repository;

import com.insurance.insurance_management_system.common.enums.Role;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/** Read-only summary queries used only by the dashboard. */
@Repository
@RequiredArgsConstructor
public class DashboardRepository {

    private final EntityManager entityManager;

    public List<LocalDateTime> findCustomerRegistrationDates() {
        return entityManager
                .createQuery("select c.registrationDate from Customer c where c.role = :role",
                        LocalDateTime.class)
                .setParameter("role", Role.USER)
                .getResultList();
    }

    /** Rows: policyType, sum of sumInsured, sum of premium. */
    public List<Object[]> sumByPolicyType() {
        return entityManager
                .createQuery("select p.policyType, sum(p.sumInsured), sum(p.premium) "
                        + "from Policy p group by p.policyType", Object[].class)
                .getResultList();
    }

    /** Rows: status, number of claims, sum of claimAmount. */
    public List<Object[]> sumByClaimStatus() {
        return entityManager
                .createQuery("select c.status, count(c), sum(c.claimAmount) "
                        + "from Claim c group by c.status", Object[].class)
                .getResultList();
    }

    /** Rows: allocationType, total, retention, quota share, surplus. */
    public List<Object[]> sumByAllocationType() {
        return entityManager
                .createQuery("select a.allocationType, sum(a.totalAmount), sum(a.retentionAmount), "
                        + "sum(a.quotaShareAmount), sum(a.surplusAmount) "
                        + "from ProportionalTreatyAllocation a group by a.allocationType",
                        Object[].class)
                .getResultList();
    }
}