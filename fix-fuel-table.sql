-- Fix for database column name issue
-- Run this if you need to recreate the fuel_logs table with correct column name

-- Option 1: If you want to keep existing data
-- ALTER TABLE fuel_logs CHANGE COLUMN mileage current_mileage DOUBLE NOT NULL;

-- Option 2: Drop and recreate (WARNING: This will delete all data)
-- DROP TABLE IF EXISTS fuel_logs;
-- DROP TABLE IF EXISTS notifications;

-- Create fuel_logs table with correct column name
CREATE TABLE IF NOT EXISTS fuel_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_reg_number VARCHAR(255) NOT NULL,
    fuel_type VARCHAR(255) NOT NULL,
    liters DOUBLE NOT NULL,
    cost_per_liter DOUBLE NOT NULL,
    total_cost DOUBLE NOT NULL,
    current_mileage DOUBLE NOT NULL,
    date DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_reg_number VARCHAR(255) NOT NULL,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Verify tables
SELECT 'fuel_logs table structure:' as Info;
DESCRIBE fuel_logs;

SELECT 'notifications table structure:' as Info;
DESCRIBE notifications;
