-- ==============================================================================
-- DATABASE CREATION & SELECTION
-- ==============================================================================
CREATE DATABASE IF NOT EXISTS adv_dental_surgeries;
USE adv_dental_surgeries;

-- ==============================================================================
-- TABLE CREATION (DDL)
-- ==============================================================================

-- 1. Create Dentist Table
CREATE TABLE IF NOT EXISTS Dentist (
    dentist_id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    contact_phone VARCHAR(20),
    email VARCHAR(100),
    specialization VARCHAR(100)
);

-- 2. Create Patient Table
CREATE TABLE IF NOT EXISTS Patient (
    patient_id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    contact_phone VARCHAR(20),
    email VARCHAR(100),
    mailing_address VARCHAR(255),
    date_of_birth DATE
);

-- 3. Create Surgery Table
CREATE TABLE IF NOT EXISTS Surgery (
    surgery_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    location_address VARCHAR(255),
    telephone_number VARCHAR(20)
);

-- 4. Create Appointment Table
CREATE TABLE IF NOT EXISTS Appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'Booked',
    dentist_id VARCHAR(10),
    patient_id VARCHAR(10),
    surgery_id VARCHAR(10),
    FOREIGN KEY (dentist_id) REFERENCES Dentist(dentist_id),
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id),
    FOREIGN KEY (surgery_id) REFERENCES Surgery(surgery_id)
);

-- ==============================================================================
-- POPULATING DUMMY DATA (DML) - Based on provided image
-- ==============================================================================

-- Insert Dentists (IDs generated for the sample data)
INSERT INTO Dentist (dentist_id, first_name, last_name, specialization) VALUES
('D01', 'Tony', 'Smith', 'General Dentistry'),
('D02', 'Helen', 'Pearson', 'Orthodontics'),
('D03', 'Robin', 'Plevin', 'Pediatric Dentistry');

-- Insert Patients (Extracted from image)
INSERT INTO Patient (patient_id, first_name, last_name) VALUES
('P100', 'Gillian', 'White'),
('P105', 'Jill', 'Bell'),
('P108', 'Ian', 'MacKay'),
('P110', 'John', 'Walker');

-- Insert Surgeries (Extracted from image)
INSERT INTO Surgery (surgery_id, name) VALUES
('S10', 'Downtown Clinic'),
('S13', 'Westside Surgery'),
('S15', 'East End Dental');

-- Insert Appointments (Extracted exactly from the image grid)
INSERT INTO Appointment (appointment_date, appointment_time, dentist_id, patient_id, surgery_id) VALUES
('2013-09-12', '10:00:00', 'D01', 'P100', 'S15'),
('2013-09-12', '12:00:00', 'D01', 'P105', 'S15'),
('2013-09-12', '10:00:00', 'D02', 'P108', 'S10'),
('2013-09-14', '14:00:00', 'D02', 'P108', 'S10'),
('2013-09-14', '16:30:00', 'D03', 'P105', 'S15'),
('2013-09-15', '18:00:00', 'D03', 'P110', 'S13');


-- ==============================================================================
-- LAB QUERIES (DQL)
-- ==============================================================================

-- Query 1: Display the list of ALL Dentists registered in the system, sorted in ascending order of their lastNames
SELECT * FROM Dentist
ORDER BY last_name ASC;

-- Query 2: Display the list of ALL Appointments for a given Dentist by their dentist_Id number. Include Patient info.
-- (Example uses 'D01' for Tony Smith)
SELECT 
    a.appointment_id, a.appointment_date, a.appointment_time, 
    d.first_name AS dentist_first_name, d.last_name AS dentist_last_name,
    p.patient_id, p.first_name AS patient_first_name, p.last_name AS patient_last_name
FROM Appointment a
JOIN Dentist d ON a.dentist_id = d.dentist_id
JOIN Patient p ON a.patient_id = p.patient_id
WHERE a.dentist_id = 'D01';

-- Query 3: Display the list of ALL Appointments that have been scheduled at a Surgery Location
-- (Example uses 'S15')
SELECT 
    a.appointment_id, a.appointment_date, a.appointment_time, 
    s.surgery_id, s.name AS surgery_name,
    d.last_name AS dentist_name, p.last_name AS patient_name
FROM Appointment a
JOIN Surgery s ON a.surgery_id = s.surgery_id
JOIN Dentist d ON a.dentist_id = d.dentist_id
JOIN Patient p ON a.patient_id = p.patient_id
WHERE a.surgery_id = 'S15';

-- Query 4: Display the list of the Appointments booked for a given Patient on a given Date.
-- (Example uses patient 'P108' (Ian MacKay) on '2013-09-12')
SELECT 
    a.appointment_id, a.appointment_date, a.appointment_time, 
    p.first_name, p.last_name, 
    d.last_name AS attending_dentist
FROM Appointment a
JOIN Patient p ON a.patient_id = p.patient_id
JOIN Dentist d ON a.dentist_id = d.dentist_id
WHERE a.patient_id = 'P108' AND a.appointment_date = '2013-09-12';