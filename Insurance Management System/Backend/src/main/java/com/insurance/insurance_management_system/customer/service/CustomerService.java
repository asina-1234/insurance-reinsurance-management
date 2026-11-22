package com.insurance.insurance_management_system.customer.service;

import com.insurance.insurance_management_system.common.exception.NotFoundException;
import com.insurance.insurance_management_system.customer.dto.ProfileResponse;
import com.insurance.insurance_management_system.customer.entity.Customer;
import com.insurance.insurance_management_system.customer.repository.CustomerRepository;
import com.insurance.insurance_management_system.policy.dto.PolicyResponse;
import com.insurance.insurance_management_system.policy.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        List<PolicyResponse> policies = policyRepository
                .findByCustomer_CustomerIdOrderByCreatedAtDesc(customer.getCustomerId())
                .stream()
                .map(PolicyResponse::from)
                .toList();

        return new ProfileResponse(
                customer.getCustomerId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress(),
                policies);
    }
}