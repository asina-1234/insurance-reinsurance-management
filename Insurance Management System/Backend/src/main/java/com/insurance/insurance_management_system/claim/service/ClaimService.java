package com.insurance.insurance_management_system.claim.service;

import com.insurance.insurance_management_system.claim.dto.ClaimLimitResponse;
import com.insurance.insurance_management_system.claim.dto.ClaimResponse;
import com.insurance.insurance_management_system.claim.dto.CreateClaimRequest;
import com.insurance.insurance_management_system.claim.entity.Claim;
import com.insurance.insurance_management_system.claim.repository.ClaimRepository;
import com.insurance.insurance_management_system.common.enums.ClaimStatus;
import com.insurance.insurance_management_system.common.enums.PolicyStatus;
import com.insurance.insurance_management_system.common.exception.BadRequestException;
import com.insurance.insurance_management_system.common.exception.NotFoundException;
import com.insurance.insurance_management_system.customer.entity.Customer;
import com.insurance.insurance_management_system.customer.repository.CustomerRepository;
import com.insurance.insurance_management_system.policy.entity.Policy;
import com.insurance.insurance_management_system.policy.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private static final DateTimeFormatter DISPLAY_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ClaimRepository claimRepository;
    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public List<ClaimResponse> getMyClaims(String email) {
        Customer customer = findCustomer(email);
        return claimRepository
                .findByCustomer_CustomerIdOrderBySubmittedDateDesc(customer.getCustomerId())
                .stream()
                .map(ClaimResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClaimLimitResponse getLimit(String email, Long policyId) {
        Customer customer = findCustomer(email);
        Policy policy = policyRepository.findById(policyId)
                .filter(p -> isOwner(p, customer))
                .orElseThrow(() -> new NotFoundException("Policy not found"));

        BigDecimal claimed = claimedAmount(policy);
        return new ClaimLimitResponse(
                policy.getPolicyId(),
                policy.getPolicyNumber(),
                policy.getSumInsured(),
                claimed,
                remainingLimit(policy, claimed),
                policy.getStartDate(),
                policy.getEndDate());
    }

    @Transactional
    public ClaimResponse raiseClaim(String email, CreateClaimRequest req) {
        Customer customer = findCustomer(email);
        Policy policy = policyRepository.findByIdForUpdate(req.policyId())
                .filter(p -> isOwner(p, customer))
                .orElseThrow(() -> new NotFoundException("Policy not found"));

        LocalDate today = LocalDate.now();
        if (policy.getStatus() != PolicyStatus.ACTIVE || policy.getEndDate().isBefore(today)) {
            throw new BadRequestException("Claims can be raised on active policies only");
        }

        LocalDate incident = req.incidentDate();
        if (incident.isAfter(today)) {
            throw new BadRequestException("Incident date cannot be in the future");
        }
        if (incident.isBefore(policy.getStartDate()) || incident.isAfter(policy.getEndDate())) {
            throw new BadRequestException("Incident date must be within the policy period ("
                    + policy.getStartDate().format(DISPLAY_DATE) + " to "
                    + policy.getEndDate().format(DISPLAY_DATE) + ")");
        }

        BigDecimal amount = req.claimAmount().setScale(2, RoundingMode.HALF_UP);
        BigDecimal remaining = remainingLimit(policy, claimedAmount(policy));
        if (amount.compareTo(remaining) > 0) {
            throw new BadRequestException(
                    "Claim amount is greater than the available limit. Remaining limit: "
                            + remaining.toPlainString());
        }

        // Temporary unique number; replaced with C001, C002... once the id is known.
        Claim claim = claimRepository.saveAndFlush(Claim.builder()
                .claimNumber(UUID.randomUUID().toString().substring(0, 20))
                .policy(policy)
                .customer(customer)
                .claimAmount(amount)
                .incidentDate(incident)
                .reason(req.reason().trim())
                .status(ClaimStatus.SUBMITTED)
                .build());
        claim.setClaimNumber(String.format("C%03d", claim.getClaimId()));

        return ClaimResponse.from(claim);
    }

    private Customer findCustomer(String email) {
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Customer not found"));
    }

    private boolean isOwner(Policy policy, Customer customer) {
        return policy.getCustomer().getCustomerId().equals(customer.getCustomerId());
    }

    /** Sum of all earlier claims on the policy, except rejected ones. */
    private BigDecimal claimedAmount(Policy policy) {
        BigDecimal total = claimRepository.sumClaimedAmount(policy.getPolicyId());        
        return total == null ? BigDecimal.ZERO : total;
    }

    private BigDecimal remainingLimit(Policy policy, BigDecimal claimed) {
        BigDecimal remaining = policy.getSumInsured().subtract(claimed);
        return remaining.signum() < 0 ? BigDecimal.ZERO : remaining;
    }
}