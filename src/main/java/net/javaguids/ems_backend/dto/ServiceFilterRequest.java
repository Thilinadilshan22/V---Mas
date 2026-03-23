package net.javaguids.ems_backend.dto;

import lombok.*;
import net.javaguids.ems_backend.enums.ServiceType;

import java.time.LocalDate;

/**
 * Request DTO used for filtering service records.
 * All fields are optional — only non-null fields are applied as filters.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceFilterRequest {

    private Long vehicleId;
    private ServiceType serviceType;
    private LocalDate fromDate;
    private LocalDate toDate;
}
