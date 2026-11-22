package com.insurance.insurance_management_system.claim.controller;

import com.insurance.insurance_management_system.claim.dto.ClaimLimitResponse;
import com.insurance.insurance_management_system.claim.dto.ClaimResponse;
import com.insurance.insurance_management_system.claim.dto.CreateClaimRequest;
import com.insurance.insurance_management_system.claim.service.ClaimService;
import com.insurance.insurance_management_system.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class ClaimController {

    private final ClaimService claimService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getMyClaims(
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Claims fetched", claimService.getMyClaims(authentication.getName())));
    }

    @GetMapping("/policies/{policyId}/limit")
    public ResponseEntity<ApiResponse<ClaimLimitResponse>> getLimit(
            Authentication authentication, @PathVariable Long policyId) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Claim limit fetched", claimService.getLimit(authentication.getName(), policyId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimResponse>> raiseClaim(
            Authentication authentication, @Valid @RequestBody CreateClaimRequest request) {
        ClaimResponse created = claimService.raiseClaim(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Claim submitted successfully", created));
    }
}