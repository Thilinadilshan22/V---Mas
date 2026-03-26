package net.javaguids.ems_backend.service;

import net.javaguids.ems_backend.dto.*;

import java.util.List;

public interface FuelService {

    /** Add a new fuel log for the authenticated driver */
    FuelLogDto addFuelLog(FuelLogDto fuelLogDto, String driverUsername);

    /** Get driver's own fuel log history (newest first) */
    List<FuelLogDto> getMyFuelLogs(String driverUsername);

    /** Get a single fuel log — only if it belongs to this driver */
    FuelLogDto getMyFuelLogById(Long id, String driverUsername);

    /** Update a fuel log — only if it belongs to this driver */
    FuelLogDto updateMyFuelLog(Long id, FuelLogDto fuelLogDto, String driverUsername);

    // ---- Admin / shared analytics (unchanged) ----

    FuelSummaryDto getCurrentMonthSummary();

    FuelChartDto getMonthlyChartData();

    List<VehicleFuelStatsDto> getAllVehicleStats();

    FuelLogDto getFuelLogById(Long id);

    List<FuelLogDto> getFuelLogsByVehicle(String vehicleRegNumber);
}
