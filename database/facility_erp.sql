CREATE DATABASE facility_erp;
USE facility_erp;
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO departments (department_name, description)
VALUES
('Facility Management', 'Manages facility operations'),
('Electrical', 'Handles electrical maintenance'),
('HVAC', 'Handles heating, ventilation and air conditioning'),
('IT', 'Handles IT infrastructure and systems'),
('Security', 'Handles security operations'),
('Housekeeping', 'Handles cleaning and housekeeping services');

SELECT * FROM departments;

CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(150) NOT NULL,
    building VARCHAR(100),
    floor VARCHAR(50),
    room VARCHAR(50),
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO locations
(location_name, building, floor, room, description)
VALUES
('Main Office - Reception', 'Building A', 'Ground Floor', 'Reception', 'Main reception area'),
('Server Room', 'Building A', 'First Floor', '101', 'IT server room'),
('Electrical Room', 'Building B', 'Ground Floor', 'E01', 'Electrical equipment room'),
('Generator Room', 'Building B', 'Ground Floor', 'G01', 'Backup generator room');

SELECT * FROM locations;

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    employee_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    department_id INT,
    designation VARCHAR(100),
    joining_date DATE,
    status VARCHAR(30) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id)
        REFERENCES departments(id)
);

INSERT INTO employees
(employee_code, employee_name, email, phone, department_id, designation, joining_date)
VALUES
('EMP001', 'Ravi Kumar', 'ravi@example.com', '9876543210', 2, 'Electrical Technician', '2025-06-10'),
('EMP002', 'Arun Kumar', 'arun@example.com', '9876543211', 3, 'HVAC Technician', '2025-07-15'),
('EMP003', 'Manoj Kumar', 'manoj@example.com', '9876543212', 4, 'IT Support Engineer', '2025-08-20'),
('EMP004', 'Suresh Kumar', 'suresh@example.com', '9876543213', 5, 'Security Supervisor', '2025-05-12');

SELECT * FROM employees;

CREATE TABLE asset_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

INSERT INTO asset_categories
(category_name, description)
VALUES
('HVAC', 'Air conditioning and ventilation equipment'),
('Electrical', 'Electrical equipment and systems'),
('IT Equipment', 'Computers, servers and networking equipment'),
('Generator', 'Power backup generators'),
('Elevator', 'Elevator and lift systems'),
('Fire Safety', 'Fire safety equipment');

CREATE TABLE assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    location_id INT NOT NULL,
    purchase_date DATE,
    purchase_cost DECIMAL(12,2),
    warranty_expiry DATE,
    status VARCHAR(30) DEFAULT 'Active',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES asset_categories(id),

    FOREIGN KEY (location_id)
        REFERENCES locations(id)
);

INSERT INTO assets
(asset_code, asset_name, category_id, location_id, purchase_date, purchase_cost, warranty_expiry)
VALUES
('AST001', 'Central Air Conditioner', 1, 1, '2025-01-10', 85000.00, '2028-01-10'),
('AST002', 'Diesel Generator', 4, 4, '2024-06-15', 450000.00, '2027-06-15'),
('AST003', 'Server', 3, 2, '2025-03-20', 180000.00, '2028-03-20'),
('AST004', 'Electrical Panel', 2, 3, '2024-09-10', 75000.00, '2027-09-10');

SELECT * FROM assets;

SELECT
    a.asset_code,
    a.asset_name,
    ac.category_name,
    l.location_name,
    l.building,
    a.status
FROM assets a
JOIN asset_categories ac
    ON a.category_id = ac.id
JOIN locations l
    ON a.location_id = l.id;
    
SHOW TABLES;