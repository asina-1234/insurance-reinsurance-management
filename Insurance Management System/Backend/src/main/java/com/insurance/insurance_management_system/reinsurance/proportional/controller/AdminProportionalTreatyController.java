package com.insurance.insurance_management_system.reinsurance.proportional.controller;

import com.insurance.insurance_management_system.common.response.ApiResponse;
import com.insurance.insurance_management_system.reinsurance.proportional.dto.ProportionalTreatyResponse;
import com.insurance.insurance_management_system.reinsurance.proportional.service.ProportionalAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/proportional-treaty")
@RequiredArgsConstructor
public class AdminProportionalTreatyController {

    private final ProportionalAllocationService service;

    @GetMapping
    public ResponseEntity<ApiResponse<ProportionalTreatyResponse>> getTreaty() {
        return ResponseEntity.ok(ApiResponse.ok("Proportional treaty fetched", service.getTreatyView()));
    }
}