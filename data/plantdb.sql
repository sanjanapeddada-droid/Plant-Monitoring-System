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

DROP TABLE IF EXISTS `plant_profiles`;
CREATE TABLE IF NOT EXISTS `plant_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `min_percentage` int NOT NULL,
  `max_percentage` int NOT NULL,
  `min_sensor_output` int NOT NULL,
  `max_sensor_output` int NOT NULL,
  `min_temp` decimal(5,2) NOT NULL,
  `max_temp` decimal(5,2) NOT NULL,
  `light_requirement` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plant_profiles`
--

INSERT INTO `plant_profiles` (`id`, `name`, `min_percentage`, `max_percentage`, `min_sensor_output`, `max_sensor_output`, `min_temp`, `max_temp`, `light_requirement`) VALUES
(1, 'agave', 1, 20, 1, 205, 15.00, 27.00, 'full light exposure'),
(2, 'astilbe', 41, 60, 419, 614, 15.00, 25.00, 'partial shade'),
(3, 'cactus', 1, 40, 10, 409, 21.00, 90.00, 'full light exposure'),
(4, 'catmint', 21, 40, 215, 409, 5.00, 35.00, 'full sun exposure'),
(5, 'daffodil', 21, 60, 215, 614, 3.00, 18.00, 'full sun exposure'),
(6, 'daylily', 21, 60, 215, 614, 10.00, 35.00, 'full sun exposure'),
(7, 'iris', 21, 60, 215, 614, 18.00, 29.00, 'full sun exposure'),
(8, 'lavender', 21, 40, 215, 409, 20.00, 30.00, 'full sun exposure'),
(9, 'lily', 21, 60, 215, 614, 18.00, 24.00, 'full sun exposure'),
(10, 'lobellia', 41, 80, 419, 818, 15.00, 24.00, 'full sun exposure'),
(11, 'lupine', 41, 60, 419, 614, 15.00, 24.00, 'full sun exposure'),
(12, 'marigold', 21, 40, 215, 409, 20.00, 38.00, 'full sun exposure'),
(13, 'meadow rue', 41, 80, 419, 818, 5.00, 32.00, 'full sun exposure unless too high temperatures'),
(14, 'pansy', 21, 60, 215, 614, 7.00, 18.00, 'full or partial sun exposure'),
(15, 'peony', 21, 60, 215, 614, 15.00, 21.00, 'full sun exposure'),
(16, 'petunia', 21, 40, 215, 409, 18.00, 24.00, 'full sun exposure'),
(17, 'poppy', 21, 40, 215, 409, 16.00, 20.00, 'full sun exposure'),
(18, 'rose', 21, 40, 215, 409, 18.00, 24.00, 'full sun exposure'),
(19, 'sedges', 21, 80, 215, 818, 5.00, 35.00, 'partial sun exposure'),
(20, 'tulip', 21, 60, 215, 614, 12.00, 18.00, 'full sun exposure'),
(21, 'magnolia', 21, 40, 215, 409, 15.00, 30.00, 'full or partial sun exposure'),
(22, 'monstera', 40, 60, 409, 614, 18.00, 29.00, 'partial sun exposure'),
(23, 'pelargonium', 40, 70, 409, 716, 18.00, 24.00, 'partial sun exposure'),
(24, 'aloe vera', 40, 50, 409, 511, 13.00, 27.00, 'full sun exposure'),
(25, 'african violet', 20, 40, 204, 409, 16.00, 26.00, 'indirect sunlight');

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

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_plants`
--

DROP TABLE IF EXISTS `user_plants`;
CREATE TABLE IF NOT EXISTS `user_plants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `plant_type_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `plant_type_id` (`plant_type_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
