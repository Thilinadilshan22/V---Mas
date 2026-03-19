package net.javaguids.ems_backend.controller;

import lombok.AllArgsConstructor;
import net.javaguids.ems_backend.dto.ApiResponse;
import net.javaguids.ems_backend.dto.EmployeeDto;
import net.javaguids.ems_backend.service.EmployeeService;
import net.javaguids.ems_backend.util.ApiResponseUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private EmployeeService employeeService;

    // Build AA Employee REST API
    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDto>> createEmployee(@RequestBody EmployeeDto employeeDto) {
        EmployeeDto savedEmployee = employeeService.createEmployee(employeeDto);
        return ApiResponseUtil.success("Employee created successfully", savedEmployee, HttpStatus.CREATED);
    }

    // Build Get Employee REST API
    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<EmployeeDto>> getEmployeeById(@PathVariable("id") Long employeeId) {
        EmployeeDto employeeDto = employeeService.getEmployeeById(employeeId);
        return ApiResponseUtil.success("Employee fetched successfully", employeeDto, HttpStatus.OK);
    }

    // Build Get All Employees REST API
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeDto>>> getAllEmployees() {
        List<EmployeeDto> employees = employeeService.getAllEmployees();
        return ApiResponseUtil.success("Employees fetched successfully", employees, HttpStatus.OK);
    }

    // Build Update Employee REST API
    @PutMapping("{id}")
    public ResponseEntity<ApiResponse<EmployeeDto>> updateEmployee(@PathVariable("id") Long employeeId,
            @RequestBody EmployeeDto updatedEmployee) {
        EmployeeDto employee = employeeService.updateEmployee(employeeId, updatedEmployee);
        return ApiResponseUtil.success("Employee updated successfully", employee, HttpStatus.OK);
    }

    // Build Delete Employee REST API
    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Object>> deleteEmployee(@PathVariable("id") Long employeeId) {
        employeeService.deleteEmployee(employeeId);
        return ApiResponseUtil.success("Employee deleted successfully", null, HttpStatus.OK);
    }

}
