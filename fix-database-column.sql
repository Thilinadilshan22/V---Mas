-- Run this script in your MySQL Command Line or Workbench
-- It will fix the "Data too long" error for profile pictures

USE vmas_db;

-- Update the column to LONGTEXT to support Base64 images
ALTER TABLE users MODIFY profile_picture LONGTEXT;

-- Confirm the change
DESCRIBE users;
