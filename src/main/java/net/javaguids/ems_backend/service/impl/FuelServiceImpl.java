package net.javaguids.ems_backend.service.impl;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javaguids.ems_backend.dto.*;
import net.javaguids.ems_backend.entity.FuelLog;
import net.javaguids.ems_backend.entity.Notification;
import net.javaguids.ems_backend.exception.ResourceNotFoundException;
import net.javaguids.ems_backend.repository.FuelLogRepository;
import net.javaguids.ems_backend.repository.NotificationRepository;
import net.javaguids.ems_backend.service.FuelService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class FuelServiceImpl implements FuelService {

    private FuelLogRepository fuelLogRepository;
    private NotificationRepository notificationRepository;

    // ==================== DRIVER-SCOPED METHODS ====================

    @Override
    @Transactional
    public FuelLogDto addFuelLog(FuelLogDto fuelLogDto, String driverUsername) {
        log.info("Driver '{}' adding fuel log for vehicle: {}", driverUsername, fuelLogDto.getVehicleRegNumber());

        // Auto-calculate totalCost if not provided
        if (fuelLogDto.getTotalCost() == null || fuelLogDto.getTotalCost() == 0) {
            double calculatedCost = fuelLogDto.getLiters() * fuelLogDto.getCostPerLiter();
            fuelLogDto.setTotalCost(calculatedCost);
            log.info("Auto-calculated totalCost: {}", calculatedCost);
        }

        // Convert DTO to Entity
        FuelLog fuelLog = new FuelLog();
        fuelLog.setVehicleRegNumber(fuelLogDto.getVehicleRegNumber());
        fuelLog.setFuelType(fuelLogDto.getFuelType());
        fuelLog.setLiters(fuelLogDto.getLiters());
        fuelLog.setCostPerLiter(fuelLogDto.getCostPerLiter());
        fuelLog.setTotalCost(fuelLogDto.getTotalCost());
        fuelLog.setMileage(fuelLogDto.getMileage());
        fuelLog.setDate(fuelLogDto.getDate() != null ? fuelLogDto.getDate() : LocalDate.now());
        fuelLog.setDriverUsername(driverUsername); // ← tie this log to the driver

        // Save the fuel log
        FuelLog savedLog = fuelLogRepository.save(fuelLog);
        log.info("Fuel log saved with ID: {}", savedLog.getId());

        // Calculate efficiency and trigger notification if needed
        checkAndTriggerLowEfficiencyNotification(savedLog, driverUsername);

        return mapToDto(savedLog);
    }

    @Override
    public List<FuelLogDto> getMyFuelLogs(String driverUsername) {
        log.info("Driver '{}' fetching their own fuel logs", driverUsername);
        return fuelLogRepository.findByDriverUsernameOrLegacy(driverUsername)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public FuelLogDto getMyFuelLogById(Long id, String driverUsername) {
        log.info("Driver '{}' fetching fuel log id: {}", driverUsername, id);
        FuelLog fuelLog = fuelLogRepository.findByIdAndDriverUsernameOrLegacy(id, driverUsername)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Fuel log not found with id: " + id + " for driver: " + driverUsername));
        return mapToDto(fuelLog);
    }

    @Override
    @Transactional
    public FuelLogDto updateMyFuelLog(Long id, FuelLogDto fuelLogDto, String driverUsername) {
        log.info("Driver '{}' updating fuel log id: {}", driverUsername, id);

        FuelLog fuelLog = fuelLogRepository.findByIdAndDriverUsernameOrLegacy(id, driverUsername)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Fuel log not found with id: " + id + " for driver: " + driverUsername));

        // Update fields
        fuelLog.setVehicleRegNumber(fuelLogDto.getVehicleRegNumber());
        fuelLog.setFuelType(fuelLogDto.getFuelType());
        fuelLog.setLiters(fuelLogDto.getLiters());
        fuelLog.setCostPerLiter(fuelLogDto.getCostPerLiter());

        // Recalculate totalCost
        double totalCost = (fuelLogDto.getTotalCost() != null && fuelLogDto.getTotalCost() != 0)
                ? fuelLogDto.getTotalCost()
                : fuelLogDto.getLiters() * fuelLogDto.getCostPerLiter();
        fuelLog.setTotalCost(totalCost);
        fuelLog.setMileage(fuelLogDto.getMileage());
        if (fuelLogDto.getDate() != null) {
            fuelLog.setDate(fuelLogDto.getDate());
        }

        FuelLog updated = fuelLogRepository.save(fuelLog);
        log.info("Fuel log {} updated by driver '{}'", id, driverUsername);
        return mapToDto(updated);
    }

    // ==================== ADMIN / SHARED ANALYTICS ====================

    @Override
    public FuelSummaryDto getCurrentMonthSummary() {
        log.info("Fetching current month summary");
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        Double totalDiesel = fuelLogRepository.getTotalLitersByFuelType("Diesel", month, year);
        Double totalPetrol = fuelLogRepository.getTotalLitersByFuelType("Petrol", month, year);
        Double totalCost = fuelLogRepository.getTotalCostForMonth(month, year);
        Double totalVolume = totalDiesel + totalPetrol;

        log.info("Summary - Diesel: {}, Petrol: {}, Total: {}, Cost: {}",
                 totalDiesel, totalPetrol, totalVolume, totalCost);

        return new FuelSummaryDto(totalDiesel, totalPetrol, totalVolume, totalCost);
    }

    @Override
    public FuelChartDto getMonthlyChartData() {
        log.info("Fetching monthly chart data");
        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();

        List<Object[]> results = fuelLogRepository.getMonthlyConsumptionByFuelType(currentYear);

        // Initialize data structures
        List<String> months = new ArrayList<>();
        Map<String, List<Double>> data = new HashMap<>();
        data.put("Diesel", new ArrayList<>(Collections.nCopies(12, 0.0)));
        data.put("Petrol", new ArrayList<>(Collections.nCopies(12, 0.0)));

        // Generate month labels
        for (int i = 1; i <= 12; i++) {
            months.add(Month.of(i).name().substring(0, 3));
        }

        // Populate data from query results
        for (Object[] result : results) {
            Integer monthNum = (Integer) result[0];
            String fuelType = (String) result[1];
            Double totalLiters = ((Number) result[2]).doubleValue();

            if (data.containsKey(fuelType)) {
                data.get(fuelType).set(monthNum - 1, totalLiters);
            }
        }

        log.info("Chart data prepared for {} months", months.size());
        return new FuelChartDto(months, data);
    }

    @Override
    public List<VehicleFuelStatsDto> getAllVehicleStats() {
        log.info("Fetching all vehicle statistics");
        List<String> allVehicles = fuelLogRepository.findAllDistinctVehicleRegNumbers();
        List<VehicleFuelStatsDto> statsList = new ArrayList<>();

        for (String vehicleRegNumber : allVehicles) {
            List<FuelLog> logs = fuelLogRepository.findByVehicleRegNumberOrderByDateDesc(vehicleRegNumber);

            if (logs.isEmpty()) {
                continue;
            }

            Double fuelEfficiency = calculateFuelEfficiency(logs);
            Double totalSpending = fuelLogRepository.getTotalSpendingByVehicle(vehicleRegNumber);
            String efficiencyStatus = determineEfficiencyStatus(fuelEfficiency);

            VehicleFuelStatsDto stats = new VehicleFuelStatsDto(
                vehicleRegNumber,
                fuelEfficiency,
                totalSpending,
                efficiencyStatus
            );

            statsList.add(stats);
            log.info("Stats for vehicle {}: Efficiency={}, Spending={}, Status={}",
                     vehicleRegNumber, fuelEfficiency, totalSpending, efficiencyStatus);
        }

        return statsList;
    }

    @Override
    public FuelLogDto getFuelLogById(Long id) {
        log.info("Fetching fuel log by ID: {}", id);
        FuelLog fuelLog = fuelLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FuelLog not found with id: " + id));
        return mapToDto(fuelLog);
    }

    @Override
    public List<FuelLogDto> getFuelLogsByVehicle(String vehicleRegNumber) {
        log.info("Fetching fuel logs for vehicle: {}", vehicleRegNumber);
        List<FuelLog> logs = fuelLogRepository.findByVehicleRegNumberOrderByDateDesc(vehicleRegNumber);
        return logs.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Calculate fuel efficiency (km/L) for a vehicle
     * Formula: (Current Mileage - Previous Mileage) / Liters
     */
    private Double calculateFuelEfficiency(List<FuelLog> logs) {
        if (logs.size() < 2) {
            log.info("Insufficient data for efficiency calculation (only {} log(s))", logs.size());
            return null;
        }

        FuelLog currentLog = logs.get(0);
        FuelLog previousLog = logs.get(1);

        double mileageDifference = currentLog.getMileage() - previousLog.getMileage();
        double litersConsumed = currentLog.getLiters();

        if (litersConsumed <= 0) {
            log.warn("Invalid liters consumed: {}", litersConsumed);
            return null;
        }

        double efficiency = mileageDifference / litersConsumed;
        log.info("Calculated efficiency: {} km/L", efficiency);
        return Math.round(efficiency * 100.0) / 100.0;
    }

    /**
     * Determine efficiency status based on km/L value
     */
    private String determineEfficiencyStatus(Double efficiency) {
        if (efficiency == null) {
            return "Insufficient Data";
        } else if (efficiency < 5.0) {
            return "Low Efficiency";
        } else if (efficiency >= 5.0 && efficiency < 10.0) {
            return "Moderate";
        } else {
            return "Good";
        }
    }

    /**
     * Check efficiency and trigger notification if below threshold
     * Scoped to driver's own previous log for accuracy
     */
    private void checkAndTriggerLowEfficiencyNotification(FuelLog currentLog, String driverUsername) {
        log.info("Checking efficiency for notification trigger");

        List<FuelLog> previousLogs = fuelLogRepository.findPreviousLogByDriver(
            driverUsername,
            currentLog.getVehicleRegNumber(),
            currentLog.getDate()
        );

        if (previousLogs.isEmpty()) {
            log.info("No previous log found for efficiency calculation");
            return;
        }

        FuelLog previousLog = previousLogs.get(0);
        double mileageDifference = currentLog.getMileage() - previousLog.getMileage();
        double litersConsumed = currentLog.getLiters();

        if (litersConsumed <= 0) {
            return;
        }

        double efficiency = mileageDifference / litersConsumed;
        log.info("Efficiency calculated: {} km/L", efficiency);

        // Trigger notification if efficiency is below threshold
        if (efficiency < 5.0) {
            String message = String.format(
                "Low Efficiency Alert: Vehicle %s has fuel efficiency of %.2f km/L (below 5 km/L threshold) - reported by driver %s",
                currentLog.getVehicleRegNumber(),
                efficiency,
                driverUsername
            );

            Notification notification = new Notification(
                currentLog.getVehicleRegNumber(),
                message,
                "LOW_EFFICIENCY"
            );

            notificationRepository.save(notification);
            log.warn("LOW EFFICIENCY NOTIFICATION CREATED: {}", message);
        }
    }

    /**
     * Convert FuelLog entity to DTO
     */
    private FuelLogDto mapToDto(FuelLog fuelLog) {
        return new FuelLogDto(
            fuelLog.getId(),
            fuelLog.getVehicleRegNumber(),
            fuelLog.getFuelType(),
            fuelLog.getLiters(),
            fuelLog.getCostPerLiter(),
            fuelLog.getTotalCost(),
            fuelLog.getMileage(),
            fuelLog.getDate(),
            fuelLog.getDriverUsername()
        );
    }
}
