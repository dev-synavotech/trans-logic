CREATE DATABASE IF NOT EXISTS translogic;
USE translogic;

CREATE TABLE IF NOT EXISTS trucks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    truck_type VARCHAR(50) NOT NULL,
    truck_name VARCHAR(100) NOT NULL,
    truck_number VARCHAR(50) UNIQUE NOT NULL,
    actual_length DECIMAL(10,2),
    actual_width DECIMAL(10,2),
    actual_height DECIMAL(10,2),
    available_length DECIMAL(10,2),
    available_width DECIMAL(10,2),
    available_height DECIMAL(10,2),
    capacity_tons DECIMAL(10,2),
    availability_status ENUM('Available','Not Available') DEFAULT 'Available',
    origin VARCHAR(255),
    destination VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table: one route record per assigned route set for a truck
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    truck_id INT NOT NULL,
    name VARCHAR(200) DEFAULT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (truck_id) REFERENCES trucks(id) ON DELETE CASCADE
);

-- Each route can have multiple places (sequence/order, address)
CREATE TABLE IF NOT EXISTS route_places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    seq INT NOT NULL,
    address VARCHAR(500) NOT NULL,
    lat DECIMAL(10,7) DEFAULT NULL,
    lng DECIMAL(10,7) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);
