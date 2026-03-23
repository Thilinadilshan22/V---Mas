package net.javaguids.ems_backend.mapper;

import net.javaguids.ems_backend.dto.VehicleDto;
import net.javaguids.ems_backend.entity.Vehicle;

public class VehicleMapper {

    public static VehicleDto mapToVehicleDto(Vehicle vehicle) {
        return new VehicleDto(
                vehicle.getId(),
                vehicle.getVehicleName(),
                vehicle.getRegistrationNo(),
                vehicle.getManufacturer(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getCurrentMileageKm(),
                vehicle.getCreatedAt()
        );
    }

    public static Vehicle mapToVehicle(VehicleDto dto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleName(dto.getVehicleName());
        vehicle.setRegistrationNo(dto.getRegistrationNo());
        vehicle.setManufacturer(dto.getManufacturer());
        vehicle.setModel(dto.getModel());
        vehicle.setYear(dto.getYear());
        vehicle.setCurrentMileageKm(dto.getCurrentMileageKm());
        return vehicle;
    }
}
