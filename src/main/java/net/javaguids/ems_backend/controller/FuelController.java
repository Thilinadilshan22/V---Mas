package net.javaguids.ems_backend.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javaguids.ems_backend.dto.*;
import net.javaguids.ems_backend.service.FuelService;
import net.javaguids.ems_backend.util.ApiResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/fuel")
public class FuelController {

    private FuelService fuelService;

    /**
     * POST /api/fuel/add - Add a new fuel log entry
     * Automatically calculates totalCost if not provided
     * Triggers low efficiency notification if km/L < 5
     */
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<FuelLogDto>> addFuelLog(@RequestBody FuelLogDto fuelLogDto) {
        log.info("POST /api/fuel/add - Adding fuel log for vehicle: {}", fuelLogDto.getVehicleRegNumber());
        FuelLogDto savedLog = fuelService.addFuelLog(fuelLogDto);
        return ApiResponseUtil.success("Fuel log added successfully", savedLog, HttpStatus.CREATED);
    }

    /**
     * GET /api/fuel/summary - Get current month summary
     * Returns totalDiesel, totalPetrol, totalVolume, and totalCost
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<FuelSummaryDto>> getCurrentMonthSummary() {
        log.info("GET /api/fuel/summary - Fetching current month summary");
        FuelSummaryDto summary = fuelService.getCurrentMonthSummary();
        return ApiResponseUtil.success("Monthly summary retrieved successfully", summary, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/chart - Get monthly consumption data for React Bar Chart
     * Returns data grouped by month for Diesel and Petrol
     */
    @GetMapping("/chart")
    public ResponseEntity<ApiResponse<FuelChartDto>> getMonthlyChartData() {
        log.info("GET /api/fuel/chart - Fetching chart data");
        FuelChartDto chartData = fuelService.getMonthlyChartData();
        return ApiResponseUtil.success("Chart data retrieved successfully", chartData, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/stats - Get all vehicle statistics
     * Returns list of vehicles with efficiency and spending for dashboard table
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<List<VehicleFuelStatsDto>>> getAllVehicleStats() {
        log.info("GET /api/fuel/stats - Fetching all vehicle statistics");
        List<VehicleFuelStatsDto> stats = fuelService.getAllVehicleStats();
        return ApiResponseUtil.success("Vehicle statistics retrieved successfully", stats, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/{id} - Get fuel log by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FuelLogDto>> getFuelLogById(@PathVariable Long id) {
        log.info("GET /api/fuel/{} - Fetching fuel log by ID", id);
        FuelLogDto fuelLog = fuelService.getFuelLogById(id);
        return ApiResponseUtil.success("Fuel log retrieved successfully", fuelLog, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/vehicle/{vehicleRegNumber} - Get all logs for a specific vehicle
     */
    @GetMapping("/vehicle/{vehicleRegNumber}")
    public ResponseEntity<ApiResponse<List<FuelLogDto>>> getFuelLogsByVehicle(@PathVariable String vehicleRegNumber) {
        log.info("GET /api/fuel/vehicle/{} - Fetching logs for vehicle", vehicleRegNumber);
        List<FuelLogDto> logs = fuelService.getFuelLogsByVehicle(vehicleRegNumber);
        return ApiResponseUtil.success("Vehicle fuel logs retrieved successfully", logs, HttpStatus.OK);
    }
}
