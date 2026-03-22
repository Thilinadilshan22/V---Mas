package net.javaguids.ems_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleFuelStatsDto {
    private String vehicleRegNumber;
    private Double fuelEfficiency;
    private Double totalSpending;
    private String efficiencyStatus;
}
