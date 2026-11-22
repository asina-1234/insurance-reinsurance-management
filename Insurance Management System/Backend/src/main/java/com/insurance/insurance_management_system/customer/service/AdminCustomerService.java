package com.insurance.insurance_management_system.customer.service;

import com.insurance.insurance_management_system.claim.repository.ClaimRepository;
import com.insurance.insurance_management_system.common.dto.IdCount;
import com.insurance.insurance_management_system.common.enums.Role;
import com.insurance.insurance_management_system.customer.dto.AdminCustomerResponse;
import com.insurance.insurance_management_system.customer.repository.CustomerRepository;
import com.insurance.insurance_management_system.policy.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminCustomerService {

    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;

    @Transactional(readOnly = true)
    public List<AdminCustomerResponse> getAllCustomers() {
        Map<Long, Long> policyCounts = toMap(policyRepository.countGroupedByCustomer());
        Map<Long, Long> claimCounts = toMap(claimRepository.countGroupedByCustomer());

        return customerRepository.findByRoleOrderByCustomerIdAsc(Role.USER).stream()
                .map(c -> new AdminCustomerResponse(
                        c.getCustomerId(),
                        c.getName(),
                        c.getEmail(),
                        c.getPhone(),
                        c.getAddress(),
                        c.getRegistrationDate(),
                        policyCounts.getOrDefault(c.getCustomerId(), 0L),
                        claimCounts.getOrDefault(c.getCustomerId(), 0L)))
                .toList();
    }

    private Map<Long, Long> toMap(List<IdCount> counts) {
        return counts.stream().collect(Collectors.toMap(IdCount::getId, IdCount::getTotal));
    }
}