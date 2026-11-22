package com.insurance.insurance_management_system.claim.service;

import com.insurance.insurance_management_system.claim.dto.AdminClaimResponse;
import com.insurance.insurance_management_system.claim.entity.Claim;
import com.insurance.insurance_management_system.claim.event.ClaimApprovedEvent;
import com.insurance.insurance_management_system.claim.repository.ClaimRepository;
import com.insurance.insurance_management_system.common.enums.ClaimStatus;
import com.insurance.insurance_management_system.common.exception.BadRequestException;
import com.insurance.insurance_management_system.common.exception.NotFoundException;
import com.insurance.insurance_management_system.customer.repository.CustomerRepository;
import com.insurance.insurance_management_system.policy.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminClaimService {

    private final ClaimRepository claimRepository;
    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public List<AdminClaimResponse> getAllClaims() {
        return claimRepository.findAllWithDetails().stream()
                .map(AdminClaimResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminClaimResponse> getClaimsByCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new NotFoundException("Customer not found");
        }
        return claimRepository.findByCustomerIdWithDetails(customerId).stream()
                .map(AdminClaimResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminClaimResponse> getClaimsByPolicy(Long policyId) {
        if (!policyRepository.existsById(policyId)) {
            throw new NotFoundException("Policy not found");
        }
        return claimRepository.findByPolicyIdWithDetails(policyId).stream()
                .map(AdminClaimResponse::from)
                .toList();
    }

    /** Allowed changes: SUBMITTED -> APPROVED, then APPROVED -> SETTLED. No skipping. */
    @Transactional
    public AdminClaimResponse updateStatus(Long claimId, ClaimStatus target) {
        Claim claim = claimRepository.findByIdForUpdate(claimId)
                .orElseThrow(() -> new NotFoundException("Claim not found"));
        ClaimStatus current = claim.getStatus();

        if (current == ClaimStatus.SUBMITTED && target == ClaimStatus.APPROVED) {
            claim.setApprovedAmount(claim.getClaimAmount());
            claim.setStatus(ClaimStatus.APPROVED);
            claim.setApprovedAt(LocalDateTime.now());
            eventPublisher.publishEvent(new ClaimApprovedEvent(claim));
        } else if (current == ClaimStatus.APPROVED && target == ClaimStatus.SETTLED) {
            claim.setStatus(ClaimStatus.SETTLED);
        } else {
            throw new BadRequestException(
                    "Invalid status change. A claim moves from Submitted to Approved to Settled.");
        }
        return AdminClaimResponse.from(claim);
    }
}