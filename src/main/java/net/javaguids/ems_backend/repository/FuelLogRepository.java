package net.javaguids.ems_backend.repository;

import net.javaguids.ems_backend.entity.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {

    List<FuelLog> findByVehicleRegNumberOrderByDateDesc(String vehicleRegNumber);

    @Query("SELECT COALESCE(SUM(f.liters), 0.0) FROM FuelLog f WHERE f.fuelType = :fuelType AND MONTH(f.date) = :month AND YEAR(f.date) = :year")
    Double getTotalLitersByFuelType(@Param("fuelType") String fuelType, @Param("month") int month, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(f.totalCost), 0.0) FROM FuelLog f WHERE MONTH(f.date) = :month AND YEAR(f.date) = :year")
    Double getTotalCostForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT f FROM FuelLog f WHERE f.vehicleRegNumber = :vehicleRegNumber AND f.date < :currentDate ORDER BY f.date DESC, f.id DESC")
    List<FuelLog> findPreviousLog(@Param("vehicleRegNumber") String vehicleRegNumber, @Param("currentDate") LocalDate currentDate);

    @Query("SELECT DISTINCT f.vehicleRegNumber FROM FuelLog f")
    List<String> findAllDistinctVehicleRegNumbers();

    @Query("SELECT MONTH(f.date) as month, f.fuelType, SUM(f.liters) as totalLiters " +
           "FROM FuelLog f WHERE YEAR(f.date) = :year " +
           "GROUP BY MONTH(f.date), f.fuelType " +
           "ORDER BY MONTH(f.date)")
    List<Object[]> getMonthlyConsumptionByFuelType(@Param("year") int year);

    @Query("SELECT COALESCE(SUM(f.totalCost), 0.0) FROM FuelLog f WHERE f.vehicleRegNumber = :vehicleRegNumber")
    Double getTotalSpendingByVehicle(@Param("vehicleRegNumber") String vehicleRegNumber);
}
