package net.javaguids.ems_backend.service;

import net.javaguids.ems_backend.dto.ServiceFilterRequest;
import net.javaguids.ems_backend.dto.ServiceRecordDto;

import java.util.List;

public interface ServiceRecordService {

    ServiceRecordDto createServiceRecord(ServiceRecordDto dto);

    ServiceRecordDto getServiceRecordById(Long id);

    List<ServiceRecordDto> getAllServiceRecords();

    ServiceRecordDto updateServiceRecord(Long id, ServiceRecordDto dto);

    void deleteServiceRecord(Long id);

    List<ServiceRecordDto> filterServiceRecords(ServiceFilterRequest filter);

    List<ServiceRecordDto> getServiceRecordsByVehicle(Long vehicleId);

    net.javaguids.ems_backend.dto.ServiceRecordStatsDto getServiceStats();

    List<ServiceRecordDto> getUpcomingServices();

    List<ServiceRecordDto> getRecentServices();
}
