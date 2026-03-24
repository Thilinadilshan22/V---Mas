package net.javaguids.ems_backend.repository;

import net.javaguids.ems_backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByRegistrationNo(String registrationNo);

    boolean existsByRegistrationNo(String registrationNo);
}
