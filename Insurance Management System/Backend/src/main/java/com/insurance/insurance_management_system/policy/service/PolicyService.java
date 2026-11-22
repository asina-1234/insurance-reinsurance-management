package com.insurance.insurance_management_system.policy.service;

import com.insurance.insurance_management_system.claim.repository.ClaimRepository;
import com.insurance.insurance_management_system.common.dto.IdCount;
import com.insurance.insurance_management_system.common.enums.PolicyStatus;
import com.insurance.insurance_management_system.common.exception.BadRequestException;
import com.insurance.insurance_management_system.common.exception.NotFoundException;
import com.insurance.insurance_management_system.customer.entity.Customer;
import com.insurance.insurance_management_system.customer.repository.CustomerRepository;
import com.insurance.insurance_management_system.policy.catalog.AddOnOption;
import com.insurance.insurance_management_system.policy.catalog.PolicyType;
import com.insurance.insurance_management_system.policy.dto.AddOnResponse;
import com.insurance.insurance_management_system.policy.dto.AdminPolicyResponse;
import com.insurance.insurance_management_system.policy.dto.CreatePolicyRequest;
import com.insurance.insurance_management_system.policy.dto.PolicyResponse;
import com.insurance.insurance_management_system.policy.dto.PolicyTypeResponse;
import com.insurance.insurance_management_system.policy.entity.Policy;
import com.insurance.insurance_management_system.policy.event.PolicyApprovedEvent;
import com.insurance.insurance_management_system.policy.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;
    private final ClaimRepository claimRepository;
    private final PremiumCalculator premiumCalculator;
    private final ApplicationEventPublisher eventPublisher;

    // ------------------------------------------------------------------ customer side

    public List<PolicyTypeResponse> getCatalog() {
        return Arrays.stream(PolicyType.values())
                .map(t -> new PolicyTypeResponse(
                        t.name(),
                        t.getLabel(),
                        t.getBaseRatePercent(),
                        t.getAddOns().stream()
                                .map(a -> new AddOnResponse(a.name(), a.percentage()))
                                .toList()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PolicyResponse> getMyPolicies(String email) {
        Customer customer = findCustomer(email);
        return policyRepository
                .findByCustomer_CustomerIdOrderByCreatedAtDesc(customer.getCustomerId())
                .stream()
                .map(PolicyResponse::from)
                .toList();
    }

    @Transactional
    public PolicyResponse createPolicy(String email, CreatePolicyRequest req) {
        Customer customer = findCustomer(email);
        PolicyType type = PolicyType.fromCode(req.policyType());
        List<AddOnOption> selected = resolveAddOns(type, req.addons());
        BigDecimal sumInsured = req.sumInsured().setScale(2, RoundingMode.HALF_UP);
        BigDecimal premium = premiumCalculator.calculate(type, selected, sumInsured);

        LocalDate start = LocalDate.now();
        String addons = selected.isEmpty()
                ? null
                : selected.stream().map(AddOnOption::name).collect(Collectors.joining(", "));

        // Temporary unique number; replaced with P001, P002... once the id is known.
        Policy policy = policyRepository.saveAndFlush(Policy.builder()
                .policyNumber(UUID.randomUUID().toString().substring(0, 20))
                .customer(customer)
                .policyType(type.getLabel())
                .addons(addons)
                .sumInsured(sumInsured)
                .premium(premium)
                .startDate(start)
                .endDate(start.plusYears(1))
                .status(PolicyStatus.PENDING_APPROVAL)
                .build());
        policy.setPolicyNumber(String.format("P%03d", policy.getPolicyId()));

        return PolicyResponse.from(policy);
    }

    // ------------------------------------------------------------------ admin side

    @Transactional(readOnly = true)
    public List<AdminPolicyResponse> getAllPolicies() {
        Map<Long, Long> claimCounts = claimCountsByPolicy();
        return policyRepository.findAllWithCustomer().stream()
                .map(p -> AdminPolicyResponse.from(p, claimCounts.getOrDefault(p.getPolicyId(), 0L)))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminPolicyResponse> getPoliciesByCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new NotFoundException("Customer not found");
        }
        Map<Long, Long> claimCounts = claimCountsByPolicy();
        return policyRepository.findByCustomerIdWithCustomer(customerId).stream()
                .map(p -> AdminPolicyResponse.from(p, claimCounts.getOrDefault(p.getPolicyId(), 0L)))
                .toList();
    }

    /** The only allowed change: PENDING_APPROVAL -> ACTIVE. Creates the proportional allocations. */
    @Transactional
    public AdminPolicyResponse updateStatus(Long policyId, PolicyStatus target) {
        Policy policy = policyRepository.findByIdForUpdate(policyId)
                .orElseThrow(() -> new NotFoundException("Policy not found"));

        if (policy.getStatus() != PolicyStatus.PENDING_APPROVAL || target != PolicyStatus.ACTIVE) {
            throw new BadRequestException("Only a pending policy can be changed to Active");
        }

        policy.setStatus(PolicyStatus.ACTIVE);
        policy.setApprovedAt(LocalDateTime.now());
        eventPublisher.publishEvent(new PolicyApprovedEvent(policy));

        return AdminPolicyResponse.from(policy, claimRepository.countByPolicy_PolicyId(policyId));
    }

    // ------------------------------------------------------------------ helpers

    private Map<Long, Long> claimCountsByPolicy() {
        return claimRepository.countGroupedByPolicy().stream()
                .collect(Collectors.toMap(IdCount::getId, IdCount::getTotal));
    }

    private Customer findCustomer(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Customer not found"));
    }

    private List<AddOnOption> resolveAddOns(PolicyType type, List<String> names) {
        if (names == null) {
            return List.of();
        }
        Set<String> unique = new LinkedHashSet<>();
        for (String name : names) {
            if (name != null) {
                unique.add(name.trim());
            }
        }
        List<AddOnOption> result = new ArrayList<>();
        for (String name : unique) {
            result.add(type.findAddOn(name)
                    .orElseThrow(() -> new BadRequestException("Invalid add-on: " + name)));
        }
        return result;
    }
}