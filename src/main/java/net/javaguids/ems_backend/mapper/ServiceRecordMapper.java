package net.javaguids.ems_backend.mapper;

import net.javaguids.ems_backend.dto.ServiceRecordDto;
import net.javaguids.ems_backend.entity.ServiceRecord;
import net.javaguids.ems_backend.entity.Vehicle;

public class ServiceRecordMapper {

    public static ServiceRecordDto mapToServiceRecordDto(ServiceRecord record) {
        ServiceRecordDto dto = new ServiceRecordDto();
        dto.setId(record.getId());
        dto.setVehicleId(record.getVehicle().getId());
        dto.setVehicleName(record.getVehicle().getVehicleName());
        dto.setServiceType(record.getServiceType());
        dto.setServiceTypeDetail(record.getServiceTypeDetail());
        dto.setServiceDate(record.getServiceDate());
        dto.setCurrentMileageKm(record.getCurrentMileageKm());
        dto.setServiceCost(record.getServiceCost());
        dto.setTechnicianWorkshop(record.getTechnicianWorkshop());
        dto.setNextServiceDue(record.getNextServiceDue());
        dto.setDescription(record.getDescription());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }

    public static ServiceRecord mapToServiceRecord(ServiceRecordDto dto, Vehicle vehicle) {
        ServiceRecord record = new ServiceRecord();
        record.setVehicle(vehicle);
        record.setServiceType(dto.getServiceType());
        record.setServiceTypeDetail(dto.getServiceTypeDetail());
        record.setServiceDate(dto.getServiceDate());
        record.setCurrentMileageKm(dto.getCurrentMileageKm());
        record.setServiceCost(dto.getServiceCost());
        record.setTechnicianWorkshop(dto.getTechnicianWorkshop());
        record.setNextServiceDue(dto.getNextServiceDue());
        record.setDescription(dto.getDescription());
        return record;
    }
}
