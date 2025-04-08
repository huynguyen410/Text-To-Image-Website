-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2025 at 03:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `imagegenerator`
--

-- --------------------------------------------------------

--
-- Table structure for table `gmail_token`
--

CREATE TABLE `gmail_token` (
  `id` int(11) NOT NULL,
  `access_token` varchar(500) NOT NULL,
  `refresh_token` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gmail_tokens`
--

CREATE TABLE `gmail_tokens` (
  `id` int(11) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `expires_in` int(11) NOT NULL COMMENT 'Thời gian sống của access token (giây)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo token',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật token'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `image_history`
--

CREATE TABLE `image_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `prompt` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `style` varchar(50) DEFAULT NULL,
  `model` varchar(50) NOT NULL,
  `creation_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `image_history`
--

INSERT INTO `image_history` (`id`, `user_id`, `prompt`, `image_url`, `created_at`, `style`, `model`, `creation_id`) VALUES
(121, 1, ', A mysterious elf with pointy ears', '/Text-To-Image-Website/images/67c2ad2d5e528.jpg', '2025-03-01 06:46:05', 'realistic', 'stabilityai/stable-diffusion-3.5-large', ''),
(122, 1, ', A mysterious elf with pointy ears', '/Text-To-Image-Website/images/67c2ad8091d3e.jpg', '2025-03-01 06:47:28', 'realistic', 'stabilityai/stable-diffusion-3.5-large', ''),
(123, 1, ', A cute and cuddly panda bear', '/Text-To-Image-Website/images/67c2adeeb7db2.jpg', '2025-03-01 06:49:18', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2adeeb7f0f'),
(124, 1, ', A cute and cuddly panda bear', '/Text-To-Image-Website/images/67c2ae05b44b5.jpg', '2025-03-01 06:49:41', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2ae05b4608'),
(125, 1, ', A cute and cuddly panda bear', '/Text-To-Image-Website/images/67c2ae1921abd.jpg', '2025-03-01 06:50:01', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2ae1921bdd'),
(126, 1, ', A cute and cuddly panda bear', '/Text-To-Image-Website/images/67c2ae3aaaa0d.jpg', '2025-03-01 06:50:34', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2ae3aaab5e'),
(127, 1, ', A majestic mountain range', '/Text-To-Image-Website/images/67c2ae8e0d438.jpg', '2025-03-01 06:51:58', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2ae8e0d720'),
(128, 1, ', A majestic mountain range', '/Text-To-Image-Website/images/67c2aecd8e590.jpg', '2025-03-01 06:53:01', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2aecd8e71c'),
(132, 2, 'dog', '/Text-To-Image-Website/images/67ce843ca3355.jpg', '2025-03-10 06:18:36', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce843ca34bd'),
(133, 2, 'Background: 123, Character: 123, Hairstyle: 123, Skin Color: 123, ', '/Text-To-Image-Website/images/67ce920de2249.jpg', '2025-03-10 07:17:33', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce920de2385'),
(134, 2, 'Background: 123, Character: 123, Hairstyle: 123, Skin Color: 123, ', '/Text-To-Image-Website/images/67ce92270f563.jpg', '2025-03-10 07:17:59', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce92270f6e4'),
(135, 2, 'Background: 123, Character: 123, Hairstyle: 123, Skin Color: 123, ', '/Text-To-Image-Website/images/67ce923a3ba14.jpg', '2025-03-10 07:18:18', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce923a3bba4'),
(136, 2, 'Background: 123, Character: 123, Hairstyle: 123, Skin Color: 123, ', '/Text-To-Image-Website/images/67ce924d7ba7e.jpg', '2025-03-10 07:18:37', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce924d7bcf9'),
(137, 2, 'Background: Mountain, Character: Elf, Hairstyle: Long hair, Skin Color: Dark, ', '/Text-To-Image-Website/images/67ce96274bf2a.jpg', '2025-03-10 07:35:03', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce96274c087'),
(138, 2, 'Background: Mountain, Character: Elf, Hairstyle: Long hair, Skin Color: Dark, ', '/Text-To-Image-Website/images/67ce9687177a7.jpg', '2025-03-10 07:36:39', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce96871793e'),
(139, 2, 'Background: Mountain, Character: Elf, Hairstyle: Long hair, Skin Color: Dark, ', '/Text-To-Image-Website/images/67ce96a3219c5.jpg', '2025-03-10 07:37:07', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce96a321b5a'),
(140, 2, 'Background: Mountain, Character: Elf, Hairstyle: Long hair, Skin Color: Dark, ', '/Text-To-Image-Website/images/67ce96c16db54.jpg', '2025-03-10 07:37:37', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce96c16ddce'),
(155, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d943e9564b7.jpg', '2025-03-18 09:59:05', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d943e9588ea'),
(156, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d943ea28eb8.jpg', '2025-03-18 09:59:06', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d943ea2aeda'),
(157, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d943eacb1dc.jpg', '2025-03-18 09:59:06', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d943eacd1f0'),
(158, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d943f3dac7d.jpg', '2025-03-18 09:59:15', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d943f3dcd65'),
(159, 160, 'dog', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d9441b99609.jpg', '2025-03-18 09:59:55', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d9441b9c51c'),
(160, 160, 'dog', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944a06ab85.jpg', '2025-03-18 10:02:08', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944a06bc1d'),
(161, 160, 'dog', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944a824c4c.jpg', '2025-03-18 10:02:16', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944a825f51'),
(162, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944c59cfa5.jpg', '2025-03-18 10:02:45', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944c59df89'),
(163, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944c660e57.jpg', '2025-03-18 10:02:46', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944c661ebd'),
(164, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944c711408.jpg', '2025-03-18 10:02:47', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944c7125ff'),
(165, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944c7ec26d.jpg', '2025-03-18 10:02:47', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944c7ed488'),
(166, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944ca396ba.jpg', '2025-03-18 10:02:50', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944ca3a568'),
(167, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944cb25940.jpg', '2025-03-18 10:02:51', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944cb26864'),
(168, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944cbc50f1.jpg', '2025-03-18 10:02:51', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944cbc5c99'),
(169, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944ccc3b47.jpg', '2025-03-18 10:02:52', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944ccc4864'),
(170, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944d83e28d.jpg', '2025-03-18 10:03:04', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944d83f118'),
(171, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944d924d71.jpg', '2025-03-18 10:03:05', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944d925f75'),
(172, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944d9c9836.jpg', '2025-03-18 10:03:05', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944d9ca792'),
(173, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944dade722.jpg', '2025-03-18 10:03:06', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944dadfb49');

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoice_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `customer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`invoice_id`, `total_price`, `created_at`, `customer_id`) VALUES
(8, 39000.00, '2025-04-08 12:38:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `models`
--

CREATE TABLE `models` (
  `id` int(11) NOT NULL,
  `model_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `models`
--

INSERT INTO `models` (`id`, `model_id`, `name`, `description`, `status`, `created_at`) VALUES
(1, 'stabilityai/stable-diffusion-3.5-large', 'Stable Diffusion 3.5', 'General purpose, high quality image generation.', 'active', '2025-03-10 08:31:21'),
(2, 'black-forest-labs/FLUX.1-dev', 'Flux1', 'A model specializing in abstract and surreal imagery.', 'active', '2025-03-10 08:31:21'),
(3, 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', 'Flux-Midjourney', 'Combines the aesthetics of Flux with Midjourney\'s style.', 'active', '2025-03-10 08:31:21'),
(10, 'af3', 'Nguyen Huu Duc', '2fs', 'active', '2025-03-18 07:59:01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('admin','customer') DEFAULT 'customer',
  `image_quota` int(11) NOT NULL DEFAULT 20,
  `isPremium` enum('yes','no') NOT NULL DEFAULT 'no',
  `startPremium` date DEFAULT NULL,
  `endPremium` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `created_at`, `role`, `image_quota`, `isPremium`, `startPremium`, `endPremium`) VALUES
(1, 'huy410', '$2y$10$wHbHox0Iy1yHh9mww1Ov9uNmrTqgWDgtLCPioz/iDcNbVJOY6kX6q', 'jkluio4110@gmail.com', '2025-02-25 15:27:06', 'customer', 20, 'yes', NULL, NULL),
(2, 'testt', '$2y$10$1gABQrMYSEpJhNaeJTFM6uUSZlDqvZNlsJUZLG4w5zo4Y2pSXVL9i', 'huyasd410@gmail.com', '2025-02-28 12:58:25', 'customer', 20, 'yes', '0000-00-00', NULL),
(151, 'abv', '$2y$10$J2dESEyGVF.O3dFDBvKVCORuDGuBtfMOQWb/XC2Fn9R.x/gJP3JAO', 'nnguyenhxxccxcxuuducc@gmail.com', '2025-03-18 07:51:28', 'customer', 20, 'no', NULL, NULL),
(155, 'agd', '$2y$10$MVWalBAqvyZuWimHJDqFsuzApKZOxGUf99eG4e8llq.kWjN58CFyO', 'nnguyenhuzzzuducc@gmail.com', '2025-03-18 07:51:54', 'customer', 20, 'no', NULL, NULL),
(156, 'admin', '$2y$10$E1BR1cnzs.qnlhJDnTfkPuLm4oraqd5./CJvTSZGL3e3.RDiG00I.', 'nngaaauyenhuuducc@gmail.com', '2025-03-18 07:57:16', 'admin', 99999, 'yes', NULL, NULL),
(158, 'a', '$2y$10$3qWP8MT1axe6yjkei4/bWe4WwyBzAiK.FgsabySwVbFr4qxEVV6eW', 'nnguyenzhuuducc@gmail.com', '2025-03-18 07:58:08', 'customer', 20, 'no', NULL, NULL),
(159, 'ag', '$2y$10$Uw1Ue67W94ZwMbyCOHuO9uiLuOwbMyPm8D7mF1qfwtzrbhd9PT8W6', 'nnguyenhsuuducc@gmail.com', '2025-03-18 08:02:28', 'customer', 20, 'no', NULL, NULL),
(160, 'duc', '$2y$10$PQrVdXFli/qTmcF9qp/uSeYo6RPtHeTwVvnTIKUcI0aPJPzn20/yO', 'nnguyenhuuduzcc@gmail.com', '2025-03-18 08:10:13', 'customer', 0, 'yes', NULL, NULL),
(172, 'aa', '$2y$10$OloJpkZPIv7WkTZ53BXFTOOAr/l38LQQiYlBdr5p/KySDw0Vlvks6', 'nnguyenhuauducc@gmail.com', '2025-03-19 01:45:43', 'customer', 20, 'yes', NULL, NULL),
(173, 'abd', '$2y$10$Ujxn/IOrsO1IJOz5cMVTUe2U9K7dtJTRZDxsPH3IL6ta7.YDtrQAa', 'nnguyenhuusducc@gmail.com', '2025-03-19 02:08:06', 'customer', 20, 'no', NULL, NULL),
(174, 'testnondk', '$2y$10$OISToxdJRFLLxcx6DdOirud8/9w6AJdaDtAUZPt2dfQXBVFGSTOGC', 'ada@gmail.com', '2025-03-22 02:52:34', 'customer', 20, 'no', NULL, NULL),
(175, 'kodk', '$2y$10$coGM1wLLb7w8bwk65ngVV.FY3bIAe9wBQC7lAWp3Lz6BlN8lPCfjG', 'nnguyenhuzzuducc@gmail.comz', '2025-03-22 03:03:05', 'customer', 20, 'yes', NULL, NULL),
(176, 'nodk', '$2y$10$DxeoA1PV0G6FRdbylZ8WY.59FgH99jB/R.oNzOyGKbepKpAYCtLpa', 'nnguyenhuudzucc@gmail.com', '2025-03-24 04:29:46', 'customer', 20, 'yes', NULL, NULL),
(188, 'z', '$2y$10$uhQfZkFC/14FcpZDRtz/yeBHbgOZwwiUpit5xB.mwQLGkAzazX8L2', 'nnguyenhauuducc@gmail.com', '2025-03-24 09:08:12', 'customer', 20, 'no', NULL, NULL),
(189, 'k', '$2y$10$fiouGJdLqhk8LTbtccqQjOyHcKUHjjMCiyZvC2Z.JCkF8tsuJ2CPO', 'nnguyenhuuzducc@gmail.com', '2025-03-24 09:08:30', 'customer', 20, 'yes', '2025-03-24', '2025-03-25'),
(190, 'zz', '$2y$10$S40osum3eZK.72SCe1l77.98p/pckVnztKA.gLn/GKg3.soYq8cTi', 'nnguyenhzzuuducc@gmail.com', '2025-03-24 09:15:55', 'customer', 20, 'yes', '2025-03-24', '2025-03-25'),
(191, 'za', '$2y$10$YNFYeYXJVzAEtJew2NG3P.WBXNJOOYiLMiXDfQeUzLnKlM7GCcRqa', 'nnguyenhzquuducc@gmail.com', '2025-03-24 09:21:26', 'customer', 20, 'no', '2025-03-24', '2025-03-04'),
(192, 'zb', '$2y$10$ZTdiaZnJ5TB4JmheRpDXQe5MfmKIb9lTlu762VAgZlu0PhtjJ6Sd.', 'nnguyenhuuzbducc@gmail.com', '2025-03-24 09:29:38', 'customer', 20, 'no', '2025-03-24', '2025-03-23'),
(193, 'zza', '$2y$10$bNsvS7o/0L.yArFVUYIRzuQ9Kj4lbUjJnmGX7EH5mi0aUS6R9hKVy', 'nnguyenhuzzauducc@gmail.com', '2025-03-24 09:46:48', 'customer', 20, 'no', NULL, NULL),
(194, 'zka', '$2y$10$lM/Kx5e0yiRsunlywVxeKOj8wpIKCJZRhF0YRkSQshTb.x56USzSS', 'nnguyenzzzhuuducc@gmail.com', '2025-03-24 09:48:17', 'customer', 20, 'yes', '2025-03-24', '2025-02-01'),
(195, 'abc', '$2y$10$pNWi7tMpVfCM5l4lJHw0Y.RQzcFym8FR1epJeyKean8UQP9o.wD.i', 'nnguyenhzuuducc@gmail.com', '2025-03-24 10:17:08', 'customer', 20, 'yes', '2025-03-24', '2025-04-24'),
(196, 'testdk', '$2y$10$HoqAQ/a7F8XSAboyTlnYfOf0l1eJ1xe2WIH0b1/Np7JzmNKov34k6', 'nnguyenhuuducc@gmail.com', '2025-03-25 03:34:51', 'customer', 20, 'no', NULL, NULL),
(213, 'zzz', '$2y$10$JXtIOWJB6b9iTqFMKIc7aOcUQPRUdxo5/K5LBnHjLZcdZo4sN9Rwe', 'nnguyenhuzvvuducc@gmail.com', '2025-03-25 03:54:37', 'customer', 20, 'yes', '2025-03-25', '2025-06-25'),
(228, 'adaa', '$2y$10$4xCGkXNm4WCPmxybuot4yuXzS.AK6gttGMa1FcVwUys/nDrGUkGsC', 'nnguyenhuuduaaaacc@gmail.com', '2025-03-25 04:38:44', 'customer', 20, 'no', NULL, NULL),
(229, 'zzb', '$2y$10$2lIpCepDXYYUB/8uTo7DJehAEoSC7rtSKu06OaOSce2rIXyaJoeJq', 'nnguyenzzuuducc@gmail.com', '2025-03-25 06:25:36', 'customer', 20, 'no', '2025-03-25', '2025-02-13'),
(230, 'az1', '$2y$10$QqoEi4f3NGsy/cEiy91pH.rIsQVa9RZ.iaqTMzlynZRzREnDGCrO.', 'nnguyenhzzzuuducc@gmail.com', '2025-03-26 02:49:57', 'customer', 20, 'yes', '2025-03-12', '2025-06-26'),
(231, 'zbe', '$2y$10$8YHxK/lTG5I9NQGttK4/V.mxLWm9TpOnktEWxzGKmfCtZbWZ7gs0K', 'nnguyenhudsuducc@gmail.com', '2025-03-26 02:56:18', 'customer', 20, 'no', NULL, NULL),
(232, 'acb', '$2y$10$6BKXB4GYLPDLuunvGTjbC.Ey7gIZUh4Yayc570MSK8ui5eVR9JMFe', 'nnguyenhuudducc@gmail.com', '2025-03-26 03:06:59', 'customer', 20, 'no', NULL, NULL),
(234, 'test2003', '$2y$10$QVrfaapP.CyaKCYTexbfR.dZ2wluRBW6c6mQuRv7hrz35dX4WP532', 'test2003@gmail.com', '2025-04-08 13:37:59', 'customer', 20, 'no', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gmail_token`
--
ALTER TABLE `gmail_token`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gmail_tokens`
--
ALTER TABLE `gmail_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `image_history`
--
ALTER TABLE `image_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`invoice_id`),
  ADD KEY `fk_customer_id` (`customer_id`);

--
-- Indexes for table `models`
--
ALTER TABLE `models`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `model_id` (`model_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `gmail_token`
--
ALTER TABLE `gmail_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `gmail_tokens`
--
ALTER TABLE `gmail_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `image_history`
--
ALTER TABLE `image_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `models`
--
ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=235;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `image_history`
--
ALTER TABLE `image_history`
  ADD CONSTRAINT `image_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
