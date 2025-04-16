-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2025 at 04:47 AM
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
-- Table structure for table `gmail_credentials`
--

CREATE TABLE `gmail_credentials` (
  `id` int(11) NOT NULL,
  `credential_key` varchar(50) NOT NULL DEFAULT 'main_refresh_token',
  `refresh_token` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gmail_credentials`
--

INSERT INTO `gmail_credentials` (`id`, `credential_key`, `refresh_token`, `updated_at`) VALUES
(1, 'main_refresh_token', '1//0eakGcIXmu1naCgYIARAAGA4SNwF-L9IrbcxK1tZTTDpxYI6dCSckbVYdKxnEcL0OmcYRsYeRgR6d9JgS_ZyQpZv9ndv8Le6OVy8', '2025-04-14 14:51:38');

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
  `model_identifier_snapshot` varchar(255) DEFAULT NULL,
  `creation_id` varchar(255) NOT NULL,
  `model_id_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `image_history`
--

INSERT INTO `image_history` (`id`, `user_id`, `prompt`, `image_url`, `created_at`, `style`, `model_identifier_snapshot`, `creation_id`, `model_id_fk`) VALUES
(121, 1, ', A mysterious elf with pointy ears', '/Text-To-Image-Website/images/67c2ad2d5e528.jpg', '2025-03-01 06:46:05', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(122, 1, ', A mysterious elf with pointy ears', '/Text-To-Image-Website/images/67c2ad8091d3e.jpg', '2025-03-01 06:47:28', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(123, 1, ', A cute and cuddly panda bear', '/Text-To-Image-Website/images/67c2adeeb7db2.jpg', '2025-03-01 06:49:18', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2adeeb7f0f', 1),
(124, 1, ', A cute and cuddly panda bear', '/Text-To-Image-Website/images/67c2ae05b44b5.jpg', '2025-03-01 06:49:41', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2ae05b4608', 1),
(125, 1, ', A cute and cuddly panda bear', '/Text-To-Image-Website/images/67c2ae1921abd.jpg', '2025-03-01 06:50:01', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2ae1921bdd', 1),
(126, 1, ', A cute and cuddly panda bear', '/Text-To-Image-Website/images/67c2ae3aaaa0d.jpg', '2025-03-01 06:50:34', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2ae3aaab5e', 1),
(127, 1, ', A majestic mountain range', '/Text-To-Image-Website/images/67c2ae8e0d438.jpg', '2025-03-01 06:51:58', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2ae8e0d720', 1),
(128, 1, ', A majestic mountain range', '/Text-To-Image-Website/images/67c2aecd8e590.jpg', '2025-03-01 06:53:01', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67c2aecd8e71c', 1),
(132, 2, 'dog', '/Text-To-Image-Website/images/67ce843ca3355.jpg', '2025-03-10 06:18:36', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce843ca34bd', 1),
(133, 2, 'Background: 123, Character: 123, Hairstyle: 123, Skin Color: 123, ', '/Text-To-Image-Website/images/67ce920de2249.jpg', '2025-03-10 07:17:33', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce920de2385', 1),
(134, 2, 'Background: 123, Character: 123, Hairstyle: 123, Skin Color: 123, ', '/Text-To-Image-Website/images/67ce92270f563.jpg', '2025-03-10 07:17:59', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce92270f6e4', 1),
(135, 2, 'Background: 123, Character: 123, Hairstyle: 123, Skin Color: 123, ', '/Text-To-Image-Website/images/67ce923a3ba14.jpg', '2025-03-10 07:18:18', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce923a3bba4', 1),
(136, 2, 'Background: 123, Character: 123, Hairstyle: 123, Skin Color: 123, ', '/Text-To-Image-Website/images/67ce924d7ba7e.jpg', '2025-03-10 07:18:37', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce924d7bcf9', 1),
(137, 2, 'Background: Mountain, Character: Elf, Hairstyle: Long hair, Skin Color: Dark, ', '/Text-To-Image-Website/images/67ce96274bf2a.jpg', '2025-03-10 07:35:03', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce96274c087', 1),
(138, 2, 'Background: Mountain, Character: Elf, Hairstyle: Long hair, Skin Color: Dark, ', '/Text-To-Image-Website/images/67ce9687177a7.jpg', '2025-03-10 07:36:39', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce96871793e', 1),
(139, 2, 'Background: Mountain, Character: Elf, Hairstyle: Long hair, Skin Color: Dark, ', '/Text-To-Image-Website/images/67ce96a3219c5.jpg', '2025-03-10 07:37:07', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce96a321b5a', 1),
(140, 2, 'Background: Mountain, Character: Elf, Hairstyle: Long hair, Skin Color: Dark, ', '/Text-To-Image-Website/images/67ce96c16db54.jpg', '2025-03-10 07:37:37', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '67ce96c16ddce', 1),
(155, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d943e9564b7.jpg', '2025-03-18 09:59:05', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d943e9588ea', 2),
(156, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d943ea28eb8.jpg', '2025-03-18 09:59:06', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d943ea2aeda', 2),
(157, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d943eacb1dc.jpg', '2025-03-18 09:59:06', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d943eacd1f0', 2),
(158, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d943f3dac7d.jpg', '2025-03-18 09:59:15', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d943f3dcd65', 2),
(159, 160, 'dog', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d9441b99609.jpg', '2025-03-18 09:59:55', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d9441b9c51c', 2),
(160, 160, 'dog', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944a06ab85.jpg', '2025-03-18 10:02:08', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944a06bc1d', 2),
(161, 160, 'dog', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944a824c4c.jpg', '2025-03-18 10:02:16', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944a825f51', 2),
(162, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944c59cfa5.jpg', '2025-03-18 10:02:45', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944c59df89', 2),
(163, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944c660e57.jpg', '2025-03-18 10:02:46', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944c661ebd', 2),
(164, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944c711408.jpg', '2025-03-18 10:02:47', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944c7125ff', 2),
(165, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944c7ec26d.jpg', '2025-03-18 10:02:47', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944c7ed488', 2),
(166, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944ca396ba.jpg', '2025-03-18 10:02:50', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944ca3a568', 2),
(167, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944cb25940.jpg', '2025-03-18 10:02:51', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944cb26864', 2),
(168, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944cbc50f1.jpg', '2025-03-18 10:02:51', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944cbc5c99', 2),
(169, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944ccc3b47.jpg', '2025-03-18 10:02:52', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944ccc4864', 2),
(170, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944d83e28d.jpg', '2025-03-18 10:03:04', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944d83f118', 2),
(171, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944d924d71.jpg', '2025-03-18 10:03:05', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944d925f75', 2),
(172, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944d9c9836.jpg', '2025-03-18 10:03:05', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944d9ca792', 2),
(173, 160, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67d944dade722.jpg', '2025-03-18 10:03:06', 'realistic', 'black-forest-labs/FLUX.1-dev', '67d944dadfb49', 2),
(174, 237, 'cat red', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5c7c3a6859.jpg', '2025-04-09 01:05:07', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5c7c3aae92', 2),
(175, 237, 'cat red', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5c7f0aba96.jpg', '2025-04-09 01:05:52', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5c7f0aea82', 2),
(176, 237, 'cat red', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5c84304f4d.jpg', '2025-04-09 01:07:15', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5c84307387', 2),
(177, 237, 'cat red', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5c866e4e3c.jpg', '2025-04-09 01:07:50', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5c866e6ad1', 2),
(178, 237, 'cat red', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5c867d0e0e.jpg', '2025-04-09 01:07:51', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5c867d2975', 3),
(179, 237, 'cat red', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5c86920fc1.jpg', '2025-04-09 01:07:53', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5c86922633', 3),
(180, 237, 'cat red', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5c86a416dd.jpg', '2025-04-09 01:07:54', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5c86a42d76', 3),
(181, 237, 'cat red', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5c86b758a3.jpg', '2025-04-09 01:07:55', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5c86b78133', 3),
(182, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5c9a9a4b3e.jpg', '2025-04-09 01:13:13', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5c9a9a6d88', 2),
(183, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5ca1b06a87.jpg', '2025-04-09 01:15:07', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5ca1b08661', 2),
(184, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5ca34d6c39.jpg', '2025-04-09 01:15:32', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5ca34d894b', 2),
(185, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5ca74de546.jpg', '2025-04-09 01:16:36', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5ca74dfb42', 2),
(186, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cacd8591c.jpg', '2025-04-09 01:18:05', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cacd87e1e', 2),
(187, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5caceb38a5.jpg', '2025-04-09 01:18:06', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5caceb539a', 2),
(188, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cacfe83c2.jpg', '2025-04-09 01:18:07', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cacfea536', 2),
(189, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cad0f1d15.jpg', '2025-04-09 01:18:09', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cad0f4020', 2),
(190, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cad6d77f8.jpg', '2025-04-09 01:18:14', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cad6d9380', 2),
(191, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cad843d16.jpg', '2025-04-09 01:18:16', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cad8461d8', 2),
(192, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cad995fc9.jpg', '2025-04-09 01:18:17', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cad997f94', 2),
(193, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cadaeed57.jpg', '2025-04-09 01:18:18', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cadaf0705', 2),
(194, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cadcde1ae.jpg', '2025-04-09 01:18:20', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5cadcdfae8', 3),
(195, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cade32b6d.jpg', '2025-04-09 01:18:22', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5cade34a90', 3),
(196, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cadf84a94.jpg', '2025-04-09 01:18:23', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5cadf86371', 3),
(197, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cae0d0e41.jpg', '2025-04-09 01:18:24', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5cae0d2539', 3),
(198, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cb89bea82.jpg', '2025-04-09 01:21:13', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cb89c092f', 2),
(199, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cb8b03961.jpg', '2025-04-09 01:21:15', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cb8b054d4', 2),
(200, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cb8c29ae3.jpg', '2025-04-09 01:21:16', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cb8c2b767', 2),
(201, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cb8d1764e.jpg', '2025-04-09 01:21:17', 'realistic', 'black-forest-labs/FLUX.1-dev', '67f5cb8d1a26c', 2),
(202, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cb8e19e06.jpg', '2025-04-09 01:21:18', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5cb8e1c347', 3),
(203, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cb8f4c2de.jpg', '2025-04-09 01:21:19', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5cb8f4e791', 3),
(204, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cb905644f.jpg', '2025-04-09 01:21:20', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5cb9057dfd', 3),
(205, 237, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67f5cb913a694.jpg', '2025-04-09 01:21:21', 'realistic', 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', '67f5cb913cbfb', 3),
(206, 241, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67fe35cb2ed34.jpg', '2025-04-15 10:32:43', 'realistic', 'black-forest-labs/FLUX.1-dev', '67fe35cb3201d', 2),
(207, 241, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67fe35cee4fa6.jpg', '2025-04-15 10:32:46', 'realistic', 'black-forest-labs/FLUX.1-dev', '67fe35cee65cd', 2),
(208, 241, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67fe35d05963a.jpg', '2025-04-15 10:32:48', 'realistic', 'black-forest-labs/FLUX.1-dev', '67fe35d05a64d', 2),
(209, 241, 'cat', '/Text-To-Image-Website-main/Text-To-Image-Website/images/67fe35df3b5aa.jpg', '2025-04-15 10:33:03', 'realistic', 'black-forest-labs/FLUX.1-dev', '67fe35df3cad6', 2),
(210, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:06:13', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(211, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:06:13', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(212, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:06:13', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(213, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:06:13', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(214, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:08:00', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(215, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:08:00', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(216, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:08:00', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(217, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:08:00', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(218, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:13:27', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(219, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:13:27', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(220, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:13:27', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(221, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:13:28', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(222, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:14:01', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(223, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:14:01', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(224, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:14:01', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(225, 258, 'cat', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAQABAADASIAAhEB', '2025-04-16 02:14:01', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(226, 258, 'cat', '/Text-To-Image-Website/images/67ff12c5e0eab.jpg', '2025-04-16 02:15:33', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(227, 258, 'cat', '/Text-To-Image-Website/images/67ff12c5e6fad.jpg', '2025-04-16 02:15:33', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(228, 258, 'cat', '/Text-To-Image-Website/images/67ff12c5ee929.jpg', '2025-04-16 02:15:33', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(229, 258, 'cat', '/Text-To-Image-Website/images/67ff12c610739.jpg', '2025-04-16 02:15:34', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(230, 258, 'cat', '/Text-To-Image-Website/images/67ff1744ad7ee.jpg', '2025-04-16 02:34:44', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(231, 258, 'cat', '/Text-To-Image-Website/images/67ff175da9b13.jpg', '2025-04-16 02:35:09', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(232, 258, 'cat', '/Text-To-Image-Website/images/67ff17832a5dd.jpg', '2025-04-16 02:35:47', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(233, 258, 'cat', '/Text-To-Image-Website/images/67ff17a9dc0ce.jpg', '2025-04-16 02:36:25', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(234, 258, 'cat', '/Text-To-Image-Website/images/67ff17a9e57c6.jpg', '2025-04-16 02:36:25', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(235, 258, 'cat', '/Text-To-Image-Website/images/67ff17aa2774b.jpg', '2025-04-16 02:36:26', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(236, 258, 'cat', '/Text-To-Image-Website/images/67ff19d8379a5.jpg', '2025-04-16 02:45:44', 'realistic', 'stabilityai/stable-diffusion-xl-base-1.0', '', 15),
(237, 258, 'cat', '/Text-To-Image-Website/images/67ff19da9c6ca.jpg', '2025-04-16 02:45:46', 'realistic', 'stabilityai/stable-diffusion-xl-base-1.0', '', 15),
(238, 258, 'cat', '/Text-To-Image-Website/images/67ff19dd179e3.jpg', '2025-04-16 02:45:49', 'realistic', 'stabilityai/stable-diffusion-xl-base-1.0', '', 15),
(239, 258, 'cat', '/Text-To-Image-Website/images/67ff19f0d60dd.jpg', '2025-04-16 02:46:08', 'realistic', 'stabilityai/stable-diffusion-xl-base-1.0', '', 15),
(240, 258, 'cat', '/Text-To-Image-Website/images/67ff19f0e9950.jpg', '2025-04-16 02:46:08', 'realistic', 'stabilityai/stable-diffusion-xl-base-1.0', '', 15),
(241, 258, 'cat', '/Text-To-Image-Website/images/67ff19f0f0398.jpg', '2025-04-16 02:46:08', 'realistic', 'stabilityai/stable-diffusion-xl-base-1.0', '', 15),
(242, 258, 'cat', '/Text-To-Image-Website/images/67ff19f140363.jpg', '2025-04-16 02:46:09', 'realistic', 'stabilityai/stable-diffusion-xl-base-1.0', '', 15);

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `invoice_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `customer_id` int(11) DEFAULT NULL,
  `customer_username` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`invoice_id`, `total_price`, `created_at`, `customer_id`, `customer_username`) VALUES
(9, 39000.00, '2025-04-09 00:47:50', 236, 'zcc'),
(10, 39000.00, '2025-04-09 02:22:19', 238, 'test11'),
(11, 39000.00, '2025-04-14 08:39:49', 240, 'testnotest'),
(12, 39000.00, '2025-04-14 15:08:23', 241, 'testnotestt'),
(14, 39000.00, '2025-04-15 10:08:07', 252, 'testlancuoi');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `models`
--

INSERT INTO `models` (`id`, `model_id`, `name`, `description`, `status`, `created_at`, `deleted_at`) VALUES
(1, 'stabilityai/stable-diffusion-3.5-large', 'Stable Diffusion 3.5', 'General purpose, high quality image generation.', 'active', '2025-03-10 08:31:21', NULL),
(2, 'black-forest-labs/FLUX.1-dev', 'Flux1', 'A model specializing in abstract and surreal imagery.', 'active', '2025-03-10 08:31:21', NULL),
(3, 'strangerzonehf/Flux-Midjourney-Mix2-LoRA', 'Flux-Midjourney', 'Combines the aesthetics of Flux with Midjourney\'s style.', 'active', '2025-03-10 08:31:21', NULL),
(15, 'stabilityai/stable-diffusion-xl-base-1.0', 'stable-diffusion-xl-base-1.0', '', 'active', '2025-04-16 02:44:10', NULL),
(16, 'CompVis/stable-diffusion-v1-4', 'stable-diffusion-v1-4', '', 'active', '2025-04-16 02:44:37', NULL),
(17, 'cagliostrolab/animagine-xl-3.1', 'animagine-xl-3.1', '', 'active', '2025-04-16 02:44:55', NULL);

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
  `endPremium` date DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `created_at`, `role`, `image_quota`, `isPremium`, `startPremium`, `endPremium`, `deleted_at`) VALUES
(1, 'huy410', '$2y$10$wHbHox0Iy1yHh9mww1Ov9uNmrTqgWDgtLCPioz/iDcNbVJOY6kX6q', 'jkluio4110@gmail.com', '2025-02-25 15:27:06', 'customer', 20, 'yes', NULL, NULL, NULL),
(2, 'testt', '$2y$10$1gABQrMYSEpJhNaeJTFM6uUSZlDqvZNlsJUZLG4w5zo4Y2pSXVL9i', 'huyasd410@gmail.com', '2025-02-28 12:58:25', 'customer', 20, 'yes', '0000-00-00', NULL, NULL),
(151, 'abv', '$2y$10$J2dESEyGVF.O3dFDBvKVCORuDGuBtfMOQWb/XC2Fn9R.x/gJP3JAO', 'nnguyenhxxccxcxuuducc@gmail.com', '2025-03-18 07:51:28', 'customer', 20, 'no', NULL, NULL, NULL),
(155, 'agd', '$2y$10$MVWalBAqvyZuWimHJDqFsuzApKZOxGUf99eG4e8llq.kWjN58CFyO', 'nnguyenhuzzzuducc@gmail.com', '2025-03-18 07:51:54', 'customer', 20, 'no', NULL, NULL, NULL),
(156, 'admin', '$2y$10$E1BR1cnzs.qnlhJDnTfkPuLm4oraqd5./CJvTSZGL3e3.RDiG00I.', 'nngaaauyenhuuducc@gmail.com', '2025-03-18 07:57:16', 'admin', 99999, 'yes', NULL, NULL, NULL),
(158, 'a', '$2y$10$3qWP8MT1axe6yjkei4/bWe4WwyBzAiK.FgsabySwVbFr4qxEVV6eW', 'nnguyenzhuuducc@gmail.com', '2025-03-18 07:58:08', 'customer', 20, 'no', NULL, NULL, NULL),
(159, 'ag', '$2y$10$Uw1Ue67W94ZwMbyCOHuO9uiLuOwbMyPm8D7mF1qfwtzrbhd9PT8W6', 'nnguyenhsuuducc@gmail.com', '2025-03-18 08:02:28', 'customer', 20, 'no', NULL, NULL, NULL),
(160, 'duc', '$2y$10$PQrVdXFli/qTmcF9qp/uSeYo6RPtHeTwVvnTIKUcI0aPJPzn20/yO', 'nnguyenhuuduzcc@gmail.com', '2025-03-18 08:10:13', 'customer', 0, 'yes', NULL, NULL, NULL),
(172, 'aa', '$2y$10$OloJpkZPIv7WkTZ53BXFTOOAr/l38LQQiYlBdr5p/KySDw0Vlvks6', 'nnguyenhuauducc@gmail.com', '2025-03-19 01:45:43', 'customer', 20, 'yes', NULL, NULL, NULL),
(173, 'abd', '$2y$10$Ujxn/IOrsO1IJOz5cMVTUe2U9K7dtJTRZDxsPH3IL6ta7.YDtrQAa', 'nnguyenhuusducc@gmail.com', '2025-03-19 02:08:06', 'customer', 20, 'no', NULL, NULL, NULL),
(174, 'testnondk', '$2y$10$OISToxdJRFLLxcx6DdOirud8/9w6AJdaDtAUZPt2dfQXBVFGSTOGC', 'ada@gmail.com', '2025-03-22 02:52:34', 'customer', 20, 'no', NULL, NULL, NULL),
(175, 'kodk', '$2y$10$coGM1wLLb7w8bwk65ngVV.FY3bIAe9wBQC7lAWp3Lz6BlN8lPCfjG', 'nnguyenhuzzuducc@gmail.comz', '2025-03-22 03:03:05', 'customer', 20, 'yes', NULL, NULL, NULL),
(176, 'nodk', '$2y$10$DxeoA1PV0G6FRdbylZ8WY.59FgH99jB/R.oNzOyGKbepKpAYCtLpa', 'nnguyenhuudzucc@gmail.com', '2025-03-24 04:29:46', 'customer', 20, 'yes', NULL, NULL, NULL),
(188, 'z', '$2y$10$uhQfZkFC/14FcpZDRtz/yeBHbgOZwwiUpit5xB.mwQLGkAzazX8L2', 'nnguyenhauuducc@gmail.com', '2025-03-24 09:08:12', 'customer', 20, 'no', NULL, NULL, NULL),
(189, 'k', '$2y$10$fiouGJdLqhk8LTbtccqQjOyHcKUHjjMCiyZvC2Z.JCkF8tsuJ2CPO', 'nnguyenhuuzducc@gmail.com', '2025-03-24 09:08:30', 'customer', 20, 'yes', '2025-03-24', '2025-03-25', NULL),
(190, 'zz', '$2y$10$S40osum3eZK.72SCe1l77.98p/pckVnztKA.gLn/GKg3.soYq8cTi', 'nnguyenhzzuuducc@gmail.com', '2025-03-24 09:15:55', 'customer', 20, 'yes', '2025-03-24', '2025-03-25', NULL),
(191, 'za', '$2y$10$YNFYeYXJVzAEtJew2NG3P.WBXNJOOYiLMiXDfQeUzLnKlM7GCcRqa', 'nnguyenhzquuducc@gmail.com', '2025-03-24 09:21:26', 'customer', 20, 'no', '2025-03-24', '2025-03-04', NULL),
(192, 'zb', '$2y$10$ZTdiaZnJ5TB4JmheRpDXQe5MfmKIb9lTlu762VAgZlu0PhtjJ6Sd.', 'nnguyenhuuzbducc@gmail.com', '2025-03-24 09:29:38', 'customer', 20, 'no', '2025-03-24', '2025-03-23', NULL),
(193, 'zza', '$2y$10$bNsvS7o/0L.yArFVUYIRzuQ9Kj4lbUjJnmGX7EH5mi0aUS6R9hKVy', 'nnguyenhuzzauducc@gmail.com', '2025-03-24 09:46:48', 'customer', 20, 'no', NULL, NULL, NULL),
(194, 'zka', '$2y$10$lM/Kx5e0yiRsunlywVxeKOj8wpIKCJZRhF0YRkSQshTb.x56USzSS', 'nnguyenzzzhuuducc@gmail.com', '2025-03-24 09:48:17', 'customer', 20, 'yes', '2025-03-24', '2025-02-01', NULL),
(195, 'abc', '$2y$10$pNWi7tMpVfCM5l4lJHw0Y.RQzcFym8FR1epJeyKean8UQP9o.wD.i', 'nnguyenhzuuducc@gmail.com', '2025-03-24 10:17:08', 'customer', 20, 'yes', '2025-03-24', '2025-04-24', NULL),
(196, 'testdk', '$2y$10$HoqAQ/a7F8XSAboyTlnYfOf0l1eJ1xe2WIH0b1/Np7JzmNKov34k6', 'nnguyenhuuducc@gmail.com', '2025-03-25 03:34:51', 'customer', 20, 'no', NULL, NULL, NULL),
(213, 'zzz', '$2y$10$JXtIOWJB6b9iTqFMKIc7aOcUQPRUdxo5/K5LBnHjLZcdZo4sN9Rwe', 'nnguyenhuzvvuducc@gmail.com', '2025-03-25 03:54:37', 'customer', 20, 'yes', '2025-03-25', '2025-06-25', NULL),
(228, 'adaa', '$2y$10$4xCGkXNm4WCPmxybuot4yuXzS.AK6gttGMa1FcVwUys/nDrGUkGsC', 'nnguyenhuuduaaaacc@gmail.com', '2025-03-25 04:38:44', 'customer', 20, 'no', NULL, NULL, NULL),
(230, 'az1', '$2y$10$QqoEi4f3NGsy/cEiy91pH.rIsQVa9RZ.iaqTMzlynZRzREnDGCrO.', 'nnguyenhzzzuuducc@gmail.com', '2025-03-26 02:49:57', 'customer', 20, 'yes', '2025-03-12', '2025-06-26', '2025-04-16 01:51:22'),
(231, 'zbe', '$2y$10$8YHxK/lTG5I9NQGttK4/V.mxLWm9TpOnktEWxzGKmfCtZbWZ7gs0K', 'nnguyenhudsuducc@gmail.com', '2025-03-26 02:56:18', 'customer', 20, 'no', NULL, NULL, NULL),
(232, 'acb', '$2y$10$6BKXB4GYLPDLuunvGTjbC.Ey7gIZUh4Yayc570MSK8ui5eVR9JMFe', 'nnguyenhuudducc@gmail.com', '2025-03-26 03:06:59', 'customer', 20, 'no', NULL, NULL, NULL),
(234, 'test2003', '$2y$10$QVrfaapP.CyaKCYTexbfR.dZ2wluRBW6c6mQuRv7hrz35dX4WP532', 'test2003@gmail.com', '2025-04-08 13:37:59', 'customer', 19, 'no', NULL, NULL, NULL),
(235, 'zed123', '$2y$10$xT7Z2X76iJvzg0lQE7RYWueAlZpOCi4FIAlI/N2yefOSeHUGSvebS', 'zed123@gmail.com', '2025-04-09 00:42:06', 'customer', 20, 'no', NULL, NULL, NULL),
(236, 'zcc', '$2y$10$ZJPVbuH12Wnxic9U7JIU/egJVjJtNHnWa0oLHqdrNPWMP4WE./OyS', 'zzz@gmail.com', '2025-04-09 00:44:37', 'customer', 20, 'yes', '2025-04-09', '2025-05-09', NULL),
(237, 'zca123', '$2y$10$vING2NnqOjcHOaSXY1YC1eQYfq.35tRHeBKzEpS.kemkgOc.pEN3K', 'nnguyenhuudxczucc@gmail.com', '2025-04-09 01:04:25', 'customer', 13, 'no', NULL, NULL, NULL),
(238, 'test11', '$2y$10$luQCbb4mGmAM97fz7EFjTOUDsDnYXXGL96IRrkDN/alcgdVt.qksi', 'test@gmail.com', '2025-04-09 02:17:38', 'customer', 20, 'yes', '2025-04-09', '2025-05-09', NULL),
(239, 'test12', '$2y$10$LuiVwUGe931r9zyXRNryvOa52rwCS.F3U7EA23QFg6sfqmPiM3mKi', '', '2025-04-09 02:28:47', 'customer', 20, 'no', NULL, NULL, NULL),
(240, 'xicachao', '$2y$10$aLmejipFKcYcebG2h3OFZeiZdIAovAnBCMifg3nbm0xFHQ5Kr4BRe', 'nnguyenhuzuducc@gmail.com', '2025-04-12 04:42:53', 'customer', 18, 'yes', '2025-04-14', '2025-05-14', NULL),
(241, 'testnotestt', '$2y$10$Hath.MyWqoyzss33p7qSJehSf/40r7fI4YomUqjUAJ2A/Wsbhh8Gu', 'sf@gmail.com', '2025-04-14 08:46:48', 'customer', 20, 'yes', '2025-04-14', '2025-05-14', NULL),
(251, 'sdvv', '$2y$10$ohMvgFySseKaQBBXB74Bt.Xn/uqIO8Jy9qrNBjmDfeSaN7S7Ez4de', 'nnguyenhuuzzzducc@gmail.com', '2025-04-14 15:19:30', 'customer', 20, 'no', NULL, NULL, NULL),
(252, 'testlancuoi', '$2y$10$Bqwz0J00s5nin644Y20Em.vD5dHFib4xNKPGUMSLOwKPtZ3CLJjX2', 'nnguyenhuudzcucc@gmail.com', '2025-04-15 10:05:32', 'customer', 20, 'yes', '2025-04-15', '2025-05-15', '2025-04-15 10:10:10'),
(257, 'ced', '$2y$10$pN1U6x8Q8z7EK1f0aQAedebr56rMOMJGgf7f0WjhRz3V9nV2DSTEO', 'nnguyenhzuusdfdducc@gmail.com', '2025-04-15 16:52:07', 'customer', 19, 'no', NULL, NULL, NULL),
(258, 'd123', '$2y$10$5GPF8thDo0k0r3sodU85JuXfgLZqgKmuIU24Le0LQztBHiVhB61NC', 'nnguyenhxcvcvsuuducc@gmail.com', '2025-04-16 02:02:59', 'customer', 1, 'no', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gmail_credentials`
--
ALTER TABLE `gmail_credentials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `credential_key` (`credential_key`);

--
-- Indexes for table `image_history`
--
ALTER TABLE `image_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_image_history_model_id` (`model_identifier_snapshot`),
  ADD KEY `idx_model_id_fk` (`model_id_fk`);

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
  ADD UNIQUE KEY `model_id` (`model_id`),
  ADD KEY `idx_deleted_at` (`deleted_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_deleted_at` (`deleted_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `gmail_credentials`
--
ALTER TABLE `gmail_credentials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `image_history`
--
ALTER TABLE `image_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=243;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `models`
--
ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=259;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `image_history`
--
ALTER TABLE `image_history`
  ADD CONSTRAINT `fk_image_history_model` FOREIGN KEY (`model_id_fk`) REFERENCES `models` (`id`) ON UPDATE CASCADE,
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
