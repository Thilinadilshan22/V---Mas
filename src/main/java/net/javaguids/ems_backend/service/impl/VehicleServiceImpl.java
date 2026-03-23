package net.javaguids.ems_backend.service.impl;

import lombok.AllArgsConstructor;
import net.javaguids.ems_backend.dto.VehicleDto;
import net.javaguids.ems_backend.entity.Vehicle;
import net.javaguids.ems_backend.exception.ResourceNotFoundException;
import net.javaguids.ems_backend.mapper.VehicleMapper;
import net.javaguids.ems_backend.repository.VehicleRepository;
import net.javaguids.ems_backend.service.VehicleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    public VehicleDto createVehicle(VehicleDto vehicleDto) {
        if (vehicleRepository.existsByRegistrationNo(vehicleDto.getRegistrationNo())) {
            throw new RuntimeException("Vehicle with registration number '"
                    + vehicleDto.getRegistrationNo() + "' already exists.");
        }
        Vehicle vehicle = VehicleMapper.mapToVehicle(vehicleDto);
        Vehicle saved = vehicleRepository.save(vehicle);
        return VehicleMapper.mapToVehicleDto(saved);
    }

    @Override
    public VehicleDto getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        return VehicleMapper.mapToVehicleDto(vehicle);
    }

    @Override
    public List<VehicleDto> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(VehicleMapper::mapToVehicleDto)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleDto updateVehicle(Long id, VehicleDto vehicleDto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        // Check if registration number is being changed to one that already exists
        if (!vehicle.getRegistrationNo().equals(vehicleDto.getRegistrationNo())
                && vehicleRepository.existsByRegistrationNo(vehicleDto.getRegistrationNo())) {
            throw new RuntimeException("Vehicle with registration number '"
                    + vehicleDto.getRegistrationNo() + "' already exists.");
        }

        vehicle.setVehicleName(vehicleDto.getVehicleName());
        vehicle.setRegistrationNo(vehicleDto.getRegistrationNo());
        vehicle.setManufacturer(vehicleDto.getManufacturer());
        vehicle.setModel(vehicleDto.getModel());
        vehicle.setYear(vehicleDto.getYear());
        vehicle.setCurrentMileageKm(vehicleDto.getCurrentMileageKm());

        Vehicle updated = vehicleRepository.save(vehicle);
        return VehicleMapper.mapToVehicleDto(updated);
    }

    @Override
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        vehicleRepository.delete(vehicle);
    }
}
