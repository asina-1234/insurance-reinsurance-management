package com.insurance.insurance_management_system.policy.controller;

import com.insurance.insurance_management_system.common.response.ApiResponse;
import com.insurance.insurance_management_system.policy.dto.CreatePolicyRequest;
import com.insurance.insurance_management_system.policy.dto.PolicyResponse;
import com.insurance.insurance_management_system.policy.dto.PolicyTypeResponse;
import com.insurance.insurance_management_system.policy.service.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class PolicyController {

    private final PolicyService policyService;

    @GetMapping("/catalog")
    public ResponseEntity<ApiResponse<List<PolicyTypeResponse>>> getCatalog() {
        return ResponseEntity.ok(ApiResponse.ok("Policy catalog", policyService.getCatalog()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PolicyResponse>>> getMyPolicies(
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Policies fetched", policyService.getMyPolicies(authentication.getName())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PolicyResponse>> createPolicy(
            Authentication authentication,
            @Valid @RequestBody CreatePolicyRequest request) {
        PolicyResponse created = policyService.createPolicy(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Policy created and sent for approval", created));
    }
}