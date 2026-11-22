package com.insurance.insurance_management_system.auth.service;

import com.insurance.insurance_management_system.auth.dto.AuthResponse;
import com.insurance.insurance_management_system.auth.dto.LoginRequest;
import com.insurance.insurance_management_system.auth.dto.RegisterRequest;
import com.insurance.insurance_management_system.auth.security.JwtUtil;
import com.insurance.insurance_management_system.common.enums.Role;
import com.insurance.insurance_management_system.common.exception.ConflictException;
import com.insurance.insurance_management_system.customer.entity.Customer;
import com.insurance.insurance_management_system.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public void register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (customerRepository.existsByEmail(email)) {
            throw new ConflictException("Email already registered");
        }
        customerRepository.save(Customer.builder()
                .name(req.name().trim())
                .email(email)
                .password(passwordEncoder.encode(req.password()))
                .role(Role.USER)
                .phone(req.phone())
                .address(req.address().trim())
                .build());
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        Customer customer = customerRepository
                .findByEmail(req.email().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!passwordEncoder.matches(req.password(), customer.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        return new AuthResponse(
                jwtUtil.generateToken(customer.getEmail(), customer.getRole()),
                customer.getRole(),
                customer.getName(),
                customer.getEmail());
    }
}