package com.insurance.insurance_management_system.policy.controller;

import com.insurance.insurance_management_system.claim.dto.AdminClaimResponse;
import com.insurance.insurance_management_system.claim.service.AdminClaimService;
import com.insurance.insurance_management_system.common.response.ApiResponse;
import com.insurance.insurance_management_system.policy.dto.AdminPolicyResponse;
import com.insurance.insurance_management_system.policy.dto.UpdatePolicyStatusRequest;
import com.insurance.insurance_management_system.policy.service.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/policies")
@RequiredArgsConstructor
public class AdminPolicyController {

    private final PolicyService policyService;
    private final AdminClaimService adminClaimService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminPolicyResponse>>> getAllPolicies() {
        return ResponseEntity.ok(ApiResponse.ok("Policies fetched", policyService.getAllPolicies()));
    }

    @GetMapping("/{id}/claims")
    public ResponseEntity<ApiResponse<List<AdminClaimResponse>>> getClaims(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok("Claims fetched", adminClaimService.getClaimsByPolicy(id)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminPolicyResponse>> updateStatus(
            @PathVariable Long id, @Valid @RequestBody UpdatePolicyStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Policy status updated", policyService.updateStatus(id, request.status())));
    }
}