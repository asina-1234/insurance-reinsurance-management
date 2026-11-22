package com.insurance.insurance_management_system.customer.controller;

import com.insurance.insurance_management_system.claim.dto.AdminClaimResponse;
import com.insurance.insurance_management_system.claim.service.AdminClaimService;
import com.insurance.insurance_management_system.common.response.ApiResponse;
import com.insurance.insurance_management_system.customer.dto.AdminCustomerResponse;
import com.insurance.insurance_management_system.customer.service.AdminCustomerService;
import com.insurance.insurance_management_system.policy.dto.AdminPolicyResponse;
import com.insurance.insurance_management_system.policy.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;
    private final PolicyService policyService;
    private final AdminClaimService adminClaimService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminCustomerResponse>>> getAllCustomers() {
        return ResponseEntity.ok(
                ApiResponse.ok("Customers fetched", adminCustomerService.getAllCustomers()));
    }

    @GetMapping("/{id}/policies")
    public ResponseEntity<ApiResponse<List<AdminPolicyResponse>>> getPolicies(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok("Policies fetched", policyService.getPoliciesByCustomer(id)));
    }

    @GetMapping("/{id}/claims")
    public ResponseEntity<ApiResponse<List<AdminClaimResponse>>> getClaims(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.ok("Claims fetched", adminClaimService.getClaimsByCustomer(id)));
    }
}