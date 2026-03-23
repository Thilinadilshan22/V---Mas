package net.javaguids.ems_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRecordStatsDto {
    private Long totalServiceRecords;
    private BigDecimal totalServiceCost;
    private Map<String, Long> servicesByType;
}
