package net.javaguids.ems_backend.dto;

import lombok.*;
import net.javaguids.ems_backend.enums.ServiceType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRecordDto {

    private Long id;

    // Vehicle info
    private Long vehicleId;
    private String vehicleName;   // populated on fetch for display purposes

    private ServiceType serviceType;

    /**
     * Required by the frontend when serviceType == OTHER.
     * Backend validates: if serviceType is OTHER, this must not be blank.
     */
    private String serviceTypeDetail;

    private LocalDate serviceDate;
    private Integer currentMileageKm;
    private BigDecimal serviceCost;
    private String technicianWorkshop;

    private LocalDate nextServiceDue;   // optional
    private String description;         // optional

    private LocalDateTime createdAt;
}
