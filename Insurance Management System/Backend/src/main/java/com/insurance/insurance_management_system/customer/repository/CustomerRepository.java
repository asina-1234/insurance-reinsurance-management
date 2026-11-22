package com.insurance.insurance_management_system.customer.repository;

import com.insurance.insurance_management_system.common.enums.Role;
import com.insurance.insurance_management_system.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Customer> findByRoleOrderByCustomerIdAsc(Role role);
}