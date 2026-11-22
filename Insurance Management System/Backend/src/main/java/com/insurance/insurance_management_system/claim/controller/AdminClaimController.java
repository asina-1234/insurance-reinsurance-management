package com.insurance.insurance_management_system.claim.controller;

import com.insurance.insurance_management_system.claim.dto.AdminClaimResponse;
import com.insurance.insurance_management_system.claim.dto.UpdateClaimStatusRequest;
import com.insurance.insurance_management_system.claim.service.AdminClaimService;
import com.insurance.insurance_management_system.common.response.ApiResponse;
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
@RequestMapping("/api/admin/claims")
@RequiredArgsConstructor
public class AdminClaimController {

    private final AdminClaimService adminClaimService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminClaimResponse>>> getAllClaims() {
        return ResponseEntity.ok(ApiResponse.ok("Claims fetched", adminClaimService.getAllClaims()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AdminClaimResponse>> updateStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateClaimStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(
                "Claim status updated", adminClaimService.updateStatus(id, request.status())));
    }
}