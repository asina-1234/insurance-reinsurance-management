package com.insurance.insurance_management_system.reinsurance.nonproportional.controller;

import com.insurance.insurance_management_system.common.response.ApiResponse;
import com.insurance.insurance_management_system.reinsurance.nonproportional.dto.NonProportionalTreatyResponse;
import com.insurance.insurance_management_system.reinsurance.nonproportional.service.NonProportionalAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/non-proportional-treaty")
@RequiredArgsConstructor
public class AdminNonProportionalTreatyController {

    private final NonProportionalAllocationService service;

    @GetMapping
    public ResponseEntity<ApiResponse<NonProportionalTreatyResponse>> getTreaty() {
        return ResponseEntity.ok(
                ApiResponse.ok("Non-proportional treaty fetched", service.getTreatyView()));
    }
}