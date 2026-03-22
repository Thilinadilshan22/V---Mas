package net.javaguids.ems_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FuelSummaryDto {
    private Double totalDiesel;
    private Double totalPetrol;
    private Double totalVolume;
    private Double totalCost;
}
