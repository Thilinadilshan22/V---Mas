-- VMAS Database Setup Script
-- This script creates the database and initial admin user

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS vmas_db;
USE vmas_db;

-- Create users table (if not exists - JPA will handle this)
-- This is just for reference, Spring JPA will auto-create

-- Insert default admin user
-- Password: admin123 (BCrypt encoded)
INSERT INTO users (user_name, email, password, role, account_status, profile_picture)
SELECT * FROM (SELECT 'admin', 'admin@vmas.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ADMIN', 'ACTIVE', NULL) AS tmp
WHERE NOT EXISTS (
    SELECT user_name FROM users WHERE user_name = 'admin'
) LIMIT 1;

-- Insert default controller user
-- Password: controller123
INSERT INTO users (user_name, email, password, role, account_status, profile_picture)
SELECT * FROM (SELECT 'controller1', 'controller@vmas.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'CONTROLLER', 'ACTIVE', NULL) AS tmp
WHERE NOT EXISTS (
    SELECT user_name FROM users WHERE user_name = 'controller1'
) LIMIT 1;

-- Insert default driver user
-- Password: driver123
INSERT INTO users (user_name, email, password, role, account_status, profile_picture)
SELECT * FROM (SELECT 'driver1', 'driver@vmas.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'DRIVER', 'ACTIVE', NULL) AS tmp
WHERE NOT EXISTS (
    SELECT user_name FROM users WHERE user_name = 'driver1'
) LIMIT 1;

-- Verify users created
SELECT id, user_name, email, role, account_status FROM users;
