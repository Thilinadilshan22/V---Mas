package net.javaguids.ems_backend.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javaguids.ems_backend.dto.*;
import net.javaguids.ems_backend.service.FuelService;
import net.javaguids.ems_backend.util.ApiResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/fuel")
public class FuelController {

    private FuelService fuelService;

    // ==================== DRIVER ENDPOINTS ====================

    /**
     * POST /api/fuel/add
     * Driver adds their own fuel log. The logged-in user is captured from the JWT principal.
     */
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<FuelLogDto>> addFuelLog(
            @RequestBody FuelLogDto fuelLogDto,
            Principal principal) {
        String driverUsername = principal.getName();
        log.info("POST /api/fuel/add - Driver '{}' adding fuel log for vehicle: {}",
                 driverUsername, fuelLogDto.getVehicleRegNumber());
        FuelLogDto savedLog = fuelService.addFuelLog(fuelLogDto, driverUsername);
        return ApiResponseUtil.success("Fuel log added successfully", savedLog, HttpStatus.CREATED);
    }

    /**
     * GET /api/fuel/my-logs
     * Driver fetches only their own fuel history.
     */
    @GetMapping("/my-logs")
    public ResponseEntity<ApiResponse<List<FuelLogDto>>> getMyFuelLogs(Principal principal) {
        String driverUsername = principal.getName();
        log.info("GET /api/fuel/my-logs - Driver '{}' fetching their logs", driverUsername);
        List<FuelLogDto> logs = fuelService.getMyFuelLogs(driverUsername);
        return ApiResponseUtil.success("Fuel logs retrieved successfully", logs, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/my-logs/{id}
     * Driver fetches a specific log — only if it belongs to them.
     */
    @GetMapping("/my-logs/{id}")
    public ResponseEntity<ApiResponse<FuelLogDto>> getMyFuelLogById(
            @PathVariable Long id,
            Principal principal) {
        String driverUsername = principal.getName();
        log.info("GET /api/fuel/my-logs/{} - Driver '{}' fetching log", id, driverUsername);
        FuelLogDto fuelLog = fuelService.getMyFuelLogById(id, driverUsername);
        return ApiResponseUtil.success("Fuel log retrieved successfully", fuelLog, HttpStatus.OK);
    }

    /**
     * PUT /api/fuel/my-logs/{id}
     * Driver updates their own fuel log entry.
     */
    @PutMapping("/my-logs/{id}")
    public ResponseEntity<ApiResponse<FuelLogDto>> updateMyFuelLog(
            @PathVariable Long id,
            @RequestBody FuelLogDto fuelLogDto,
            Principal principal) {
        String driverUsername = principal.getName();
        log.info("PUT /api/fuel/my-logs/{} - Driver '{}' updating log", id, driverUsername);
        FuelLogDto updated = fuelService.updateMyFuelLog(id, fuelLogDto, driverUsername);
        return ApiResponseUtil.success("Fuel log updated successfully", updated, HttpStatus.OK);
    }

    // ==================== ADMIN / SHARED ANALYTICS ENDPOINTS ====================

    /**
     * GET /api/fuel/summary - Current month summary
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<FuelSummaryDto>> getCurrentMonthSummary() {
        log.info("GET /api/fuel/summary - Fetching current month summary");
        FuelSummaryDto summary = fuelService.getCurrentMonthSummary();
        return ApiResponseUtil.success("Monthly summary retrieved successfully", summary, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/chart - Monthly consumption chart data
     */
    @GetMapping("/chart")
    public ResponseEntity<ApiResponse<FuelChartDto>> getMonthlyChartData() {
        log.info("GET /api/fuel/chart - Fetching chart data");
        FuelChartDto chartData = fuelService.getMonthlyChartData();
        return ApiResponseUtil.success("Chart data retrieved successfully", chartData, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/stats - All vehicle statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<List<VehicleFuelStatsDto>>> getAllVehicleStats() {
        log.info("GET /api/fuel/stats - Fetching all vehicle statistics");
        List<VehicleFuelStatsDto> stats = fuelService.getAllVehicleStats();
        return ApiResponseUtil.success("Vehicle statistics retrieved successfully", stats, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/log/{id} - Get any fuel log by ID
     */
    @GetMapping("/log/{id}")
    public ResponseEntity<ApiResponse<FuelLogDto>> getFuelLogById(@PathVariable Long id) {
        log.info("GET /api/fuel/log/{} - Fetching fuel log by ID", id);
        FuelLogDto fuelLog = fuelService.getFuelLogById(id);
        return ApiResponseUtil.success("Fuel log retrieved successfully", fuelLog, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/vehicle/{vehicleRegNumber} - All logs for a specific vehicle
     */
    @GetMapping("/vehicle/{vehicleRegNumber}")
    public ResponseEntity<ApiResponse<List<FuelLogDto>>> getFuelLogsByVehicle(
            @PathVariable String vehicleRegNumber) {
        log.info("GET /api/fuel/vehicle/{} - Fetching logs for vehicle", vehicleRegNumber);
        List<FuelLogDto> logs = fuelService.getFuelLogsByVehicle(vehicleRegNumber);
        return ApiResponseUtil.success("Vehicle fuel logs retrieved successfully", logs, HttpStatus.OK);
    }

    // ==================== CONTROLLER ENDPOINTS ====================

    /**
     * GET /api/fuel/all
     * Controller/Admin fetches EVERY fuel log in the system (all drivers, all vehicles).
     */
    @PreAuthorize("hasAnyRole('CONTROLLER', 'ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<FuelLogDto>>> getAllFuelLogs() {
        log.info("GET /api/fuel/all - Controller fetching all fuel logs");
        List<FuelLogDto> logs = fuelService.getAllFuelLogs();
        return ApiResponseUtil.success("All fuel logs retrieved successfully", logs, HttpStatus.OK);
    }

    /**
     * POST /api/fuel/controller/add
     * Controller/Admin adds a fuel log.
     * Can optionally include driverUsername in the request body to assign it to a driver.
     */
    @PreAuthorize("hasAnyRole('CONTROLLER', 'ADMIN')")
    @PostMapping("/controller/add")
    public ResponseEntity<ApiResponse<FuelLogDto>> addFuelLogByController(
            @RequestBody FuelLogDto fuelLogDto) {
        log.info("POST /api/fuel/controller/add - Controller adding fuel log for vehicle: {}",
                 fuelLogDto.getVehicleRegNumber());
        FuelLogDto savedLog = fuelService.addFuelLogByController(fuelLogDto);
        return ApiResponseUtil.success("Fuel log added by controller successfully", savedLog, HttpStatus.CREATED);
    }

    /**
     * PUT /api/fuel/controller/{id}
     * Controller/Admin updates ANY fuel log by ID — no ownership restriction.
     */
    @PreAuthorize("hasAnyRole('CONTROLLER', 'ADMIN')")
    @PutMapping("/controller/{id}")
    public ResponseEntity<ApiResponse<FuelLogDto>> updateFuelLogByController(
            @PathVariable Long id,
            @RequestBody FuelLogDto fuelLogDto) {
        log.info("PUT /api/fuel/controller/{} - Controller updating fuel log", id);
        FuelLogDto updated = fuelService.updateFuelLogByController(id, fuelLogDto);
        return ApiResponseUtil.success("Fuel log updated by controller successfully", updated, HttpStatus.OK);
    }

    /**
     * DELETE /api/fuel/controller/{id}
     * Controller/Admin deletes ANY fuel log by ID.
     */
    @PreAuthorize("hasAnyRole('CONTROLLER', 'ADMIN')")
    @DeleteMapping("/controller/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFuelLog(@PathVariable Long id) {
        log.info("DELETE /api/fuel/controller/{} - Controller deleting fuel log", id);
        fuelService.deleteFuelLog(id);
        return ApiResponseUtil.success("Fuel log deleted successfully", null, HttpStatus.OK);
    }

    /**
     * GET /api/fuel/controller/search/{id}
     * Controller/Admin searches for a specific fuel log by ID.
     */
    @PreAuthorize("hasAnyRole('CONTROLLER', 'ADMIN')")
    @GetMapping("/controller/search/{id}")
    public ResponseEntity<ApiResponse<FuelLogDto>> getFuelLogByIdForController(@PathVariable Long id) {
        log.info("GET /api/fuel/controller/search/{} - Controller searching fuel log by ID", id);
        FuelLogDto fuelLog = fuelService.getFuelLogById(id);
        return ApiResponseUtil.success("Fuel log retrieved successfully", fuelLog, HttpStatus.OK);
    }
}
