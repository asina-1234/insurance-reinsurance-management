package com.insurance.insurance_management_system.auth.dto;

import com.insurance.insurance_management_system.common.enums.Role;

public record AuthResponse(String token, Role role, String name, String email) {
}