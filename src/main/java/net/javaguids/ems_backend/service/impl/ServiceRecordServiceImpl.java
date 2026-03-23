package net.javaguids.ems_backend.service.impl;

import jakarta.persistence.criteria.Predicate;
import lombok.AllArgsConstructor;
import net.javaguids.ems_backend.dto.ServiceFilterRequest;
import net.javaguids.ems_backend.dto.ServiceRecordDto;
import net.javaguids.ems_backend.entity.ServiceRecord;
import net.javaguids.ems_backend.entity.Vehicle;
import net.javaguids.ems_backend.enums.ServiceType;
import net.javaguids.ems_backend.exception.ResourceNotFoundException;
import net.javaguids.ems_backend.mapper.ServiceRecordMapper;
import net.javaguids.ems_backend.repository.ServiceRecordRepository;
import net.javaguids.ems_backend.repository.VehicleRepository;
import net.javaguids.ems_backend.service.ServiceRecordService;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ServiceRecordServiceImpl implements ServiceRecordService {

    private final ServiceRecordRepository serviceRecordRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public ServiceRecordDto createServiceRecord(ServiceRecordDto dto) {
        validateServiceTypeDetail(dto.getServiceType(), dto.getServiceTypeDetail());

        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vehicle not found with id: " + dto.getVehicleId()));

        ServiceRecord record = ServiceRecordMapper.mapToServiceRecord(dto, vehicle);
        ServiceRecord saved = serviceRecordRepository.save(record);
        return ServiceRecordMapper.mapToServiceRecordDto(saved);
    }

    @Override
    public ServiceRecordDto getServiceRecordById(Long id) {
        ServiceRecord record = serviceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service record not found with id: " + id));
        return ServiceRecordMapper.mapToServiceRecordDto(record);
    }

    @Override
    public List<ServiceRecordDto> getAllServiceRecords() {
        return serviceRecordRepository.findAll()
                .stream()
                .map(ServiceRecordMapper::mapToServiceRecordDto)
                .collect(Collectors.toList());
    }

    @Override
    public ServiceRecordDto updateServiceRecord(Long id, ServiceRecordDto dto) {
        ServiceRecord record = serviceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service record not found with id: " + id));

        validateServiceTypeDetail(dto.getServiceType(), dto.getServiceTypeDetail());

        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vehicle not found with id: " + dto.getVehicleId()));

        record.setVehicle(vehicle);
        record.setServiceType(dto.getServiceType());
        record.setServiceTypeDetail(dto.getServiceTypeDetail());
        record.setServiceDate(dto.getServiceDate());
        record.setCurrentMileageKm(dto.getCurrentMileageKm());
        record.setServiceCost(dto.getServiceCost());
        record.setTechnicianWorkshop(dto.getTechnicianWorkshop());
        record.setNextServiceDue(dto.getNextServiceDue());
        record.setDescription(dto.getDescription());

        ServiceRecord updated = serviceRecordRepository.save(record);
        return ServiceRecordMapper.mapToServiceRecordDto(updated);
    }

    @Override
    public void deleteServiceRecord(Long id) {
        ServiceRecord record = serviceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service record not found with id: " + id));
        serviceRecordRepository.delete(record);
    }

    @Override
    public List<ServiceRecordDto> filterServiceRecords(ServiceFilterRequest filter) {
        Specification<ServiceRecord> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getVehicleId() != null) {
                predicates.add(cb.equal(root.get("vehicle").get("id"), filter.getVehicleId()));
            }
            if (filter.getServiceType() != null) {
                predicates.add(cb.equal(root.get("serviceType"), filter.getServiceType()));
            }
            if (filter.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("serviceDate"), filter.getFromDate()));
            }
            if (filter.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("serviceDate"), filter.getToDate()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return serviceRecordRepository.findAll(spec)
                .stream()
                .map(ServiceRecordMapper::mapToServiceRecordDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceRecordDto> getServiceRecordsByVehicle(Long vehicleId) {
        if (!vehicleRepository.existsById(vehicleId)) {
            throw new ResourceNotFoundException("Vehicle not found with id: " + vehicleId);
        }
        return serviceRecordRepository.findByVehicleId(vehicleId)
                .stream()
                .map(ServiceRecordMapper::mapToServiceRecordDto)
                .collect(Collectors.toList());
    }

    /**
     * Validates that serviceTypeDetail is provided when serviceType is OTHER.
     */
    private void validateServiceTypeDetail(ServiceType serviceType, String serviceTypeDetail) {
        if (ServiceType.OTHER.equals(serviceType)
                && (serviceTypeDetail == null || serviceTypeDetail.isBlank())) {
            throw new RuntimeException(
                    "Service type detail is required when service type is 'OTHER'.");
        }
    }

    @Override
    public net.javaguids.ems_backend.dto.ServiceRecordStatsDto getServiceStats() {
        Long totalRecords = serviceRecordRepository.count();
        java.math.BigDecimal totalCost = serviceRecordRepository.getTotalServiceCost();
        if (totalCost == null) {
            totalCost = java.math.BigDecimal.ZERO;
        }

        List<Object[]> typeCounts = serviceRecordRepository.countServicesByType();
        java.util.Map<String, Long> servicesByType = new java.util.HashMap<>();
        for (Object[] row : typeCounts) {
            if (row[0] != null) {
                ServiceType type = (ServiceType) row[0];
                Long count = (Long) row[1];
                servicesByType.put(type.name(), count);
            }
        }

        return new net.javaguids.ems_backend.dto.ServiceRecordStatsDto(totalRecords, totalCost, servicesByType);
    }

    @Override
    public List<ServiceRecordDto> getUpcomingServices() {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate thirtyDaysFromNow = today.plusDays(30);
        return serviceRecordRepository.findByNextServiceDueBetweenOrderByNextServiceDueAsc(today, thirtyDaysFromNow)
                .stream()
                .map(ServiceRecordMapper::mapToServiceRecordDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceRecordDto> getRecentServices() {
        return serviceRecordRepository.findTop5ByOrderByServiceDateDesc()
                .stream()
                .map(ServiceRecordMapper::mapToServiceRecordDto)
                .collect(Collectors.toList());
    }
}
