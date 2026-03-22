package net.javaguids.ems_backend.service.impl;

import lombok.AllArgsConstructor;
import net.javaguids.ems_backend.dto.EmployeeDto;
import net.javaguids.ems_backend.entity.Employee;
import net.javaguids.ems_backend.exception.ResourceNotFoundException;
import net.javaguids.ems_backend.mapper.EmployeeMapper;
import net.javaguids.ems_backend.repository.EmployeeRepository;
import net.javaguids.ems_backend.service.EmployeeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private EmployeeRepository employeeRepository;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        Employee savedEmployee = employeeRepository.save(Objects.requireNonNull(employee));
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public EmployeeDto getEmployee(Long employeeId) {
        return null;
    }

    @Override
    public EmployeeDto getEmployeeById(Long employeeId) {
        Long requiredEmployeeId = Objects.requireNonNull(employeeId);
        Employee employee = employeeRepository.findById(requiredEmployeeId).orElseThrow(
                () -> new ResourceNotFoundException("Employee not found by Given ID : " + employeeId));
        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream().map((employee) -> EmployeeMapper.mapToEmployeeDto(employee))
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto updatedEmployee) {
        Long requiredEmployeeId = Objects.requireNonNull(employeeId);
        Employee employee = employeeRepository.findById(requiredEmployeeId).orElseThrow(
                () -> new ResourceNotFoundException("Employee not found by Given ID : " + employeeId));

        employee.setFirstName(updatedEmployee.getFirstName());
        employee.setLastName(updatedEmployee.getLastName());
        employee.setEmail(updatedEmployee.getEmail());

        Employee updatedEmployeeObj = employeeRepository.save(Objects.requireNonNull(employee));
        return EmployeeMapper.mapToEmployeeDto(updatedEmployeeObj);
    }

    @Override
    public void deleteEmployee(Long employeeId) {
        Long requiredEmployeeId = Objects.requireNonNull(employeeId);
        Employee employee = employeeRepository.findById(requiredEmployeeId).orElseThrow(
                () -> new ResourceNotFoundException("Employee not found by Given ID : " + employeeId));

        employeeRepository.delete(Objects.requireNonNull(employee));
    }

}
