package com.insurance.insurance_management_system.common.config;

import com.insurance.insurance_management_system.common.enums.Role;
import com.insurance.insurance_management_system.customer.entity.Customer;
import com.insurance.insurance_management_system.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            return;
        }
        if (customerRepository.existsByEmail(adminEmail)) {
            return;
        }
        customerRepository.save(Customer.builder()
                .name("Administrator")
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build());
    }
}