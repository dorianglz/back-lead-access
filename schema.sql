CREATE DATABASE lead_access_app;
USE lead_access_app;

CREATE TABLE users (
  id integer PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  user_type VARCHAR(255) NOT NULL,
  manager VARCHAR(255)
);

INSERT INTO users (email, password, firstname, lastname, user_type, manager)
VALUES 
('manager@gmail.com', '123123', 'Dorian', 'Maitre', 'Manager', NULL),
('salve@gmail.com', '123123', 'Dorian', 'Slave', 'Salve', 'manager@gmail.com'),