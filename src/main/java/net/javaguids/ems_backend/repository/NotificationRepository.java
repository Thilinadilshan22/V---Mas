package net.javaguids.ems_backend.repository;

import net.javaguids.ems_backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByVehicleRegNumber(String vehicleRegNumber);
    
    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();
    
    List<Notification> findAllByOrderByCreatedAtDesc();
}
