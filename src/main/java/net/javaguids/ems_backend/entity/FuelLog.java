package net.javaguids.ems_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fuel_logs")
public class FuelLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String vehicleRegNumber;

    @Column(nullable = false)
    private String fuelType;

    @Column(nullable = false)
    private Double liters;

    @Column(nullable = false)
    private Double costPerLiter;

    @Column(nullable = false)
    private Double totalCost;

    @Column(name = "current_mileage", nullable = false)
    private Double mileage;

    @Column(nullable = false)
    private LocalDate date;
}
