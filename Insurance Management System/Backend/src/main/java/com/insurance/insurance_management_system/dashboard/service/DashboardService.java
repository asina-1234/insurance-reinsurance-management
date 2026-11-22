package com.insurance.insurance_management_system.dashboard.service;

import com.insurance.insurance_management_system.common.enums.AllocationType;
import com.insurance.insurance_management_system.common.enums.ClaimStatus;
import com.insurance.insurance_management_system.dashboard.dto.DashboardResponse;
import com.insurance.insurance_management_system.dashboard.dto.DashboardResponse.ClaimStatusTotal;
import com.insurance.insurance_management_system.dashboard.dto.DashboardResponse.MonthlyCount;
import com.insurance.insurance_management_system.dashboard.dto.DashboardResponse.PolicyTypeTotal;
import com.insurance.insurance_management_system.dashboard.dto.DashboardResponse.ProportionalShare;
import com.insurance.insurance_management_system.dashboard.repository.DashboardRepository;
import com.insurance.insurance_management_system.policy.catalog.PolicyType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    /** How many months the customer chart shows, ending with the current month. */
    private static final int MONTHS = 6;
    private static final DateTimeFormatter MONTH_LABEL =
            DateTimeFormatter.ofPattern("MMM yyyy", Locale.ENGLISH);

    private final DashboardRepository repository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        return new DashboardResponse(
                customersPerMonth(), policyByType(), claimsByStatus(), proportionalShare());
    }

    private List<MonthlyCount> customersPerMonth() {
        Map<YearMonth, Long> counts = repository.findCustomerRegistrationDates().stream()
                .collect(Collectors.groupingBy(YearMonth::from, Collectors.counting()));

        YearMonth current = YearMonth.now();
        List<MonthlyCount> result = new ArrayList<>();
        for (int i = MONTHS - 1; i >= 0; i--) {
            YearMonth month = current.minusMonths(i);
            result.add(new MonthlyCount(
                    month.toString(), month.format(MONTH_LABEL), counts.getOrDefault(month, 0L)));
        }
        return result;
    }

    private List<PolicyTypeTotal> policyByType() {
        Map<String, Object[]> rows = repository.sumByPolicyType().stream()
                .collect(Collectors.toMap(r -> (String) r[0], r -> r));

        return Arrays.stream(PolicyType.values())
                .map(type -> {
                    Object[] r = rows.get(type.getLabel());
                    return new PolicyTypeTotal(
                            type.getLabel(),
                            r == null ? BigDecimal.ZERO : (BigDecimal) r[1],
                            r == null ? BigDecimal.ZERO : (BigDecimal) r[2]);
                })
                .toList();
    }

    private List<ClaimStatusTotal> claimsByStatus() {
        Map<ClaimStatus, Object[]> rows = repository.sumByClaimStatus().stream()
                .collect(Collectors.toMap(r -> (ClaimStatus) r[0], r -> r));

        return Arrays.stream(ClaimStatus.values())
                .map(status -> {
                    Object[] r = rows.get(status);
                    return new ClaimStatusTotal(
                            status,
                            r == null ? 0L : (Long) r[1],
                            r == null ? BigDecimal.ZERO : (BigDecimal) r[2]);
                })
                .toList();
    }

    private List<ProportionalShare> proportionalShare() {
        Map<AllocationType, Object[]> rows = repository.sumByAllocationType().stream()
                .collect(Collectors.toMap(r -> (AllocationType) r[0], r -> r));

        return Arrays.stream(AllocationType.values())
                .map(type -> {
                    Object[] r = rows.get(type);
                    return new ProportionalShare(
                            type,
                            r == null ? BigDecimal.ZERO : (BigDecimal) r[2],
                            r == null ? BigDecimal.ZERO : (BigDecimal) r[3],
                            r == null ? BigDecimal.ZERO : (BigDecimal) r[4]);
                })
                .toList();
    }
}