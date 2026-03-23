package net.javaguids.ems_backend.controller;

import lombok.AllArgsConstructor;
import net.javaguids.ems_backend.dto.ApiResponse;
import net.javaguids.ems_backend.dto.VehicleDto;
import net.javaguids.ems_backend.service.VehicleService;
import net.javaguids.ems_backend.util.ApiResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    // POST /api/vehicles — Create a new vehicle
    @PostMapping
    public ResponseEntity<ApiResponse<VehicleDto>> createVehicle(@RequestBody VehicleDto vehicleDto) {
        VehicleDto saved = vehicleService.createVehicle(vehicleDto);
        return ApiResponseUtil.success("Vehicle created successfully", saved, HttpStatus.CREATED);
    }

    // GET /api/vehicles — Get all vehicles
    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleDto>>> getAllVehicles() {
        List<VehicleDto> vehicles = vehicleService.getAllVehicles();
        return ApiResponseUtil.success("Vehicles fetched successfully", vehicles, HttpStatus.OK);
    }

    // GET /api/vehicles/{id} — Get vehicle by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleDto>> getVehicleById(@PathVariable Long id) {
        VehicleDto vehicle = vehicleService.getVehicleById(id);
        return ApiResponseUtil.success("Vehicle fetched successfully", vehicle, HttpStatus.OK);
    }

    // PUT /api/vehicles/{id} — Update vehicle
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleDto>> updateVehicle(
            @PathVariable Long id,
            @RequestBody VehicleDto vehicleDto) {
        VehicleDto updated = vehicleService.updateVehicle(id, vehicleDto);
        return ApiResponseUtil.success("Vehicle updated successfully", updated, HttpStatus.OK);
    }

    // DELETE /api/vehicles/{id} — Delete vehicle
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ApiResponseUtil.success("Vehicle deleted successfully", null, HttpStatus.OK);
    }
}
