package net.javaguids.ems_backend.repository;

import net.javaguids.ems_backend.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRecordRepository
        extends JpaRepository<ServiceRecord, Long>, JpaSpecificationExecutor<ServiceRecord> {

    List<ServiceRecord> findByVehicleId(Long vehicleId);

    List<ServiceRecord> findTop5ByOrderByServiceDateDesc();

    List<ServiceRecord> findByNextServiceDueBetweenOrderByNextServiceDueAsc(
            java.time.LocalDate startDate, java.time.LocalDate endDate);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(sr.serviceCost) FROM ServiceRecord sr")
    java.math.BigDecimal getTotalServiceCost();

    @org.springframework.data.jpa.repository.Query("SELECT sr.serviceType, COUNT(sr) FROM ServiceRecord sr GROUP BY sr.serviceType")
    List<Object[]> countServicesByType();
}
