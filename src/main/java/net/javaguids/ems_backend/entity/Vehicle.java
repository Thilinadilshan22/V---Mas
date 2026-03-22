package net.javaguids.ems_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.javaguids.ems_backend.dto.VehicleDto;

@Getter
@Setter
@Entity
@Table(name = "vehicles")
@AllArgsConstructor
@NoArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String numberPlate;

    @Column
    String chassisNumber;

    @Column
    String make;

    @Column
    String model;

    @Column
    int year;

    @Column
    int initialMileage;

}
