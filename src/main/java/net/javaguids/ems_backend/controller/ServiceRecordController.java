package net.javaguids.ems_backend.controller;

import lombok.AllArgsConstructor;
import net.javaguids.ems_backend.dto.ApiResponse;
import net.javaguids.ems_backend.dto.ServiceFilterRequest;
import net.javaguids.ems_backend.dto.ServiceRecordDto;
import net.javaguids.ems_backend.service.ServiceRecordService;
import net.javaguids.ems_backend.util.ApiResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import net.javaguids.ems_backend.dto.ServiceRecordStatsDto;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/services")
@PreAuthorize("hasAnyRole('ADMIN', 'CONTROLLER')")
public class ServiceRecordController {

    private final ServiceRecordService serviceRecordService;

    // POST /api/services — Add new service record
    @PostMapping
    public ResponseEntity<ApiResponse<ServiceRecordDto>> createServiceRecord(
            @RequestBody ServiceRecordDto serviceRecordDto) {
        ServiceRecordDto saved = serviceRecordService.createServiceRecord(serviceRecordDto);
        return ApiResponseUtil.success("Service record created successfully", saved, HttpStatus.CREATED);
    }

    // GET /api/services — Get all service records
    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceRecordDto>>> getAllServiceRecords() {
        List<ServiceRecordDto> records = serviceRecordService.getAllServiceRecords();
        return ApiResponseUtil.success("Service records fetched successfully", records, HttpStatus.OK);
    }

    // GET /api/services/{id} — Get service record by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceRecordDto>> getServiceRecordById(@PathVariable Long id) {
        ServiceRecordDto record = serviceRecordService.getServiceRecordById(id);
        return ApiResponseUtil.success("Service record fetched successfully", record, HttpStatus.OK);
    }

    // PUT /api/services/{id} — Update service record
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceRecordDto>> updateServiceRecord(
            @PathVariable Long id,
            @RequestBody ServiceRecordDto serviceRecordDto) {
        ServiceRecordDto updated = serviceRecordService.updateServiceRecord(id, serviceRecordDto);
        return ApiResponseUtil.success("Service record updated successfully", updated, HttpStatus.OK);
    }

    // DELETE /api/services/{id} — Delete service record
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteServiceRecord(@PathVariable Long id) {
        serviceRecordService.deleteServiceRecord(id);
        return ApiResponseUtil.success("Service record deleted successfully", null, HttpStatus.OK);
    }

    // POST /api/services/filter — Filter service records
    // All filter fields are optional; only non-null values are applied
    @PostMapping("/filter")
    public ResponseEntity<ApiResponse<List<ServiceRecordDto>>> filterServiceRecords(
            @RequestBody ServiceFilterRequest filterRequest) {
        List<ServiceRecordDto> records = serviceRecordService.filterServiceRecords(filterRequest);
        return ApiResponseUtil.success("Service records filtered successfully", records, HttpStatus.OK);
    }

    // GET /api/services/vehicle/{vehicleId} — Get all services for a specific vehicle
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<ApiResponse<List<ServiceRecordDto>>> getServiceRecordsByVehicle(
            @PathVariable Long vehicleId) {
        List<ServiceRecordDto> records = serviceRecordService.getServiceRecordsByVehicle(vehicleId);
        return ApiResponseUtil.success("Service records for vehicle fetched successfully", records, HttpStatus.OK);
    }

    // GET /api/services/stats — Get summary statistics of service records
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<ServiceRecordStatsDto>> getServiceStats() {
        ServiceRecordStatsDto stats = serviceRecordService.getServiceStats();
        return ApiResponseUtil.success("Service stats fetched successfully", stats, HttpStatus.OK);
    }

    // GET /api/services/upcoming — Get upcoming services within 30 days
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<ServiceRecordDto>>> getUpcomingServices() {
        List<ServiceRecordDto> records = serviceRecordService.getUpcomingServices();
        return ApiResponseUtil.success("Upcoming services fetched successfully", records, HttpStatus.OK);
    }

    // GET /api/services/recent — Get the 5 most recent service records
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<ServiceRecordDto>>> getRecentServices() {
        List<ServiceRecordDto> records = serviceRecordService.getRecentServices();
        return ApiResponseUtil.success("Recent services fetched successfully", records, HttpStatus.OK);
    }
}
