package com.insurance.insurance_management_system.common.dto;

/** Projection for "count per id" queries. */
public interface IdCount {

    Long getId();

    Long getTotal();
}