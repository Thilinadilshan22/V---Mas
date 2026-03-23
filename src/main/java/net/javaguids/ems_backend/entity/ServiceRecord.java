package net.javaguids.ems_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import net.javaguids.ems_backend.enums.ServiceType;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "service_records")
public class ServiceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false, length = 100)
    private ServiceType serviceType;

    /**
     * Only required when serviceType == OTHER.
     * The frontend should show a text input when "Other" is selected.
     */
    @Column(name = "service_type_detail", length = 255)
    private String serviceTypeDetail;

    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate;

    @Column(name = "current_mileage_km", nullable = false)
    private Integer currentMileageKm;

    @Column(name = "service_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal serviceCost;

    @Column(name = "technician_workshop", nullable = false, length = 200)
    private String technicianWorkshop;

    /** Optional — next scheduled service date */
    @Column(name = "next_service_due")
    private LocalDate nextServiceDue;

    /** Optional — additional notes */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
