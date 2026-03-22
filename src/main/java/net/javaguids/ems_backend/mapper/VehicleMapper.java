package net.javaguids.ems_backend.mapper;

import net.javaguids.ems_backend.dto.VehicleDto;
import net.javaguids.ems_backend.entity.Vehicle;
import net.javaguids.ems_backend.service.VehicleService;

public class VehicleMapper {
    public static VehicleDto mapToDto(Vehicle vehicle) {
        return new VehicleDto(vehicle.getId(), vehicle.getNumberPlate(), vehicle.getChassisNumber(), vehicle.getMake(), vehicle.getModel(), vehicle.getYear(), vehicle.getInitialMileage());
    }

    public static Vehicle mapToEntity(VehicleDto vehicle) {
        return new Vehicle(vehicle.getId(), vehicle.getNumberPlate(), vehicle.getChassisNumber(), vehicle.getMake(), vehicle.getModel(), vehicle.getYear(), vehicle.getInitialMileage());
    }
}
