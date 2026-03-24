package net.javaguids.ems_backend.service;

import net.javaguids.ems_backend.dto.VehicleDto;

import java.util.List;

public interface VehicleService {

    VehicleDto createVehicle(VehicleDto vehicleDto);

    VehicleDto getVehicleById(Long id);

    List<VehicleDto> getAllVehicles();

    VehicleDto updateVehicle(Long id, VehicleDto vehicleDto);

    void deleteVehicle(Long id);
}
