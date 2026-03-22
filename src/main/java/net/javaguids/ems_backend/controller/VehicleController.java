package net.javaguids.ems_backend.controller;

import net.javaguids.ems_backend.dto.ApiResponse;
import net.javaguids.ems_backend.dto.VehicleDto;
import net.javaguids.ems_backend.service.VehicleService;
import net.javaguids.ems_backend.util.ApiResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @PostMapping("/register")
    ResponseEntity<ApiResponse<VehicleDto>> registerVehicle(@RequestBody VehicleDto vehicleDto) {
        VehicleDto vehicleResponseDto = vehicleService.registerVehicle(vehicleDto);
        return ApiResponseUtil.success("Vehicle successfully register", vehicleResponseDto, HttpStatus.CREATED);
    }
}
