CREATE DATABASE lead_access_app;
USE lead_access_app;

CREATE TABLE users (
  id integer PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  user_type VARCHAR(255) NOT NULL,
  manager VARCHAR(255)
);

INSERT INTO users (email, firstname, lastname, user_type, manager)
VALUES 
('manager@gmail.com', 'Dorian', 'Maitre', 'Manager', NULL),
('salve@gmail.com', 'Dorian', 'Slave', 'Salve', 'manager@gmail.com'),