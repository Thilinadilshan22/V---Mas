package net.javaguids.ems_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {

    private Long id;
    private String vehicleName;
    private String registrationNo;
    private String manufacturer;
    private String model;
    private Integer year;
    private Integer currentMileageKm;
    private LocalDateTime createdAt;
}
