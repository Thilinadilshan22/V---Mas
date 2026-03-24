package net.javaguids.ems_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FuelLogDto {
    private Long id;
    private String vehicleRegNumber;
    private String fuelType;
    private Double liters;
    private Double costPerLiter;
    private Double totalCost;
    private Double mileage;
    private LocalDate date;
}
