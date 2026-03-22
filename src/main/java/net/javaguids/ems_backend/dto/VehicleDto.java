package net.javaguids.ems_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.javaguids.ems_backend.entity.Vehicle;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {

    private Long id;
    private String numberPlate;
    private String chassisNumber;
    private String make;
    private String model;
    private int year;
    private int initialMileage;

}
