CREATE DATABASE FoodDB;
USE FoodDB;

-- Buyers Table
CREATE TABLE buyers (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Restaurants Table
CREATE TABLE restaurants (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY (email)
);

-- Menu Table
CREATE TABLE menu (
  id INT NOT NULL AUTO_INCREMENT,
  restaurant_name VARCHAR(100) NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  PRIMARY KEY (id)
);

-- Orders Table
CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT,
  buyer_name VARCHAR(100) NOT NULL,
  buyer_email VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  contact VARCHAR(50) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Placed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order Items Table
CREATE TABLE order_items (
  id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  restaurant_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT DEFAULT 1,
  image VARCHAR(255),
  PRIMARY KEY (id),
  KEY (order_id),
  CONSTRAINT order_items_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ;

-- Notifications Table

CREATE TABLE notifications (
  id INT NOT NULL AUTO_INCREMENT,
  restaurant_name VARCHAR(100) NOT NULL,
  message VARCHAR(255) NOT NULL,
  is_read TINYINT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ;
