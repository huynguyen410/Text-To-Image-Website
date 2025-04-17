-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2025 at 02:37 AM
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
-- Database: `adminpanel`
--
CREATE DATABASE IF NOT EXISTS `adminpanel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `adminpanel`;

-- --------------------------------------------------------

--
-- Table structure for table `chitiet_hoadon`
--

CREATE TABLE `chitiet_hoadon` (
  `MA_HD` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MA_SP` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `GIA` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SOLUONG` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `chitiet_hoadon`
--

INSERT INTO `chitiet_hoadon` (`MA_HD`, `MA_SP`, `GIA`, `SOLUONG`) VALUES
('MEX', '12F5', '200000', '3'),
('Llg', '12F4', '330000', '1'),
('byl', '12F4', '330000', '1'),
('JYM', '12F4', '330000', '2'),
('JYM', '12F6', '200000', '1'),
('zr3', '12F5', '200000', '1'),
('RRU', '12F5', '200000', '1'),
('tKf', '12F4', '330000', '1'),
('vHO', 'FF4', '860000', '1'),
('LAN', '12F3', '200000', '1'),
('LAN', '12F5', '200000', '1'),
('LAN', '12F2', '200000', '1'),
('LAN', '34F2', '1300000', '1'),
('adf', '12F4', '330000', '1'),
('gpS', '12F4', '330000', '1'),
('OCV', '12F4', '330000', '1'),
('OCV', '12F5', '200000', '1'),
('OCV', '12F6', '200000', '1'),
('OCV', '34F2', '1300000', '1');

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
-- Table structure for table `hoadon`
--

CREATE TABLE `hoadon` (
  `MA_HD` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `NGAY_TAO_HD` datetime DEFAULT NULL,
  `USERNAME` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TEN_NGUOI_NHAN` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DIA_CHI_NHAN` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `THANH_TIEN` double NOT NULL,
  `TRANG_THAI` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `hoadon`
--

INSERT INTO `hoadon` (`MA_HD`, `NGAY_TAO_HD`, `USERNAME`, `TEN_NGUOI_NHAN`, `DIA_CHI_NHAN`, `THANH_TIEN`, `TRANG_THAI`) VALUES
('adf', '2024-11-26 08:46:22', 'asd', 'asdd', 'asdd', 330000, 1),
('byl', '2024-09-23 11:16:05', 'asd', 'asd', 'asd', 330000, 1),
('gpS', '2024-11-26 08:48:13', 'asd', 'asdd', 'asdd', 330000, 1),
('JYM', '2024-09-25 12:13:29', 'asd', 'asd', 'asd', 860000, 1),
('LAN', '2024-10-08 05:15:16', 'asd', 'asdd', 'asdd', 1900000, 1),
('Llg', '2024-09-23 11:16:00', 'asd', 'asd', 'asd', 330000, 1),
('MEX', '2024-09-23 11:15:54', 'asd', 'asd', 'asd', 600000, 1),
('OCV', '2024-11-26 09:03:12', 'asd', 'asdd', 'asdd', 2030000, 1),
('RRU', '2024-09-25 18:42:40', 'asd', 'asd', 'asd', 200000, 1),
('tKf', '2024-09-25 18:52:14', 'asd', 'asd', 'asd', 330000, 1),
('vHO', '2024-10-08 04:59:42', 'asd', 'asdd', 'asdd', 860000, 1),
('zr3', '2024-09-25 18:40:50', 'asd', 'asd', 'asd', 200000, 1);

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
-- Table structure for table `loai_sanpham`
--

CREATE TABLE `loai_sanpham` (
  `MA_LOAI` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TEN_LOAI` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CHI_TIET` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `loai_sanpham`
--

INSERT INTO `loai_sanpham` (`MA_LOAI`, `TEN_LOAI`, `CHI_TIET`) VALUES
('12F', 'Nón 1/2 Đầu', NULL),
('34F', 'Nón 3/4 Đầu', NULL),
('FF', 'Nón FULLFACE', NULL);

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
-- Table structure for table `sanpham`
--

CREATE TABLE `sanpham` (
  `MA_SP` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MA_LOAI` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `TEN_SP` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MAU` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `GIA` double NOT NULL,
  `SO_LUONG` int(11) NOT NULL,
  `TINH_TRANG_SP` tinyint(4) NOT NULL,
  `HINH_ANH` varchar(45) NOT NULL,
  `CHI_TIET` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `sanpham`
--

INSERT INTO `sanpham` (`MA_SP`, `MA_LOAI`, `TEN_SP`, `MAU`, `GIA`, `SO_LUONG`, `TINH_TRANG_SP`, `HINH_ANH`, `CHI_TIET`) VALUES
('12F1', '12F', 'MŨ NỬA ĐẦU SUNDA 135D ĐEN NHÁM', 'Đen', 350000, 27, 0, 'img/12F1.jpg', 'Công ty TNHH Longhuei với bề dày kinh nghiệm  gần 30 năm trong ngành nón, cơ sở hạ tầng hiện đại, quy trình kiểm nghiệm đạt chuẩn quốc tế. Hãng đã cho ra mắt nón bảo hiểm nửa đầu Sunda 135D Đen Nhám,  với mong muốn đáp ứng mọi kì vọng cho những khách hàng đang tìm cho mình một chiêc mũ bảo hiểm an toàn, tiện dụng.'),
('12F2', '12F', 'MŨ NỬA ĐẦU NAPOLI PUG VÀNG NGHỆ', 'Vàng', 200000, 29, 1, 'img/12F2.jpg', 'Napoli Pug là chiếc mũ bảo hiểm 1/2 dành riêng cho những bạn trẻ đang tìm cho mình một chiếc mũ cool ngầu, cá tính với vô vàn tùy biến theo sở thích cá nhân đi kèm mức giá không vô cùng hấp dẫn.'),
('12F3', '12F', 'MŨ NỬA ĐẦU NAPOLI PUG TRẮNG', 'Trắng', 200000, 2, 1, 'img/12F3.jpg', 'Napoli Pug là chiếc mũ bảo hiểm 1/2 dành riêng cho những bạn trẻ đang tìm cho mình một chiếc mũ cool ngầu, cá tính với vô vàn tùy biến theo sở thích cá nhân đi kèm mức giá không vô cùng hấp dẫn.'),
('12F4', '12F', 'MŨ NỬA ĐẦU ASIA MT-106K ĐEN NHÁM', 'Đen', 330000, 7, 1, 'img/12F4.jpg', 'ASIA MT-106K được sản xuất bởi công ty Á Châu. Nón thích hợp với những người yêu thích sự gọn nhẹ, thuận tiện cho những chuyến đi ngắn hay di chuyển trong đô thị.'),
('12F5', '12F', 'MŨ NỬA ĐẦU NAPOLI PUG ĐEN BÓNG', 'Đen', 200000, 9, 1, 'img/12F5.jpg', 'Napoli Pug là chiếc mũ bảo hiểm 1/2 dành riêng cho những bạn trẻ đang tìm cho mình một chiếc mũ cool ngầu, cá tính với vô vàn tùy biến theo sở thích cá nhân đi kèm mức giá không vô cùng hấp dẫn.'),
('12F6', '12F', 'MŨ NỬA ĐẦU NAPOLI PUG ĐEN NHÁM', 'Đen', 200000, 13, 1, 'img/12F6.jpg', 'Napoli Pug là chiếc mũ bảo hiểm 1/2 dành riêng cho những bạn trẻ đang tìm cho mình một chiếc mũ cool ngầu, cá tính với vô vàn tùy biến theo sở thích cá nhân đi kèm mức giá không vô cùng hấp dẫn.'),
('34F1', '34F', 'MŨ 3/4 ROYAL M787', 'Đen', 470000, 21, 1, 'img/34F1.jpg', 'Mũ bảo hiểm Royal M787 là mũ 3/4 một kính mới nhất của Royal Helmet, được thiết kế dựa theo khuôn của ROC 06 và YOHE 851 nhưng có giá thành rẻ hơn nhiều.'),
('34F2', '34F', 'MŨ 3/4 ZEUS 205 TRẮNG', 'Trắng', 1300000, 10, 0, 'img/34F2.jpg', 'Zeus 205 Trắng đến từ một thương hiệu trứ danh từ Đài Loan, chiếc mũ bảo hiểm mang trong mình tất cả những gì tinh túy nhất của hãng với thiết kế đẳng cấp cùng công nghệ tiên tiến nhất.'),
('34F3', '34F', 'MŨ 3/4 HAI KÍNH YOHE 852 ĐEN BÓNG', 'Đen', 1400000, 5, 1, 'img/34F3.jpg', 'Hòa cùng sự nhộn nhịp của thị trường mũ bảo hiểm cuối năm, Yohe cũng vừa kịp cho ra mắt sản phẩm mũ 3/4 mới mang mã Yohe 852. Liệu đây có phải là phiên bản nâng cấp của Yohe 851? Cùng điểm qua các chi tiết của chiếc mũ này nhé.'),
('34F4', '34F', 'MŨ 3/4 HAI KÍNH YOHE 852 ĐEN NHÁM', 'Đen', 1400000, 3, 1, 'img/34F4.jpg', 'Hòa cùng sự nhộn nhịp của thị trường mũ bảo hiểm cuối năm, Yohe cũng vừa kịp cho ra mắt sản phẩm mũ 3/4 mới mang mã Yohe 852. Liệu đây có phải là phiên bản nâng cấp của Yohe 851? Cùng điểm qua các chi tiết của chiếc mũ này nhé.'),
('34F5', '34F', 'MŨ 3/4 NAPOLI N189', 'Đen', 400000, 10, 1, 'img/34F5.jpg', 'Chất lượng sản phẩm đã được cục kiêm định chất lượng mũ bảo hiểm Việt Nam kiểm định, với thương hiệu NAPOLI đã được người tiêu dùng Việt Nam tin dùng nên khi người dùng lựa chọn mua sản phẩm này hoàn toàn có thể yên tâm về chất lượng sản phẩm.'),
('34F6', '34F', 'MŨ 3/4 HAI KÍNH YOHE 852 TRẮNG BÓNG', 'Trắng', 1400000, 6, 1, 'img/34F6.jpg', 'Yohe 852 được ra đời như là sự thay thế cho người đàn em Yohe 878 của Yohe Helmet tại thị trường Việt Nam. Với những tính năng được cải tiến hơn, form nón nhỏ gọn và hai ốp tai linh hoạt mềm mại hơn, Yohe 852 là đối thủ đáng gờm đối với dòng mũ 3/4 hai kính trong phân khúc hơn 1 triệu đồng.'),
('FF1', 'FF', 'MŨ FULLFACE ROC 03 TRẮNG BÓNG', 'Trắng', 1050000, 20, 1, 'img/FF1.jpg', 'Mũ bảo hiểm fullface Roc 03 là phiên bản được nâng cấp và cải tiến nhằm thay thế đàn em Roc M137. Vẫn là form nón nguyên bản, đuôi gió Pista quen thuộc nhưng được khoác lên mình bộ cánh mới với các mẫu tem cá tính và nổi bật hơn. Cùng với đó là nhưng cải tiến về chất liệu cũng như tính năng vốn đã rất tốt từ phiên bản trước.'),
('FF2', 'FF', 'MŨ FULLFACE ROYAL M141K VÀNG BÓNG', 'Vàng', 860000, 23, 1, 'img/FF2.jpg', 'Mũ bảo hiểm Royal M141K với kiểu dáng fullsize cùng phong cách Retro của những năm 60s của thế kỉ trước, rất phù hợp với những ai tìm kiếm sự hoài cổ. Royal M141K là sự tổng hòa của thiết kế cổ điển kết hợp với công nghệ hiện đại với đầy đủ yếu tố thời trang, phong cách cũng như đảm bảo an toàn cao nhất cho người đội.'),
('FF3', 'FF', 'MŨ FULLFACE ROYAL M141K ĐEN NHÁM', 'Đen', 860000, 10, 1, 'img/FF3.jpg', 'Mũ bảo hiểm Royal M141K với kiểu dáng fullsize cùng phong cách Retro của những năm 60s của thế kỉ trước, rất phù hợp với những ai tìm kiếm sự hoài cổ. Royal M141K là sự tổng hòa của thiết kế cổ điển kết hợp với công nghệ hiện đại với đầy đủ yếu tố thời trang, phong cách cũng như đảm bảo an toàn cao nhất cho người đội.'),
('FF4', 'FF', 'MŨ FULLFACE ROYAL M141K ĐEN BÓNG', 'Đen', 860000, 7, 1, 'img/FF4.jpg', 'Mũ Bảo Hiểm Fullface Vintage Royal M141K kính âm chắc chắn sẽ là một trong những dòng nón bảo hiểm sẽ làm thỏa mãn cho những người chơi xe theo phong cách cổ điển, giá thành và chất lượng hợp lý là lựa chọn hàng đầu.'),
('FF5', 'FF', 'MŨ FULLFACE ROYAL M266 HAI KÍNH', 'Đen', 620000, 6, 1, 'img/FF5.jpg', 'Mũ bảo hiểm Fullface Royal M266 2 Kính là sản phẩm của Royal Helmet – Thương hiệu cao cấp của Á Châu Group, nhà sản xuất mũ bảo hiểm hàng đầu Việt Nam với hơn 10 năm kinh nghiệm. Được làm từ nhựa ABS nguyên sinh, đạt chuẩn QCVN của Tổng Cục Tiêu Chuẩn Đo Lường Chất Lượng Việt Nam. Bảo hành chính hãng 2 năm.'),
('FF6', 'FF', 'MŨ FULLFACE ROC 05 ĐEN BÓNG', 'Đen', 1040000, 18, 1, 'img/FF6.jpg', 'ROC 05 được đánh giá là một trong những mẫu nón fullface hai kính đáng được sở hữu nhất trong phân khúc dưới 1 triệu đồng. Với thiết kế có những đường cong rất khác biệt so với các mẫu nón fullface khác dựa theo kiểu dáng của AGV K3SV – Thương hiệu mũ bảo hiểm hàng đầu thế giới.');

-- --------------------------------------------------------

--
-- Table structure for table `taikhoan`
--

CREATE TABLE `taikhoan` (
  `USERNAME` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `PASSWORD` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `NAME` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `PHONE_NUMBER` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `EMAIL` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ADDRESS` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ROLE` tinyint(4) NOT NULL,
  `STATUS` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `taikhoan`
--

INSERT INTO `taikhoan` (`USERNAME`, `PASSWORD`, `NAME`, `PHONE_NUMBER`, `EMAIL`, `ADDRESS`, `ROLE`, `STATUS`) VALUES
('1d', '$2y$10$/.ovEzRYeafn4JDdOpCZjuz0rlN83bfbxuDMglPbynSTBXkfCDIwG', 'duc', '0000000000', 'huuduc@gmail.com', '60 tân bình', 0, 1),
('21d', '$2y$10$N.MBp3wU7GjfAGVs6kPcpeE77g1V/PgVuiX5DyTSfZcCI2C/Rx4/m', 'sd', '0000000000', 'huuduc@gmail.com', '70 hoàn kiếm', 0, 1),
('ABC', '$2y$10$e5skoqaS97yj8RzrZ6aHOO8xzN/8mHyAobL6gv6qeweWxtDeIvX5K', 'ABCDEFG', '0939992757', 'bandFRokilam123456789@gmail.com', '58 Nhiêu Tâm Phường 5 quận 5 Hồ Chí Minh', 0, 1),
('abca', '$2y$10$kEZfDbJauoVRKXhgZtSlo.X1aVZhaV6mWBEdz6GcNgH7lo9wfnvMS', 'abca', '0392585822', 'nnguyenheuuducc@gmail.com', 'sdf', 0, 0),
('acb', '$2y$10$le2wEWRT/oDvW5RA8wtCd.4MVQjh23eazIuqpUgcAKY1IxxlYp2Hi', 'sd', '0392585825', 'sdfsdf@sdf', 'sd', 1, 1),
('adcVaybu', '$2y$10$DEWUeEogFu8OLezqWI0Dquilq80RKG/kspW/.E8Bd0Fey0Qie2kTe', 'adcVaybu123', '0000000000', 'ngufdwyenhuuduc@gmail.com', '58 Nhiêu Tâm Phường 5 quận 5 Hồ Chí Minh', 0, 1),
('admin', '$2y$10$wa6PFW92u0pBWAypHPCSC.6C14puU9800ibMcU4YAOfMVygZzEBcO', 'admin', '0388589911', 'admin@gmail.com', 'day la nha cua admin', 1, 0),
('asd', '$2y$10$2G0i3JbJvEaq/0/q2NWeUujcACHC29Vk98oG6jbvkwP2967vZ752q', 'asdd', '0593666785', 'asd@gmail.com', 'asdd', 0, 1),
('bandokilam', '$2y$10$AgQiuXqDudYZG7i3C85RzeUWRA9YGSU2z2rSWjmQvhxBrEWnZ5/bi', 'bandokilam', '0369992757', 'nnguyefsdnhuuducc@gmail.com', 'sdf', 0, 0),
('dd', '$2y$10$D7DhayzOM4WXK4z1txW9/O2omtz/FgnDPAm4B4wg93J1P26j4.puS', 'dd', '0388589911', 'dd@g', 'dd', 1, 0),
('duc', '$2y$10$mYCSEr8lCTbR9q1NgpSc5O4AGN5piBUviGOQFj7zYC1M8yDNiMzA6', 'duc', '0392585825', 'nnguyenhuuducc@gmail.com', 'sdf', 0, 1),
('dzksai', '$2y$10$hkjTBJUKXLHoIpE5UlWbMu3epp7dXcgpgvq31ApcLS8QgEppAXh0G', 'dzksai123', '0969992753', 'dsk@dsk', 'sdf', 0, 1),
('huudsdfdsfucne123', '$2y$10$K337eOZBe4pbY/LDIsDxSuroV3/OoF26fUeMHqIF5fV9dFfgZ8fh2', 'duc2403', '0392585822', 'nnguyenhuuducc@gmail.com', '58 Nhiêu Tâm Phường 5 quận 5 Hồ Chí Minh', 1, 1),
('huuducne123', '$2y$10$pZv.fVHlPeuWvgn2hZXEJuwxflyepgKRUk.eJx9cYq5CZj3NSFK8e', 'duc2403', '0969992757', 'huuduc@gmail.com', '58 Nhiêu Tâm Phường 5 quận 5 Hồ Chí Minh', 1, 1),
('loveyou', '$2y$10$OXK4g6iBdE6jIW3aCMRZLONTA0ZuPpn59broEnpqx6sdcM6/1.S1m', 'loveyou1', '0000000000', 'bandokilam123df456789@gmail.com', '58 Nhiêu Tâm Phường 5 quận 5 Hồ Chí Minh', 1, 1),
('sdfdsf', '$2y$10$y9nXnMmgjN/ZDsBXLvi64OjEmgL3JIt5azIj/j0cgiA9uD305UNmS', '1rfesd', '0969992757', 'adc@vayne', '23r2', 1, 1),
('taikhoantest', '$2y$10$srFa9s0knshFZwXVmterl.V669ZRZZtN/G2I0UPAUfDC14zYIGY5m', 'taikhoandungdetest', '1233212143', 'nnguyenhuudufdcc@gmail.com', '58 Nhiêu Tâm Phường 5 quận 5 Hồ Chí Minh', 0, 0);

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
-- Indexes for table `chitiet_hoadon`
--
ALTER TABLE `chitiet_hoadon`
  ADD KEY `MA_SP` (`MA_SP`),
  ADD KEY `MA_HD` (`MA_HD`);

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
-- Indexes for table `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`MA_HD`),
  ADD KEY `USERNAME` (`USERNAME`);

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
-- Indexes for table `loai_sanpham`
--
ALTER TABLE `loai_sanpham`
  ADD PRIMARY KEY (`MA_LOAI`);

--
-- Indexes for table `models`
--
ALTER TABLE `models`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `model_id` (`model_id`);

--
-- Indexes for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`MA_SP`),
  ADD KEY `MA_LOAI` (`MA_LOAI`);

--
-- Indexes for table `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`USERNAME`);

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
-- Constraints for table `chitiet_hoadon`
--
ALTER TABLE `chitiet_hoadon`
  ADD CONSTRAINT `chitiet_hoadon_ibfk_1` FOREIGN KEY (`MA_SP`) REFERENCES `sanpham` (`MA_SP`),
  ADD CONSTRAINT `chitiet_hoadon_ibfk_2` FOREIGN KEY (`MA_HD`) REFERENCES `hoadon` (`MA_HD`);

--
-- Constraints for table `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `hoadon_ibfk_1` FOREIGN KEY (`USERNAME`) REFERENCES `taikhoan` (`USERNAME`);

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

--
-- Constraints for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`MA_LOAI`) REFERENCES `loai_sanpham` (`MA_LOAI`),
  ADD CONSTRAINT `sanpham_ibfk_2` FOREIGN KEY (`MA_LOAI`) REFERENCES `loai_sanpham` (`MA_LOAI`),
  ADD CONSTRAINT `sanpham_ibfk_3` FOREIGN KEY (`MA_LOAI`) REFERENCES `loai_sanpham` (`MA_LOAI`);
--
-- Database: `article_app`
--
CREATE DATABASE IF NOT EXISTS `article_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `article_app`;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'D', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Database: `gmail_app`
--
CREATE DATABASE IF NOT EXISTS `gmail_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `gmail_app`;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `access_token` text DEFAULT NULL,
  `refresh_token` text DEFAULT NULL,
  `token_expiry` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `access_token`, `refresh_token`, `token_expiry`, `created_at`) VALUES
(4, '', 'ya29.a0AeXRPp5hONgtpxfzb063NXFKHFpWOOqvw-aX7YYR8kgL2_ITcMUyMPRfgrE94JMH8kEoT6AjreiibyXIv8tokiLWgKtijjOu-9dzt4BOQoKr_H6WU2HOth7870RsM9NW-eK7uTo6QXLjiOqMrJnQbddD9CRQXJE299ZY2gy-aCgYKAasSARISFQHGX2MirxWt0gU8ETne3ggoT5QJ3w0175', '1//0eutqP02XwqfNCgYIARAAGA4SNwF-L9IrDlyUNGZm4x5qYHAJZNCbKytLeGrly6rhQbQTbXhvVFVxQuC9uG9ws1VdLe4T5-oHels', 1743006664, '2025-03-26 15:19:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- Database: `imagegenerator`
--
CREATE DATABASE IF NOT EXISTS `imagegenerator` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `imagegenerator`;

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
(255, 267, 'a yellow cat ', '/Text-To-Image-Website/images/67ffc1bb45027.jpg', '2025-04-16 14:42:03', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(256, 267, 'a yellow cat ', '/Text-To-Image-Website/images/67ffc1ce2def2.jpg', '2025-04-16 14:42:22', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(257, 267, 'a yellow cat ', '/Text-To-Image-Website/images/67ffc1dd69abc.jpg', '2025-04-16 14:42:37', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(258, 267, 'cat', '/Text-To-Image-Website/images/67ffc20fa65dc.jpg', '2025-04-16 14:43:27', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(259, 267, 'cat', '/Text-To-Image-Website/images/67ffc20fa8d3d.jpg', '2025-04-16 14:43:27', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(260, 267, 'cat', '/Text-To-Image-Website/images/67ffc20fbe753.jpg', '2025-04-16 14:43:27', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(261, 267, 'cat', '/Text-To-Image-Website/images/67ffc20fd6e90.jpg', '2025-04-16 14:43:27', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(262, 268, 'cat', '/Text-To-Image-Website/images/67ffc3b9e6e77.jpg', '2025-04-16 14:50:33', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(263, 268, 'cat', '/Text-To-Image-Website/images/67ffc3b9eb576.jpg', '2025-04-16 14:50:33', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(264, 268, 'cat', '/Text-To-Image-Website/images/67ffc3ba000f0.jpg', '2025-04-16 14:50:34', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(265, 268, 'cat', '/Text-To-Image-Website/images/67ffc3ba10fcf.jpg', '2025-04-16 14:50:34', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(266, 268, 'Background: a garden, Hairstyle: short hair, Skin Color: black, ', '/Text-To-Image-Website/images/67ffc3f14db50.jpg', '2025-04-16 14:51:29', 'anime', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(267, 268, 'Background: a garden, Hairstyle: short hair, Skin Color: black, ', '/Text-To-Image-Website/images/67ffc3f1536ac.jpg', '2025-04-16 14:51:29', 'anime', 'black-forest-labs/FLUX.1-dev', '', 2),
(268, 268, 'Background: a garden, Hairstyle: short hair, Skin Color: black, ', '/Text-To-Image-Website/images/67ffc3f156d6e.jpg', '2025-04-16 14:51:29', 'anime', 'black-forest-labs/FLUX.1-dev', '', 2),
(269, 268, 'Background: a garden, Hairstyle: short hair, Skin Color: black, ', '/Text-To-Image-Website/images/67ffc3f83bf6d.jpg', '2025-04-16 14:51:36', 'anime', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(270, 268, 'Background: a garden, Hairstyle: short hair, Skin Color: black, ', '/Text-To-Image-Website/images/67ffc3fba5355.jpg', '2025-04-16 14:51:39', 'anime', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(271, 268, 'Background: a garden, Hairstyle: short hair, Skin Color: black, ', '/Text-To-Image-Website/images/67ffc40166e04.jpg', '2025-04-16 14:51:45', 'anime', 'black-forest-labs/FLUX.1-dev', '', 2),
(272, 268, 'Background: a garden, Hairstyle: short hair, Skin Color: black, ', '/Text-To-Image-Website/images/67ffc406cde10.jpg', '2025-04-16 14:51:50', 'anime', 'black-forest-labs/FLUX.1-dev', '', 2),
(273, 269, 'cat ', '/Text-To-Image-Website/images/67ffc4bd2587f.jpg', '2025-04-16 14:54:53', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(274, 269, 'cat ', '/Text-To-Image-Website/images/67ffc4bd27ec7.jpg', '2025-04-16 14:54:53', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(275, 269, 'cat ', '/Text-To-Image-Website/images/67ffc4bd2bb2f.jpg', '2025-04-16 14:54:53', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(276, 269, 'cat ', '/Text-To-Image-Website/images/67ffc4bdef5cc.jpg', '2025-04-16 14:54:53', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(277, 269, 'cat ', '/Text-To-Image-Website/images/67ffc4be619e6.jpg', '2025-04-16 14:54:54', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(278, 269, 'cat ', '/Text-To-Image-Website/images/67ffc4c17fca8.jpg', '2025-04-16 14:54:57', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(279, 269, 'cat ', '/Text-To-Image-Website/images/67ffc4c794763.jpg', '2025-04-16 14:55:03', 'realistic', 'stabilityai/stable-diffusion-3.5-large', '', 1),
(280, 270, 'cat', '/Text-To-Image-Website/images/67ffc5a76952c.jpg', '2025-04-16 14:58:47', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(281, 270, 'cat', '/Text-To-Image-Website/images/67ffc5a76c540.jpg', '2025-04-16 14:58:47', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(282, 270, 'cat', '/Text-To-Image-Website/images/67ffc5a771c0b.jpg', '2025-04-16 14:58:47', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(283, 270, 'cat', '/Text-To-Image-Website/images/67ffc5a810574.jpg', '2025-04-16 14:58:48', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(284, 270, 'Background: a garden, Hairstyle: yellow hair, Skin Color: black, ', '/Text-To-Image-Website/images/67ffc5dcf2b07.jpg', '2025-04-16 14:59:40', 'anime', 'black-forest-labs/FLUX.1-dev', '', 2),
(285, 270, 'cat', '/Text-To-Image-Website/images/67ffc63a477d8.jpg', '2025-04-16 15:01:14', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(286, 270, 'cat', '/Text-To-Image-Website/images/67ffc63a4b091.jpg', '2025-04-16 15:01:14', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(288, 273, 'cat', '/Text-To-Image-Website/images/67ffc9f323903.jpg', '2025-04-16 15:17:07', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(289, 273, 'cat', '/Text-To-Image-Website/images/67ffc9f351f51.jpg', '2025-04-16 15:17:07', 'realistic', 'black-forest-labs/FLUX.1-dev', '', 2),
(290, 273, 'Background: a garden, Hairstyle: yellow hair, Skin Color: black , ', '/Text-To-Image-Website/images/67ffca52d3b29.jpg', '2025-04-16 15:18:42', 'cartoon', 'black-forest-labs/FLUX.1-dev', '', 2),
(291, 282, 'cat', '/Text-To-Image-Website/images/67ffcda938b75.jpg', '2025-04-16 15:32:57', 'realistic', 'stabilityai/stable-diffusion-xl-base-1.0', '', 19);

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
(1, 39000.00, '2025-04-16 14:29:14', 26, 'duc1thang'),
(2, 99000.00, '2025-04-16 14:29:57', 27, 'duc6thang'),
(3, 39000.00, '2025-04-16 14:38:51', 28, 'ducdeptrai'),
(21, 39000.00, '2025-04-16 15:03:02', 270, 'dangkydemo'),
(22, 99000.00, '2025-04-16 15:20:29', 273, 'ducnguyenhuu');

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
(19, 'stabilityai/stable-diffusion-xl-base-1.0', 'stable-diffusion-xl-base-1.0', '', 'active', '2025-04-16 15:32:39', NULL);

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
(1, 'huy410', '$2y$10$wHbHox0Iy1yHh9mww1Ov9uNmrTqgWDgtLCPioz/iDcNbVJOY6kX6q', 'jkluio4110@gmail.com', '2025-02-25 15:27:06', 'customer', 20, 'yes', NULL, NULL, '2025-04-16 14:11:55'),
(2, 'testt', '$2y$10$1gABQrMYSEpJhNaeJTFM6uUSZlDqvZNlsJUZLG4w5zo4Y2pSXVL9i', 'huyasd410@gmail.com', '2025-02-28 12:58:25', 'customer', 20, 'yes', '0000-00-00', NULL, '2025-04-16 14:11:58'),
(3, 'ducdachinhsua', '$2y$10$J2dESEyGVF.O3dFDBvKVCORuDGuBtfMOQWb/XC2Fn9R.x/gJP3JAO', 'nnguyenhxxccxcxuuducc@gmail.com', '2025-03-18 07:51:28', 'customer', 20, 'no', NULL, NULL, '2025-04-16 15:09:56'),
(4, 'hoanghuy', '$2y$10$MVWalBAqvyZuWimHJDqFsuzApKZOxGUf99eG4e8llq.kWjN58CFyO', 'nnguyenhuzzzuducc@gmail.com', '2025-03-18 07:51:54', 'customer', 20, 'no', NULL, NULL, NULL),
(5, 'admin', '$2y$10$E1BR1cnzs.qnlhJDnTfkPuLm4oraqd5./CJvTSZGL3e3.RDiG00I.', 'nngaaauyenhuuducc@gmail.com', '2025-03-18 07:57:16', 'admin', 99999, 'yes', NULL, NULL, '2025-04-16 14:12:00'),
(6, 'a', '$2y$10$3qWP8MT1axe6yjkei4/bWe4WwyBzAiK.FgsabySwVbFr4qxEVV6eW', 'nnguyenzhuuducc@gmail.com', '2025-03-18 07:58:08', 'customer', 20, 'no', NULL, NULL, '2025-04-16 15:27:35'),
(7, 'nguyen huu duc', '$2y$10$Uw1Ue67W94ZwMbyCOHuO9uiLuOwbMyPm8D7mF1qfwtzrbhd9PT8W6', 'nnguyenhsuuducc@gmail.com', '2025-03-18 08:02:28', 'customer', 20, 'no', NULL, NULL, NULL),
(8, 'duc', '$2y$10$PQrVdXFli/qTmcF9qp/uSeYo6RPtHeTwVvnTIKUcI0aPJPzn20/yO', 'nnguyenhuuduzcc@gmail.com', '2025-03-18 08:10:13', 'customer', 0, 'yes', NULL, NULL, '2025-04-16 14:12:02'),
(9, 'aa', '$2y$10$OloJpkZPIv7WkTZ53BXFTOOAr/l38LQQiYlBdr5p/KySDw0Vlvks6', 'nnguyenhuauducc@gmail.com', '2025-03-19 01:45:43', 'customer', 20, 'yes', NULL, NULL, '2025-04-16 14:12:05'),
(10, 'abd', '$2y$10$Ujxn/IOrsO1IJOz5cMVTUe2U9K7dtJTRZDxsPH3IL6ta7.YDtrQAa', 'nnguyenhuusducc@gmail.com', '2025-03-19 02:08:06', 'customer', 20, 'no', NULL, NULL, '2025-04-16 15:29:28'),
(11, 'testdkk', '$2y$10$OISToxdJRFLLxcx6DdOirud8/9w6AJdaDtAUZPt2dfQXBVFGSTOGC', 'ada@gmail.com', '2025-03-22 02:52:34', 'customer', 20, 'no', NULL, NULL, NULL),
(12, 'kodk', '$2y$10$coGM1wLLb7w8bwk65ngVV.FY3bIAe9wBQC7lAWp3Lz6BlN8lPCfjG', 'nnguyenhuzzuducc@gmail.comz', '2025-03-22 03:03:05', 'customer', 20, 'yes', NULL, NULL, '2025-04-16 14:12:10'),
(13, 'nodk', '$2y$10$DxeoA1PV0G6FRdbylZ8WY.59FgH99jB/R.oNzOyGKbepKpAYCtLpa', 'nnguyenhuudzucc@gmail.com', '2025-03-24 04:29:46', 'customer', 20, 'yes', NULL, NULL, '2025-04-16 14:12:13'),
(14, 'z', '$2y$10$uhQfZkFC/14FcpZDRtz/yeBHbgOZwwiUpit5xB.mwQLGkAzazX8L2', 'nnguyenhauuducc@gmail.com', '2025-03-24 09:08:12', 'customer', 20, 'no', NULL, NULL, NULL),
(15, 'k', '$2y$10$fiouGJdLqhk8LTbtccqQjOyHcKUHjjMCiyZvC2Z.JCkF8tsuJ2CPO', 'nnguyenhuuzducc@gmail.com', '2025-03-24 09:08:30', 'customer', 20, 'yes', '2025-03-24', '2025-03-25', NULL),
(16, 'zz', '$2y$10$S40osum3eZK.72SCe1l77.98p/pckVnztKA.gLn/GKg3.soYq8cTi', 'nnguyenhzzuuducc@gmail.com', '2025-03-24 09:15:55', 'customer', 20, 'yes', '2025-03-24', '2025-03-25', NULL),
(17, 'za', '$2y$10$YNFYeYXJVzAEtJew2NG3P.WBXNJOOYiLMiXDfQeUzLnKlM7GCcRqa', 'nnguyenhzquuducc@gmail.com', '2025-03-24 09:21:26', 'customer', 20, 'no', '2025-03-24', '2025-03-04', NULL),
(18, 'zb', '$2y$10$ZTdiaZnJ5TB4JmheRpDXQe5MfmKIb9lTlu762VAgZlu0PhtjJ6Sd.', 'nnguyenhuuzbducc@gmail.com', '2025-03-24 09:29:38', 'customer', 20, 'no', '2025-03-24', '2025-03-23', NULL),
(19, 'zza', '$2y$10$bNsvS7o/0L.yArFVUYIRzuQ9Kj4lbUjJnmGX7EH5mi0aUS6R9hKVy', 'nnguyenhuzzauducc@gmail.com', '2025-03-24 09:46:48', 'customer', 20, 'no', NULL, NULL, NULL),
(20, 'zka', '$2y$10$lM/Kx5e0yiRsunlywVxeKOj8wpIKCJZRhF0YRkSQshTb.x56USzSS', 'nnguyenzzzhuuducc@gmail.com', '2025-03-24 09:48:17', 'customer', 20, 'yes', '2025-03-24', '2025-02-01', NULL),
(21, 'abc', '$2y$10$pNWi7tMpVfCM5l4lJHw0Y.RQzcFym8FR1epJeyKean8UQP9o.wD.i', 'nnguyenhzuuducc@gmail.com', '2025-03-24 10:17:08', 'customer', 20, 'yes', '2025-03-24', '2025-04-24', NULL),
(22, 'testdk', '$2y$10$HoqAQ/a7F8XSAboyTlnYfOf0l1eJ1xe2WIH0b1/Np7JzmNKov34k6', 'nnguyenhuuducc@gmail.com', '2025-03-25 03:34:51', 'customer', 20, 'no', NULL, NULL, NULL),
(23, 'zzz', '$2y$10$JXtIOWJB6b9iTqFMKIc7aOcUQPRUdxo5/K5LBnHjLZcdZo4sN9Rwe', 'nnguyenhuzvvuducc@gmail.com', '2025-03-25 03:54:37', 'customer', 20, 'yes', '2025-03-25', '2025-06-25', NULL),
(24, 'adaa', '$2y$10$4xCGkXNm4WCPmxybuot4yuXzS.AK6gttGMa1FcVwUys/nDrGUkGsC', 'nnguyenhuuduaaaacc@gmail.com', '2025-03-25 04:38:44', 'customer', 20, 'no', NULL, NULL, NULL),
(25, 'duc2003', '$2y$10$m.kTB4C2WF8XYgo4wqM2VuAXegG3Eju7X4fDLzjx0KOQo.QDixv1y', 'nnguyendfsghuuducc@gmail.com', '2025-04-16 14:24:17', 'customer', 20, 'no', NULL, NULL, NULL),
(26, 'duc1thang', '$2y$10$BXLqMFZwIf6GPf4Xq8VfNez1M6sSqvvY.g9eXl2Y51H81BYeVNN9a', 'nnguyxvenhuuducc@gmail.com', '2025-04-16 14:25:07', 'customer', 20, 'yes', '2025-04-16', '2025-05-16', NULL),
(27, 'duc6thang', '$2y$10$dRIL0jf0bRxIrpnaAuVF2.jh0ZlxEOYF23dfOXTM3nfptU2mazT.G', 'nnguyxcvfvenhuuducc@gmail.com', '2025-04-16 14:25:14', 'customer', 20, 'yes', '2025-04-16', '2025-10-16', NULL),
(28, 'duchethan', '$2y$10$Tm/UtMYgOgsC3loSqHki6OfyASlxy.z4v/0ZJQ9WnpDpO2KU650YW', 'nnguyefdehuuducc@gmail.com', '2025-04-16 14:36:28', 'customer', 19, 'no', '2025-03-13', '2025-04-13', NULL),
(267, 'nguyenhuuduc', '$2y$10$ondus2IkgQart2oqK.Ht/.Z8pAmxz.q9IecF0qdGJNQcm1hC.pMP6', 'be@gmail.com', '2025-04-16 14:41:22', 'customer', 18, 'no', NULL, NULL, NULL),
(268, 'ducchinhsua', '$2y$10$CjDmyctXSOmNZw2DscHFjOr0Ipx3JhoNYcrdJQIbkCmUY4SrqrUaO', 'duc2014@gmail.com', '2025-04-16 14:50:12', 'customer', 18, 'no', NULL, NULL, NULL),
(269, 'dangkytest', '$2y$10$w/IDxV2FWeqz0logwOnF6eNOuc6sPs944cF3PQ2FtfjGcEPFsbxri', 'dangky@gmail.com', '2025-04-16 14:53:55', 'customer', 19, 'no', NULL, NULL, NULL),
(270, 'dangkydemo', '$2y$10$tTx0wzi5DRLmW8XBCuYWLuRsAS4ggPQlykWklejt//Qul6.rHVEEu', 'dangky123@gmail.com', '2025-04-16 14:58:29', 'customer', 0, 'yes', '2025-04-16', '2025-05-16', NULL),
(271, 'ducadduser', '$2y$10$23JOWddINpeIfdABng6RTe5wwSRQ4qppu1aCMdx6tSCz5G4TDH4JO', 'nnguyenhufsduducc@gmail.com', '2025-04-16 15:06:08', 'customer', 20, 'no', NULL, NULL, '2025-04-16 15:06:21'),
(272, 'userdaadd', '$2y$10$iXLHz./10e1xo3Fjwv21yeaPhWcmoqGKTYmkR8ZOHUfDxA8iXoJ1.', 'daadd@gmail.com', '2025-04-16 15:10:15', 'customer', 20, 'no', NULL, NULL, NULL),
(273, 'ducnguyenhuu', '$2y$10$Le8c8SRg6W9loW7o/1TtOuJf8CDCWqaKwMYm9U.FXZqFosbNSZVqK', 'ducnguyen@gmail.com', '2025-04-16 15:16:46', 'customer', 0, 'no', '2025-03-13', '2025-03-20', NULL),
(274, 'nguyenduchuy', '$2y$10$ukZ7rlQ2WMWnr97vSNKmMurGh8CvhhxX5bFwR7zz.LZATRcN2EpDm', 'nnguyenhuudfducc@gmail.com', '2025-04-16 15:23:16', 'customer', 20, 'no', NULL, NULL, '2025-04-16 15:23:27'),
(275, 'baohuyhoang', '$2y$10$1uBPycyT/n6D7Go0jtQ/vePyJvxI7B2w.DI4FBdg6lT3G0zQqOrBy', 'nnguyenhuyuuducc@gmail.com', '2025-04-16 15:28:02', 'customer', 20, 'no', NULL, NULL, NULL),
(279, 'fsdfsd', '$2y$10$5F.iMnOoZCHMce16.f8yu.SN92jq0OS5CgwdqHPSSwHbZMQtyo1ZK', '3121@gmail.com', '2025-04-16 15:28:54', 'customer', 20, 'no', NULL, NULL, NULL),
(280, 'baohuy2003', '$2y$10$EUQAcQQQ.CmQtLS7wqg2GuFnaHjiEpv6OToNX.8Q76FMTortlG8PW', 'nnguyenhuudfdfucc@gmail.com', '2025-04-16 15:29:59', 'customer', 20, 'no', NULL, NULL, NULL),
(282, 'ductestno', '$2y$10$xsAu4rCRJi9nzVspzWcape4glBhc75KJhs/AeiB1/3nMApiHdGqOq', 'nnguyenhuuffducc@gmail.com', '2025-04-16 15:31:24', 'customer', 19, 'no', NULL, NULL, NULL);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=292;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `invoice_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `models`
--
ALTER TABLE `models`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=283;

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
--
-- Database: `my_database`
--
CREATE DATABASE IF NOT EXISTS `my_database` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `my_database`;

-- --------------------------------------------------------

--
-- Table structure for table `image_history`
--

CREATE TABLE `image_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `prompt` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `style` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `image_history`
--
ALTER TABLE `image_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`);

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
-- AUTO_INCREMENT for table `image_history`
--
ALTER TABLE `image_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `image_history`
--
ALTER TABLE `image_history`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
--
-- Database: `phpmyadmin`
--
CREATE DATABASE IF NOT EXISTS `phpmyadmin` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `phpmyadmin`;

-- --------------------------------------------------------

--
-- Table structure for table `pma__bookmark`
--

CREATE TABLE `pma__bookmark` (
  `id` int(10) UNSIGNED NOT NULL,
  `dbase` varchar(255) NOT NULL DEFAULT '',
  `user` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Bookmarks';

-- --------------------------------------------------------

--
-- Table structure for table `pma__central_columns`
--

CREATE TABLE `pma__central_columns` (
  `db_name` varchar(64) NOT NULL,
  `col_name` varchar(64) NOT NULL,
  `col_type` varchar(64) NOT NULL,
  `col_length` text DEFAULT NULL,
  `col_collation` varchar(64) NOT NULL,
  `col_isNull` tinyint(1) NOT NULL,
  `col_extra` varchar(255) DEFAULT '',
  `col_default` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Central list of columns';

-- --------------------------------------------------------

--
-- Table structure for table `pma__column_info`
--

CREATE TABLE `pma__column_info` (
  `id` int(5) UNSIGNED NOT NULL,
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `column_name` varchar(64) NOT NULL DEFAULT '',
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `mimetype` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `transformation` varchar(255) NOT NULL DEFAULT '',
  `transformation_options` varchar(255) NOT NULL DEFAULT '',
  `input_transformation` varchar(255) NOT NULL DEFAULT '',
  `input_transformation_options` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Column information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__designer_settings`
--

CREATE TABLE `pma__designer_settings` (
  `username` varchar(64) NOT NULL,
  `settings_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Settings related to Designer';

-- --------------------------------------------------------

--
-- Table structure for table `pma__export_templates`
--

CREATE TABLE `pma__export_templates` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `export_type` varchar(10) NOT NULL,
  `template_name` varchar(64) NOT NULL,
  `template_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved export templates';

-- --------------------------------------------------------

--
-- Table structure for table `pma__favorite`
--

CREATE TABLE `pma__favorite` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Favorite tables';

-- --------------------------------------------------------

--
-- Table structure for table `pma__history`
--

CREATE TABLE `pma__history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db` varchar(64) NOT NULL DEFAULT '',
  `table` varchar(64) NOT NULL DEFAULT '',
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp(),
  `sqlquery` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='SQL history for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__navigationhiding`
--

CREATE TABLE `pma__navigationhiding` (
  `username` varchar(64) NOT NULL,
  `item_name` varchar(64) NOT NULL,
  `item_type` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Hidden items of navigation tree';

-- --------------------------------------------------------

--
-- Table structure for table `pma__pdf_pages`
--

CREATE TABLE `pma__pdf_pages` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `page_nr` int(10) UNSIGNED NOT NULL,
  `page_descr` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='PDF relation pages for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__recent`
--

CREATE TABLE `pma__recent` (
  `username` varchar(64) NOT NULL,
  `tables` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Recently accessed tables';

--
-- Dumping data for table `pma__recent`
--

INSERT INTO `pma__recent` (`username`, `tables`) VALUES
('root', '[{\"db\":\"imagegenerator\",\"table\":\"users\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `pma__relation`
--

CREATE TABLE `pma__relation` (
  `master_db` varchar(64) NOT NULL DEFAULT '',
  `master_table` varchar(64) NOT NULL DEFAULT '',
  `master_field` varchar(64) NOT NULL DEFAULT '',
  `foreign_db` varchar(64) NOT NULL DEFAULT '',
  `foreign_table` varchar(64) NOT NULL DEFAULT '',
  `foreign_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Relation table';

-- --------------------------------------------------------

--
-- Table structure for table `pma__savedsearches`
--

CREATE TABLE `pma__savedsearches` (
  `id` int(5) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL DEFAULT '',
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `search_name` varchar(64) NOT NULL DEFAULT '',
  `search_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Saved searches';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_coords`
--

CREATE TABLE `pma__table_coords` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `pdf_page_number` int(11) NOT NULL DEFAULT 0,
  `x` float UNSIGNED NOT NULL DEFAULT 0,
  `y` float UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table coordinates for phpMyAdmin PDF output';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_info`
--

CREATE TABLE `pma__table_info` (
  `db_name` varchar(64) NOT NULL DEFAULT '',
  `table_name` varchar(64) NOT NULL DEFAULT '',
  `display_field` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Table information for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__table_uiprefs`
--

CREATE TABLE `pma__table_uiprefs` (
  `username` varchar(64) NOT NULL,
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `prefs` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Tables'' UI preferences';

-- --------------------------------------------------------

--
-- Table structure for table `pma__tracking`
--

CREATE TABLE `pma__tracking` (
  `db_name` varchar(64) NOT NULL,
  `table_name` varchar(64) NOT NULL,
  `version` int(10) UNSIGNED NOT NULL,
  `date_created` datetime NOT NULL,
  `date_updated` datetime NOT NULL,
  `schema_snapshot` text NOT NULL,
  `schema_sql` text DEFAULT NULL,
  `data_sql` longtext DEFAULT NULL,
  `tracking` set('UPDATE','REPLACE','INSERT','DELETE','TRUNCATE','CREATE DATABASE','ALTER DATABASE','DROP DATABASE','CREATE TABLE','ALTER TABLE','RENAME TABLE','DROP TABLE','CREATE INDEX','DROP INDEX','CREATE VIEW','ALTER VIEW','DROP VIEW') DEFAULT NULL,
  `tracking_active` int(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Database changes tracking for phpMyAdmin';

-- --------------------------------------------------------

--
-- Table structure for table `pma__userconfig`
--

CREATE TABLE `pma__userconfig` (
  `username` varchar(64) NOT NULL,
  `timevalue` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User preferences storage for phpMyAdmin';

--
-- Dumping data for table `pma__userconfig`
--

INSERT INTO `pma__userconfig` (`username`, `timevalue`, `config_data`) VALUES
('root', '2025-03-15 08:35:33', '{\"Console\\/Mode\":\"collapse\"}');

-- --------------------------------------------------------

--
-- Table structure for table `pma__usergroups`
--

CREATE TABLE `pma__usergroups` (
  `usergroup` varchar(64) NOT NULL,
  `tab` varchar(64) NOT NULL,
  `allowed` enum('Y','N') NOT NULL DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User groups with configured menu items';

-- --------------------------------------------------------

--
-- Table structure for table `pma__users`
--

CREATE TABLE `pma__users` (
  `username` varchar(64) NOT NULL,
  `usergroup` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Users and their assignments to user groups';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pma__central_columns`
--
ALTER TABLE `pma__central_columns`
  ADD PRIMARY KEY (`db_name`,`col_name`);

--
-- Indexes for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `db_name` (`db_name`,`table_name`,`column_name`);

--
-- Indexes for table `pma__designer_settings`
--
ALTER TABLE `pma__designer_settings`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_user_type_template` (`username`,`export_type`,`template_name`);

--
-- Indexes for table `pma__favorite`
--
ALTER TABLE `pma__favorite`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__history`
--
ALTER TABLE `pma__history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`,`db`,`table`,`timevalue`);

--
-- Indexes for table `pma__navigationhiding`
--
ALTER TABLE `pma__navigationhiding`
  ADD PRIMARY KEY (`username`,`item_name`,`item_type`,`db_name`,`table_name`);

--
-- Indexes for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  ADD PRIMARY KEY (`page_nr`),
  ADD KEY `db_name` (`db_name`);

--
-- Indexes for table `pma__recent`
--
ALTER TABLE `pma__recent`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__relation`
--
ALTER TABLE `pma__relation`
  ADD PRIMARY KEY (`master_db`,`master_table`,`master_field`),
  ADD KEY `foreign_field` (`foreign_db`,`foreign_table`);

--
-- Indexes for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_savedsearches_username_dbname` (`username`,`db_name`,`search_name`);

--
-- Indexes for table `pma__table_coords`
--
ALTER TABLE `pma__table_coords`
  ADD PRIMARY KEY (`db_name`,`table_name`,`pdf_page_number`);

--
-- Indexes for table `pma__table_info`
--
ALTER TABLE `pma__table_info`
  ADD PRIMARY KEY (`db_name`,`table_name`);

--
-- Indexes for table `pma__table_uiprefs`
--
ALTER TABLE `pma__table_uiprefs`
  ADD PRIMARY KEY (`username`,`db_name`,`table_name`);

--
-- Indexes for table `pma__tracking`
--
ALTER TABLE `pma__tracking`
  ADD PRIMARY KEY (`db_name`,`table_name`,`version`);

--
-- Indexes for table `pma__userconfig`
--
ALTER TABLE `pma__userconfig`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `pma__usergroups`
--
ALTER TABLE `pma__usergroups`
  ADD PRIMARY KEY (`usergroup`,`tab`,`allowed`);

--
-- Indexes for table `pma__users`
--
ALTER TABLE `pma__users`
  ADD PRIMARY KEY (`username`,`usergroup`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pma__bookmark`
--
ALTER TABLE `pma__bookmark`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__column_info`
--
ALTER TABLE `pma__column_info`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__export_templates`
--
ALTER TABLE `pma__export_templates`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__history`
--
ALTER TABLE `pma__history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__pdf_pages`
--
ALTER TABLE `pma__pdf_pages`
  MODIFY `page_nr` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pma__savedsearches`
--
ALTER TABLE `pma__savedsearches`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- Database: `test`
--
CREATE DATABASE IF NOT EXISTS `test` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `test`;
--
-- Database: `to_do_list`
--
CREATE DATABASE IF NOT EXISTS `to_do_list` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `to_do_list`;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `task_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `due_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_category`
--

CREATE TABLE `task_category` (
  `task_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(128) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `idx_task_user_id` (`user_id`);

--
-- Indexes for table `task_category`
--
ALTER TABLE `task_category`
  ADD PRIMARY KEY (`task_id`,`category_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_task_category_task_id` (`task_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `task_category`
--
ALTER TABLE `task_category`
  ADD CONSTRAINT `task_category_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
