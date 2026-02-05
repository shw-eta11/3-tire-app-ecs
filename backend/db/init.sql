CREATE DATABASE IF NOT EXISTS db;
USE db;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name) VALUES
('General'), ('Tech'), ('DevOps'), ('Demo');

INSERT INTO messages (message, category) VALUES
('Welcome to our 3-tier app!', 'General'),
('React + Node + MySQL is amazing!', 'Tech'),
('Deploy me on ECS!', 'DevOps'),
('This is a sample message', 'Demo'),
('Have fun with AWS ECS!', 'DevOps');
