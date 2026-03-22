package net.javaguids.ems_backend.service.impl;

import net.javaguids.ems_backend.dto.VehicleDto;
import net.javaguids.ems_backend.mapper.VehicleMapper;
import net.javaguids.ems_backend.repository.VehicleRepository;
import net.javaguids.ems_backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Override
    public VehicleDto registerVehicle(VehicleDto vehicle) {
        return VehicleMapper.mapToDto(vehicleRepository.save(VehicleMapper.mapToEntity(vehicle)));
    }
}
