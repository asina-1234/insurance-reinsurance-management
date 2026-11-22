package com.insurance.insurance_management_system.dashboard.controller;

import com.insurance.insurance_management_system.common.response.ApiResponse;
import com.insurance.insurance_management_system.dashboard.dto.DashboardResponse;
import com.insurance.insurance_management_system.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok("Dashboard fetched", dashboardService.getDashboard()));
    }
}