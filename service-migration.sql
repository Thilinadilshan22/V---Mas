-- =====================================================
-- V-MAS Service Module — Reference Migration Script
-- NOTE: These tables are auto-created by JPA (ddl-auto=update)
--       Run this only if you need to create them manually.
-- =====================================================

USE vmas_db;

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id                 BIGINT          NOT NULL AUTO_INCREMENT,
    vehicle_name       VARCHAR(150)    NOT NULL,
    registration_no    VARCHAR(50)     NOT NULL UNIQUE,
    manufacturer       VARCHAR(100),
    model              VARCHAR(100),
    year               INT,
    current_mileage_km INT,
    created_at         DATETIME,
    PRIMARY KEY (id)
);

-- Service records table
CREATE TABLE IF NOT EXISTS service_records (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    vehicle_id          BIGINT          NOT NULL,
    service_type        VARCHAR(100)    NOT NULL,
    service_type_detail VARCHAR(255),
    service_date        DATE            NOT NULL,
    current_mileage_km  INT             NOT NULL,
    service_cost        DECIMAL(10, 2)  NOT NULL,
    technician_workshop VARCHAR(200)    NOT NULL,
    next_service_due    DATE,
    description         TEXT,
    created_at          DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_service_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);
