package net.javaguids.ems_backend.service;

import net.javaguids.ems_backend.dto.*;

import java.util.List;

public interface FuelService {
    
    FuelLogDto addFuelLog(FuelLogDto fuelLogDto);
    
    FuelSummaryDto getCurrentMonthSummary();
    
    FuelChartDto getMonthlyChartData();
    
    List<VehicleFuelStatsDto> getAllVehicleStats();
    
    FuelLogDto getFuelLogById(Long id);
    
    List<FuelLogDto> getFuelLogsByVehicle(String vehicleRegNumber);
}
