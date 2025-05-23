-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 23, 2025 at 06:32 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `plantdb`
--

-- --------------------------------------------------------
--
-- Table structure for table `plant_profiles`
--

-- Drop tables if they exist (respecting foreign key dependencies)
DROP TABLE IF EXISTS plant_sensor_data;
DROP TABLE IF EXISTS user_plants;
DROP TABLE IF EXISTS plant_profiles;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Plant profiles table (master plant data)
CREATE TABLE plant_profiles (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  min_percentage INT NOT NULL,
  max_percentage INT NOT NULL,
  min_sensor_output INT NOT NULL,
  max_sensor_output INT NOT NULL,
  min_temp DECIMAL(5,2) NOT NULL,
  max_temp DECIMAL(5,2) NOT NULL,
  light_requirement VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- User-specific plant records
CREATE TABLE user_plants (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  plant_type_id INT NOT NULL,
  min_sensor_output FLOAT NOT NULL,
  max_sensor_output FLOAT NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_user_id (user_id),
  INDEX idx_plant_type_id (plant_type_id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_plant_type FOREIGN KEY (plant_type_id) REFERENCES plant_profiles(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Sensor readings for each user plant
CREATE TABLE plant_sensor_data (
  id INT NOT NULL AUTO_INCREMENT,
  user_plant_id INT NOT NULL,
  moisture INT,
  temperature FLOAT,
  light_level INT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  humidity FLOAT,
  water_level FLOAT,
  PRIMARY KEY (id),
  INDEX idx_user_plant (user_plant_id),
  CONSTRAINT fk_user_plant FOREIGN KEY (user_plant_id) REFERENCES user_plants(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plant_profiles`
--

INSERT INTO `plant_profiles` (`id`, `name`, `min_percentage`, `max_percentage`, `min_sensor_output`, `max_sensor_output`, `min_temp`, `max_temp`, `light_requirement`) VALUES
(1, 'agave', 1, 20, 1, 205, 15.00, 27.00, 'full sun exposure'),
(2, 'astilbe', 41, 60, 419, 614, 15.00, 25.00, 'partial sun exposure'),
(3, 'cactus', 1, 40, 10, 409, 21.00, 90.00, 'full sun exposure'),
(4, 'catmint', 21, 40, 215, 409, 5.00, 35.00, 'full sun exposure'),
(5, 'daffodil', 21, 60, 215, 614, 3.00, 18.00, 'full sun exposure'),
(6, 'daylily', 21, 60, 215, 614, 10.00, 35.00, 'full sun exposure'),
(7, 'iris', 21, 60, 215, 614, 18.00, 29.00, 'full sun exposure'),
(8, 'lavender', 21, 40, 215, 409, 20.00, 30.00, 'full sun exposure'),
(9, 'lily', 21, 60, 215, 614, 18.00, 24.00, 'full sun exposure'),
(10, 'lobellia', 41, 80, 419, 818, 15.00, 24.00, 'full sun exposure'),
(11, 'lupine', 41, 60, 419, 614, 15.00, 24.00, 'full sun exposure'),
(12, 'marigold', 21, 40, 215, 409, 20.00, 38.00, 'full sun exposure'),
(13, 'meadow rue', 41, 80, 419, 818, 5.00, 32.00, 'full sun exposure'),
(14, 'pansy', 21, 60, 215, 614, 7.00, 18.00, 'partial sun exposure'),
(15, 'peony', 21, 60, 215, 614, 15.00, 21.00, 'full sun exposure'),
(16, 'petunia', 21, 40, 215, 409, 18.00, 24.00, 'full sun exposure'),
(17, 'poppy', 21, 40, 215, 409, 16.00, 20.00, 'full sun exposure'),
(18, 'rose', 21, 40, 215, 409, 18.00, 24.00, 'full sun exposure'),
(19, 'sedges', 21, 80, 215, 818, 5.00, 35.00, 'partial sun exposure'),
(20, 'tulip', 21, 60, 215, 614, 12.00, 18.00, 'full sun exposure'),
(21, 'magnolia', 21, 40, 215, 409, 15.00, 30.00, 'partial sun exposure'),
(22, 'monstera', 40, 60, 409, 614, 18.00, 29.00, 'partial sun exposure'),
(23, 'pelargonium', 40, 70, 409, 716, 18.00, 24.00, 'partial sun exposure'),
(24, 'aloe vera', 40, 50, 409, 511, 13.00, 27.00, 'full sun exposure'),
(25, 'african violet', 20, 40, 204, 409, 16.00, 26.00, 'low sun exposure');

-- --------------------------------------------------------

--
-- Table structure for table `plant_recommendations`
--


DROP TABLE IF EXISTS `plant_recommendations`;
CREATE TABLE IF NOT EXISTS `plant_recommendations` (
  `plant_id` int NOT NULL,
  `recommendation` text COLLATE utf8mb4_general_ci NOT NULL,
  KEY `plant_id` (`plant_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plant_recommendations`
--

INSERT INTO `plant_recommendations` (`plant_id`, `recommendation`) VALUES
(23, 'Should not be in direct sunlight'),
(23, 'Cannot handle frost'),
(24, 'Once the plant is placed, you should wait two weeks before watering'),
(25, 'Use room temperature water as Saintpaulia roots are sensitive to temperature changes');

-- --------------------------------------------------------


