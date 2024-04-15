-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 15, 2023 lúc 06:37 AM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `manager_booking_hotel`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bills`
--

CREATE TABLE `bills` (
  `bill_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_fullname` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_for` enum('ME','CUSTOMER','','') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ME',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `total_night` int(11) NOT NULL,
  `status` enum('UNPAID','PAID','OTHER','STARTED_USE','ENDED_USE','CANCEL') COLLATE utf8mb4_unicode_ci DEFAULT 'UNPAID',
  `note` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment` enum('OFFLINE','ONLINE') COLLATE utf8mb4_unicode_ci DEFAULT 'OFFLINE',
  `voucher` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_price` float NOT NULL,
  `time_destination` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT '13:00 – 14:00',
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bills`
--

INSERT INTO `bills` (`bill_id`, `customer_fullname`, `customer_email`, `email`, `booking_for`, `start_date`, `end_date`, `total_night`, `status`, `note`, `payment`, `voucher`, `total_price`, `time_destination`, `user_id`, `created_at`) VALUES
('65e3439e9f6140b4917369e3a6040a18', NULL, NULL, 'ginga550504@gmail.com', 'ME', '2023-06-15', '2023-06-15', 1, 'ENDED_USE', NULL, 'OFFLINE', NULL, 360000, '13:00 – 14:00', '5b6072ce53e645b4a286d40b53132f94', '2023-06-15 04:32:48'),
('bbfc28e8a3374232844618448e76b4c1', NULL, NULL, 'ginga550504@gmail.com', 'ME', '2023-06-15', '2023-06-15', 1, 'CANCEL', NULL, 'ONLINE', NULL, 360000, '08:00 – 09:00', '5b6072ce53e645b4a286d40b53132f94', '2023-06-15 04:34:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bill_details`
--

CREATE TABLE `bill_details` (
  `bill_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int(11) DEFAULT NULL CHECK (`price` > 10),
  `room_quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bill_details`
--

INSERT INTO `bill_details` (`bill_id`, `floor_id`, `room_id`, `price`, `room_quantity`, `created_at`, `updated_at`) VALUES
('65e3439e9f6140b4917369e3a6040a18', 'dde8c9d5fb3a416db5c3a976bfeb2b13', '553510d5925c43bb8ad1e56490334c71', 360000, 1, '2023-06-15 04:32:48', '2023-06-15 04:32:48'),
('bbfc28e8a3374232844618448e76b4c1', 'dde8c9d5fb3a416db5c3a976bfeb2b13', '553510d5925c43bb8ad1e56490334c71', 360000, 1, '2023-06-15 04:34:12', '2023-06-15 04:34:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `device_types`
--

CREATE TABLE `device_types` (
  `dt_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dt_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dt_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','HOTEL','USER') COLLATE utf8mb4_unicode_ci DEFAULT 'ADMIN',
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `device_types`
--

INSERT INTO `device_types` (`dt_id`, `dt_name`, `dt_desc`, `role`, `user_id`, `created_at`, `updated_at`) VALUES
('395086e175f749a096025de30cc9648c', 'Ghế một', 'Dùng để ngồi một người', 'ADMIN', 'fc98bbeda29b42df9a5b54bbaef0029c', '2023-03-03 13:46:26', '2023-03-03 13:46:26'),
('63d7e62f10644683b9f2f8051caec4db', 'Bàn một 3', 'dùng để ăn uống nha dùng để ăn uống nha dùng để ăn uống nha dùng để ăn uống nha', 'ADMIN', 'fc98bbeda29b42df9a5b54bbaef0029c', '2023-03-02 10:27:32', '2023-03-02 10:33:38');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `floors`
--

CREATE TABLE `floors` (
  `floor_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `floors`
--

INSERT INTO `floors` (`floor_id`, `floor_name`, `floor_type`, `hotel_id`) VALUES
('1b9cbfb58ce44ceb83ed4cceb3eec8a7', 'Tầng 3', 'Bình thường', 'b86f9aa063ab4e57833333c903b0248a'),
('40dbbb0ecf46435fa5f754a3e7fd9db7', 'Tầng 4', 'Thượng lưu', 'b86f9aa063ab4e57833333c903b0248a'),
('59244fff30a448e7a767feda5a0b28b1', 'Tầng 1', 'T1', 'd91abdcbfa7944e684f3efba8e0924ca'),
('8dfe3ea0000346eb9385fe756c9169ed', 'Tầng  1', 'TP1', '5ae3c6fce66b419cb9120e5b45fe5e24'),
('91fe579a41c7497f8fb5381660394715', 'Tầng 1', 'T1', '37b32facfcfd4dd09e9fef1edcc60d5e'),
('9cdc79300450410aab19259834d5fdcb', 'Tầng 2', 'Tầng bình thường', '79981cf429254e06bb311dee7a92e7e6'),
('a8a0e4c48ee54c89bd83d94c7cd808df', 'Tầng 1', 'T1', '0d98fb11fddb4d4ca02ac3b26a38c12a'),
('b27af104ba5b465685d4554e989ea12e', 'Tầng 5', 'Tầng VIP', 'b86f9aa063ab4e57833333c903b0248a'),
('b94d280973d047d9a993b5838e0b2e56', 'Tầng 1', 'Tầng bình thường', 'b86f9aa063ab4e57833333c903b0248a'),
('c3c8c059018c4ba8ab1847492d8e5612', 'Tầng 1', 'TKS1', 'c865704402d041449e8da24f65954d78'),
('daf175702daa44cea54c8a1e552f031b', 'Tầng 2', 'Tầng bình thường', 'b86f9aa063ab4e57833333c903b0248a'),
('dde8c9d5fb3a416db5c3a976bfeb2b13', 'Tầng 1', 'Bình thường', '79981cf429254e06bb311dee7a92e7e6'),
('ecf440e257f648858a943ca2162b2be1', 'Tầng 1', 'T1', '02b92a38104842ea9ea9fe9646bf6f94');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hotels`
--

CREATE TABLE `hotels` (
  `hotel_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax` int(11) DEFAULT 0 COMMENT '%',
  `hotel_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_desc` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_title` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hotel_image` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name_img` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `district_name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provice_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provice_name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ward_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ward_name` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_rating` float DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hotels`
--

INSERT INTO `hotels` (`hotel_id`, `owner_id`, `tax`, `hotel_name`, `hotel_desc`, `hotel_address`, `hotel_title`, `hotel_image`, `file_name_img`, `district_code`, `district_name`, `provice_code`, `provice_name`, `ward_code`, `ward_name`, `slug`, `hotel_rating`, `created_at`, `updated_at`) VALUES
('02b92a38104842ea9ea9fe9646bf6f94', NULL, 0, 'Khách sạn 2 Vĩnh Long', 'Giới thiệu về khách sạn 2 Vĩnh Long', '21/A', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917303/booking-hotel/kn0yxu7lmay5ftrxfybl.jpg', 'booking-hotel/kn0yxu7lmay5ftrxfybl', '859', 'Huyện  Vũng Liêm', '86', 'Tỉnh Vĩnh Long', '29683', 'Xã Trung Hiệp', 'khach-san-2-vinh-long', 0, '2023-03-04 08:08:22', '2023-03-04 08:08:22'),
('0d98fb11fddb4d4ca02ac3b26a38c12a', NULL, 0, 'Khách sạn HCM', 'Giới thiệu về khách sạn HCM', '21/A', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677918052/booking-hotel/axm7o3lsbg0nqpowg2z9.jpg', 'booking-hotel/axm7o3lsbg0nqpowg2z9', '774', 'Quận 5', '79', 'Thành phố Hồ Chí Minh', '27328', 'Phường 11', 'khach-san-hcm', 0, '2023-03-04 08:20:51', '2023-03-04 08:20:51'),
('1e074dc83a1e4a239dfddc86fa6c1a03', NULL, 2, 'Khách  sạn Hà ', 'Situated in Hanoi and with Ha Noi Railway station reachable within 600 metres, Cua Nam Hotel Ho Guom features concierge services, allergy-free rooms, a shared lounge, free WiFi and a terrace. The property is close to several well-known attractions, 1.3 km from Thang Long Water Puppet Theater, 1.3 km from Trang Tien Plaza and 700 metres from Vietnam Fine Arts Museum. Private parking is available on site.\r\nAll rooms are fitted with air conditioning, a flat-screen TV with satellite channels, a fridge, a kettle, a bidet, free toiletries and a desk. Featuring a private bathroom with a shower and a hairdryer, some units at the hotel also feature a city view. At Cua Nam Hotel Ho Guom the rooms are fitted with bed linen and towels.\r\n\r\nNon-stop advice is available at the reception, where staff speak English and Vietnamese.\r\n\r\nPopular points of interest near the accommodation include Hanoi Temple of Literature, Imperial Citadel and St. Joseph Cathedral. The nearest airport is Noi Bai International, 24 km from Cua Nam Hotel Ho Guom, and the property offers a paid airport shuttle service.\r\n\r\nĐây là khu vực ở Hà Nội mà khách yêu thích, theo các đánh giá độc lập.', '113/A', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1682037633/booking-hotel/sfhv3efgzlg7oiyutlca.jpg', 'booking-hotel/sfhv3efgzlg7oiyutlca', '273', 'Huyện Đan Phượng', '01', 'Thành phố Hà Nội', '09799', 'Xã Liên Hồng', 'khach-san-ha', 0, '2023-04-21 00:40:33', '2023-04-21 00:40:33'),
('37b32facfcfd4dd09e9fef1edcc60d5e', NULL, 1, 'Khác\'h Sạn 1 Cần thơ', 'Giới thiệu về khách sạn 1 Cần Thơ, xanh, sach, dep', '21/a', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677912978/booking-hotel/jgud72dxz0qk2ctm41tz.jpg', 'booking-hotel/jgud72dxz0qk2ctm41tz', '926', 'Huyện Phong Điền', '92', 'Thành phố Cần Thơ', '31303', 'Xã Giai Xuân', 'khach-san-1-can-tho', 0, '2023-03-03 16:56:18', '2023-03-03 16:56:18'),
('5ae3c6fce66b419cb9120e5b45fe5e24', NULL, 0, 'Khách sạn Đồng Tháp 3', 'Giới  thiệu về Khách sạn Đồng Tháp 3', '11/A', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949686/booking-hotel/rqptemdcuxu1s9b18l8s.jpg', 'booking-hotel/rqptemdcuxu1s9b18l8s', '876', 'Huyện Lai Vung', '87', 'Tỉnh Đồng Tháp', '30223', 'Xã Hòa Long', 'khach-san-dong-thap-3', 0, '2023-03-04 17:08:07', '2023-03-04 17:08:07'),
('67ba0e3f0fca420886a1ae45584a9834', NULL, 0, 'Khách sạn ở Vĩnh Long', 'Giới thiệu về khách sạn của Cẩm Thi', 'Quốc lộ 54, ấp Tân Vĩnh', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917172/booking-hotel/vecjkpuvq49hzmugablh.jpg', 'booking-hotel/vecjkpuvq49hzmugablh', '863', 'Huyện Bình Tân', '86', 'Tỉnh Vĩnh Long', '29785', 'Xã Tân Lược', 'khach-san-o-vinh-long', 0, '2023-03-04 08:06:11', '2023-03-04 08:06:11'),
('79981cf429254e06bb311dee7a92e7e6', NULL, 0, 'MID NIGHT', 'Set in Can Tho, less than 1 km from Vincom Plaza Hung Vuong, MID NIGHT offers accommodation with a terrace, free private parking and a bar. This 2-star hotel offers room service and a 24-hour front desk. The property is non-smoking and is situated 2.3 km from Vincom Plaza Xuan Khanh.\r\n\r\nThe units come with air conditioning, a fridge, a minibar, a kettle, a shower, free toiletries and a desk. At the hotel, all rooms are equipped with a private bathroom with a hairdryer and slippers.\r\n\r\nThe area is popular for cycling, and bike hire is available at this 2-star hotel.\r\n\r\nNinh Kieu Pier is 2.5 km from MID NIGHT, while Can Tho Museum is 2.3 km away. The nearest airport is Can Tho International Airport, 9 km from the accommodation.\r\n\r\nMID NIGHT đã chào đón khách Booking.com từ 18 tháng 12 2022.', '89 Đường Huỳnh Thúc Kháng', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677903834/booking-hotel/dhvvted5c5gsfbcje0km.jpg', 'booking-hotel/dhvvted5c5gsfbcje0km', '916', 'Quận Ninh Kiều', '92', 'Thành phố Cần Thơ', '31126', 'Phường An Nghiệp', 'mid-night', 0, '2023-03-04 04:23:53', '2023-03-04 04:23:53'),
('b86f9aa063ab4e57833333c903b0248a', NULL, 0, 'Maison Vui Homestay', 'Tọa lạc tại thành phố Hội An, cách Hội quán Triều Châu 500 m, Maison Vui Homestay có sân hiên, phòng nghỉ không gây dị ứng và WiFi miễn phí. Chỗ nghỉ nằm cách các điểm tham quan như Hội quán Hải Nam, Quan Công Miếu và Hội quán Phúc Kiến một quãng ngắn. Chỗ nghỉ có lễ tân 24 giờ, sảnh khách chung và dịch vụ thu đổi ngoại tệ cho khách.\r\n\r\nNhà khách cung cấp phòng nghỉ gắn máy điều hòa với bàn làm việc, ấm đun nước, tủ lạnh, két an toàn, TV màn hình phẳng và phòng tắm riêng với vòi sen. Tại Maison Vui Homestay, các phòng được trang bị ga trải giường và khăn tắm.\r\n\r\nĐi xe đạp là hoạt động phổ biến trong khu vực và du khách có thể thuê xe đạp tai chỗ nghỉ.\r\n\r\nMaison Vui Homestay nằm gần các điểm tham quan nổi tiếng như Bảo tàng Lịch sử Hội An, Hội quán Quảng Đông và Chùa Cầu Nhật Bản. Sân bay gần nhất là sân bay quốc tế Đà Nẵng, nằm trong bán kính 23 km từ nhà khách, và chỗ nghỉ cung cấp dịch vụ đưa đón sân bay với một khoản phụ phí.\r\n\r\nCác cặp đôi đặc biệt thích địa điểm này — họ cho điểm 9,4 cho kỳ nghỉ dành cho 2 người.', '21/A', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677898830/booking-hotel/lkds51hool2wimdwdkzd.jpg', 'booking-hotel/lkds51hool2wimdwdkzd', '467', 'Huyện Đa Krông', '45', 'Tỉnh Quảng Trị', '19576', 'Xã Ba Nang', 'maison-vui-homestay', 0, '2023-03-01 08:30:27', '2023-03-01 08:30:27'),
('c865704402d041449e8da24f65954d78', 'd111cf3138f6484aa6d7e0e80cece7e4', 0, 'Khacsh sanj cua test nha', 'Gioi thieu ve khach san cua test', '145/3', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1678764960/booking-hotel/ifvyb8s2fziheva092qf.jpg', 'booking-hotel/ifvyb8s2fziheva092qf', '753', 'Huyện Đất Đỏ', '77', 'Tỉnh Bà Rịa - Vũng Tàu', '26698', 'Xã Láng Dài', 'khacsh-sanj-cua-test-nha', 0, '2023-03-14 03:36:00', '2023-03-14 03:36:00'),
('d91abdcbfa7944e684f3efba8e0924ca', NULL, 0, 'Khách Sạn 1 tỉnh Đồng Tháp', 'Giới thiệu về Khách Sạn 1 tỉnh Đồng Tháp', '21/A', NULL, 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917400/booking-hotel/qzapz18fqmliyqtoozwe.jpg', 'booking-hotel/qzapz18fqmliyqtoozwe', '876', 'Huyện Lai Vung', '87', 'Tỉnh Đồng Tháp', '30229', 'Xã Long Thắng', 'khach-san-1-tinh-dong-thap', 0, '2023-03-04 01:10:00', '2023-03-04 01:10:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hotel_images`
--

CREATE TABLE `hotel_images` (
  `h_image_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `h_image_value` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_name` text COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hotel_images`
--

INSERT INTO `hotel_images` (`h_image_id`, `hotel_id`, `h_image_value`, `file_name`) VALUES
('125e67fea0ce4123b600603234cdbe17', '5ae3c6fce66b419cb9120e5b45fe5e24', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949686/booking-hotel/ma9lxqrvd7mbsrz9nwll.jpg', 'booking-hotel/ma9lxqrvd7mbsrz9nwll'),
('1f2dd522b3db4b398fb7b02c78d3b2ac', '1e074dc83a1e4a239dfddc86fa6c1a03', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1682037633/booking-hotel/ces9eyiouvwlso8lcxfx.jpg', 'booking-hotel/ces9eyiouvwlso8lcxfx'),
('27bc29a9176544f0b546225a23cf71eb', '79981cf429254e06bb311dee7a92e7e6', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677903834/booking-hotel/cprdcbl6l86iivegn5mm.jpg', 'booking-hotel/cprdcbl6l86iivegn5mm'),
('33616e7c38c94764a0a444f49ae83c7a', '02b92a38104842ea9ea9fe9646bf6f94', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917303/booking-hotel/xogolxxsm8wgx0nt8fsf.jpg', 'booking-hotel/xogolxxsm8wgx0nt8fsf'),
('433d584742fd4b4fbbc2e7fd12d9a298', '67ba0e3f0fca420886a1ae45584a9834', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917172/booking-hotel/bqql6m2tzqbqf7ipw53e.jpg', 'booking-hotel/bqql6m2tzqbqf7ipw53e'),
('436236b7ca5c48898684a88b03c34c0d', '1e074dc83a1e4a239dfddc86fa6c1a03', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1682037633/booking-hotel/cb0ipd9i4vd4y9anatwe.jpg', 'booking-hotel/cb0ipd9i4vd4y9anatwe'),
('47c8477d92c841da9db06e404c00628c', 'c865704402d041449e8da24f65954d78', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1678764961/booking-hotel/nujokp0hqvxddrzagzsv.jpg', 'booking-hotel/nujokp0hqvxddrzagzsv'),
('51e096a77369480f82b8a7f30b2fd274', '79981cf429254e06bb311dee7a92e7e6', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677903834/booking-hotel/qqpkgcd564yudxscyk7u.jpg', 'booking-hotel/qqpkgcd564yudxscyk7u'),
('52dfe3cc6b9f4b6a88eef1a34611a034', '79981cf429254e06bb311dee7a92e7e6', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677903834/booking-hotel/liznytqozudmtcixjsus.jpg', 'booking-hotel/liznytqozudmtcixjsus'),
('5abb2df9a12e47878f080458d45140a3', '37b32facfcfd4dd09e9fef1edcc60d5e', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677912978/booking-hotel/fiffelymz1lfrq6ayayl.jpg', 'booking-hotel/fiffelymz1lfrq6ayayl'),
('694c5dc34c614c50bd3686c705547716', '79981cf429254e06bb311dee7a92e7e6', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677903834/booking-hotel/tunmfpfrx3u1jq55k0xy.jpg', 'booking-hotel/tunmfpfrx3u1jq55k0xy'),
('6e0af921c6ff4b0280ff95c0db8c13bd', '0d98fb11fddb4d4ca02ac3b26a38c12a', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677918052/booking-hotel/unxbdbw8uvxywbu6p7xf.jpg', 'booking-hotel/unxbdbw8uvxywbu6p7xf'),
('6e1788dddac54d17a7883e8a11059341', '5ae3c6fce66b419cb9120e5b45fe5e24', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949686/booking-hotel/hn2ssc8yl8oohdnakh7j.jpg', 'booking-hotel/hn2ssc8yl8oohdnakh7j'),
('70287ba580f14033ac4d2024b1d4acdb', 'b86f9aa063ab4e57833333c903b0248a', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677684625/booking-hotel/hhijpqrvwr19d9tuuh6u.jpg', 'booking-hotel/hhijpqrvwr19d9tuuh6u'),
('75fc0871b2584b50a81a6a45e60f2f43', '37b32facfcfd4dd09e9fef1edcc60d5e', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677912978/booking-hotel/vmave0dlda6ygi9adcy8.jpg', 'booking-hotel/vmave0dlda6ygi9adcy8'),
('7c032868c1614728ad79e67c399a089f', '67ba0e3f0fca420886a1ae45584a9834', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917171/booking-hotel/ivzcprpgfzoyved3kkqx.jpg', 'booking-hotel/ivzcprpgfzoyved3kkqx'),
('81ecbf7b555f48b8aece951d3b5e810c', 'b86f9aa063ab4e57833333c903b0248a', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677684625/booking-hotel/vc6rlzqv7ahm03nlcxa9.jpg', 'booking-hotel/vc6rlzqv7ahm03nlcxa9'),
('84ec3609b5194e589bf6650d13915f97', '0d98fb11fddb4d4ca02ac3b26a38c12a', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677918052/booking-hotel/bw7eqdpk2odecn2pojdm.jpg', 'booking-hotel/bw7eqdpk2odecn2pojdm'),
('891fc1615ac040219a1eb3e16db8b88b', '79981cf429254e06bb311dee7a92e7e6', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677903834/booking-hotel/ncmwzibkm4z7wptqyuoq.jpg', 'booking-hotel/ncmwzibkm4z7wptqyuoq'),
('8aad7edbdc384186aa2a9b109b9dc40d', 'd91abdcbfa7944e684f3efba8e0924ca', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917401/booking-hotel/wy9o1g0lqb9dcvohfvfw.jpg', 'booking-hotel/wy9o1g0lqb9dcvohfvfw'),
('93890960df154df7999b8d43dcf757e7', 'b86f9aa063ab4e57833333c903b0248a', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677684625/booking-hotel/xhaciiz6wkrcazjlpljm.jpg', 'booking-hotel/xhaciiz6wkrcazjlpljm'),
('968323b7caf8479ba458afb277b332ac', '37b32facfcfd4dd09e9fef1edcc60d5e', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677912978/booking-hotel/nynyewwdtdb6nnfex4q0.jpg', 'booking-hotel/nynyewwdtdb6nnfex4q0'),
('a1932832db2749118de261f565c03746', '5ae3c6fce66b419cb9120e5b45fe5e24', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949686/booking-hotel/n59o5zy9wsxxuf9lt0uo.jpg', 'booking-hotel/n59o5zy9wsxxuf9lt0uo'),
('a516db3b9e6d41e0825a6ecc2af90fe9', 'd91abdcbfa7944e684f3efba8e0924ca', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917401/booking-hotel/i4mlroltlrbvvddvkjck.jpg', 'booking-hotel/i4mlroltlrbvvddvkjck'),
('a7cdf5e8dc6d4e6fb821d35c29dbb918', '02b92a38104842ea9ea9fe9646bf6f94', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917303/booking-hotel/rfnxrtcy4hyaebfaffxa.jpg', 'booking-hotel/rfnxrtcy4hyaebfaffxa'),
('b1264025d0da4717b8e1a90f6d01e8ba', '1e074dc83a1e4a239dfddc86fa6c1a03', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1682037633/booking-hotel/rjymldsmzfvfh3k6mkys.jpg', 'booking-hotel/rjymldsmzfvfh3k6mkys'),
('b6d0c0d2181e41e1912058dd464bc09c', '67ba0e3f0fca420886a1ae45584a9834', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917171/booking-hotel/ls3uph7nai8yqs6sso0s.jpg', 'booking-hotel/ls3uph7nai8yqs6sso0s'),
('baf8700a62e144f88aef619a29ea2b82', '79981cf429254e06bb311dee7a92e7e6', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677903834/booking-hotel/vusuzw3nqqdv5qxbrhpm.jpg', 'booking-hotel/vusuzw3nqqdv5qxbrhpm'),
('bfb3b52006db4797b0c8eca726b62d83', 'b86f9aa063ab4e57833333c903b0248a', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677684625/booking-hotel/idqphmqgaz8ubutdlf1x.jpg', 'booking-hotel/idqphmqgaz8ubutdlf1x'),
('ca0d17d963b643878755d86f344b22eb', '1e074dc83a1e4a239dfddc86fa6c1a03', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1682037633/booking-hotel/skln4affw2zfnffufvcy.jpg', 'booking-hotel/skln4affw2zfnffufvcy'),
('e26a6d9c77bc454ea393617ff728caf5', '02b92a38104842ea9ea9fe9646bf6f94', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677917303/booking-hotel/iukli7ip81nihtoblcrd.jpg', 'booking-hotel/iukli7ip81nihtoblcrd'),
('e41b38ef81ef4b468db1cc0e53065bbe', 'b86f9aa063ab4e57833333c903b0248a', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677684626/booking-hotel/pupmmjzy0hrxc1jwfn3c.jpg', 'booking-hotel/pupmmjzy0hrxc1jwfn3c'),
('e47e6f97aa5b473da2237f3f9d67fa38', '0d98fb11fddb4d4ca02ac3b26a38c12a', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677918052/booking-hotel/tpxg0hy7t2jxa7uyrc0u.jpg', 'booking-hotel/tpxg0hy7t2jxa7uyrc0u'),
('ecf424b955764586b0856f8d9f3b5e7d', '1e074dc83a1e4a239dfddc86fa6c1a03', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1682037633/booking-hotel/jplfwg8gojxnffhledh6.jpg', 'booking-hotel/jplfwg8gojxnffhledh6');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hotel_tags`
--

CREATE TABLE `hotel_tags` (
  `tag_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_key` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_value` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hotel_tags`
--

INSERT INTO `hotel_tags` (`tag_id`, `tag_key`, `tag_value`, `hotel_id`) VALUES
('05e7979e97204fe58e8055f5cee03c4b', 'tag', 'Nhìn ra thành phố', '67ba0e3f0fca420886a1ae45584a9834'),
('09754b42b93d4c8f8f2b2b92343c4c3a', 'tag', 'Sân vườn', '0d98fb11fddb4d4ca02ac3b26a38c12a'),
('0d10db0dfe9b4f51ac6368c93cb1a712', 'tag', 'Wi-Fi miễn phí', 'd91abdcbfa7944e684f3efba8e0924ca'),
('0e64d99416184a8881e2da2ba3dc88fd', 'tag', 'Chỗ đỗ xe miễn phí', '79981cf429254e06bb311dee7a92e7e6'),
('15c3a90172424679b6441f3596609e03', 'tag', 'Hồ bơi', 'b86f9aa063ab4e57833333c903b0248a'),
('160c630f502942bab97d79f62944aa4c', 'tag', 'Dịch vụ phòng', '1e074dc83a1e4a239dfddc86fa6c1a03'),
('16a9ff4ceb6642faa1999fa4c416f89c', 'tag', 'Hồ bơi', '37b32facfcfd4dd09e9fef1edcc60d5e'),
('1c8cbdb945ef40ae8afa0d231367d970', 'tag', 'Sân vườn', 'd91abdcbfa7944e684f3efba8e0924ca'),
('1e81a931884649ca9c94ecb3f207d485', 'tag', 'Máy giặt', '67ba0e3f0fca420886a1ae45584a9834'),
('245f50c7d082470e870520dda352b757', 'tag', 'Bếp', 'd91abdcbfa7944e684f3efba8e0924ca'),
('2e66c1814f9c473ca020cfeaa83d5218', 'tag', 'Tiện nghi BBQ', '02b92a38104842ea9ea9fe9646bf6f94'),
('35bae31a3c8d4d53b9147412ae2779ee', 'tag', 'Phòng không hút thuốc', '1e074dc83a1e4a239dfddc86fa6c1a03'),
('4139189eab7c4d01a27e695abd263d65', 'tag', 'Tiện nghi BBQ', 'c865704402d041449e8da24f65954d78'),
('47d14f7768564d3aa4b97e54f1070d04', 'tag', 'Nhìn ra thành phố', '02b92a38104842ea9ea9fe9646bf6f94'),
('49972204b02c4a7d89ae0679497d833f', 'tag', 'Nhìn ra thành phố', '1e074dc83a1e4a239dfddc86fa6c1a03'),
('528a2ca11731446e9195ca1b042edf00', 'tag', 'Bếp', '1e074dc83a1e4a239dfddc86fa6c1a03'),
('53814a6c99ce4992bb36c549fc6e82d0', 'tag', 'Bếp', 'b86f9aa063ab4e57833333c903b0248a'),
('5b28c4da585f42bfa6b9c7d5e6ef43d4', 'tag', 'Nhìn ra thành phố', '0d98fb11fddb4d4ca02ac3b26a38c12a'),
('62f176ccc290430aa8594b3e9c6e5517', 'tag', 'Sân hiên', 'd91abdcbfa7944e684f3efba8e0924ca'),
('66c21fabb7b34b44b6c551f42d221a6c', 'tag', 'Sân vườn', '67ba0e3f0fca420886a1ae45584a9834'),
('6b778910e9474dfe9b644de5ea21ef9a', 'tag', 'Nhìn ra thành phố', 'c865704402d041449e8da24f65954d78'),
('6ffdbefb0baf417d8782f90256915213', 'tag', 'Wi-Fi miễn phí', 'b86f9aa063ab4e57833333c903b0248a'),
('71d51facedea41489e8402134356f410', 'tag', 'Sân vườn', '37b32facfcfd4dd09e9fef1edcc60d5e'),
('7258fc4603c64e80be734346e6ce2fad', 'tag', 'Tiện nghi cho khách khuyết tật', '79981cf429254e06bb311dee7a92e7e6'),
('744423bf00284defab173b19c7f862ea', 'tag', 'Bếp', '67ba0e3f0fca420886a1ae45584a9834'),
('7e2bea63330747da8ee36c428faefb4b', 'tag', 'Tiện nghi BBQ', 'b86f9aa063ab4e57833333c903b0248a'),
('7ef81633888f42dc81e3bc0049977ff8', 'tag', 'Tiện nghi BBQ', '67ba0e3f0fca420886a1ae45584a9834'),
('8883734bf6a947b0bb89cfd9af1661d2', 'tag', 'Sân hiên', 'b86f9aa063ab4e57833333c903b0248a'),
('8c383784c2374ff9b97686b7e61d2a71', 'tag', 'Nhìn ra thành phố', 'b86f9aa063ab4e57833333c903b0248a'),
('9f1ea5735f7b4d96a79fdd1fd6aa7c87', 'tag', 'Sân vườn', 'b86f9aa063ab4e57833333c903b0248a'),
('a43451be90ce4cbaa99cb9d30c4d0a25', 'tag', 'Dịch vụ phòng', '79981cf429254e06bb311dee7a92e7e6'),
('a550cff51dc54b40bf395c43cb8d034b', 'tag', 'Wi-Fi miễn phí', '1e074dc83a1e4a239dfddc86fa6c1a03'),
('b0a4c282ea53443892dbf02cade46ff6', 'tag', 'Nhìn ra thành phố', '37b32facfcfd4dd09e9fef1edcc60d5e'),
('b42d235d417b434e8efc02250f7cf908', 'tag', 'Phòng không hút thuốc', '79981cf429254e06bb311dee7a92e7e6'),
('c5e095e3fc684d7ab2351911b0198de2', 'tag', 'Bếp', '0d98fb11fddb4d4ca02ac3b26a38c12a'),
('cf6260ecec8e4fb1bf99afe112f75409', 'tag', 'Wi-Fi miễn phí', '67ba0e3f0fca420886a1ae45584a9834'),
('d03ba71b894f48149211dc5116d8cf93', 'tag', 'Bếp', '02b92a38104842ea9ea9fe9646bf6f94'),
('d770e4c4ee8f4bc7863307916fd8df2a', 'tag', 'Chỗ đỗ xe miễn phí', '1e074dc83a1e4a239dfddc86fa6c1a03'),
('db377a48877b4534b39cadc91f022a86', 'tag', 'Quầy bar', '79981cf429254e06bb311dee7a92e7e6'),
('e2ff03745738440281c4a9f7dd344b20', 'tag', 'Tiện nghi BBQ', '0d98fb11fddb4d4ca02ac3b26a38c12a'),
('e3694162b47d490fb6ae5cb6ceef16f1', 'tag', 'Tiện nghi BBQ', '5ae3c6fce66b419cb9120e5b45fe5e24'),
('efdabf0af77946d28b926745b24dd4c0', 'tag', 'Máy giặt', 'b86f9aa063ab4e57833333c903b0248a'),
('f8022a6b21ae4cbe97212cfb84afdbca', 'tag', 'Nhìn ra thành phố', '5ae3c6fce66b419cb9120e5b45fe5e24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `p_bill_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_transaction_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_money` int(11) NOT NULL,
  `p_note` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_vnp_response_code` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_code_vnpay` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_code_bank` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `p_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `room_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hotel_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_desc` text COLLATE utf8mb4_unicode_ci DEFAULT '',
  `room_thumb` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name_img` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_people` int(11) NOT NULL,
  `room_quantity` int(11) NOT NULL,
  `room_booking` int(11) DEFAULT 0,
  `avaiable` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`room_id`, `floor_id`, `rt_id`, `status_id`, `hotel_id`, `room_name`, `room_desc`, `room_thumb`, `file_name_img`, `max_people`, `room_quantity`, `room_booking`, `avaiable`, `created_at`, `updated_at`) VALUES
('0bfe2b86c911419c930f2daafeeb4e5f', 'b27af104ba5b465685d4554e989ea12e', '87d6893b053f47d3bc9475f8f56dc79e', 'e6e4019134dd413db95a0af6b8027162', 'b86f9aa063ab4e57833333c903b0248a', 'test', 'test', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677898810/booking-hotel/mknkbrjxw0xosuzqvh7j.jpg', 'booking-hotel/mknkbrjxw0xosuzqvh7j', 2, 5, 0, 1, '2023-02-27 06:06:03', '2023-03-06 04:55:31'),
('12b83be1a61646cb970430cf6f69c719', '8dfe3ea0000346eb9385fe756c9169ed', '87d6893b053f47d3bc9475f8f56dc79e', 'e6e4019134dd413db95a0af6b8027162', '5ae3c6fce66b419cb9120e5b45fe5e24', 'Phòng đơn 2 người', 'Phòng dành cho 1 người', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949745/booking-hotel/cwjrtynn1jgbp9mamwhd.jpg', 'booking-hotel/cwjrtynn1jgbp9mamwhd', 2, 5, 2, 1, '2023-03-04 10:09:06', '2023-04-15 04:01:44'),
('553510d5925c43bb8ad1e56490334c71', 'dde8c9d5fb3a416db5c3a976bfeb2b13', '704240830ffc4f48835f94c51861b702', 'e6e4019134dd413db95a0af6b8027162', '79981cf429254e06bb311dee7a92e7e6', 'Phòng Superior Giường Đôi', 'Phòng sạch đẹp thoáng mát', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677904373/booking-hotel/m7aqxkrgcuzqnxohqqbg.jpg', 'booking-hotel/m7aqxkrgcuzqnxohqqbg', 2, 5, -2, 1, '2023-03-03 14:32:53', '2023-06-15 04:35:57'),
('7a9053e6046148208298dacbeee7add0', 'ecf440e257f648858a943ca2162b2be1', '87d6893b053f47d3bc9475f8f56dc79e', 'e6e4019134dd413db95a0af6b8027162', '02b92a38104842ea9ea9fe9646bf6f94', 'Phòng 1 người', 'Dành cho 1 người', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677947369/booking-hotel/fnl318rcp70c5rqohae6.jpg', 'booking-hotel/fnl318rcp70c5rqohae6', 1, 6, 0, 1, '2023-03-04 02:29:29', '2023-03-05 21:55:31'),
('7ed23bfdf90546c092b2b665cecbb038', '59244fff30a448e7a767feda5a0b28b1', '87d6893b053f47d3bc9475f8f56dc79e', 'e6e4019134dd413db95a0af6b8027162', 'd91abdcbfa7944e684f3efba8e0924ca', 'Phòng 1 người', 'Phòng dành cho 1 người', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949288/booking-hotel/zs4na9ae8xwgx79k8btc.jpg', 'booking-hotel/zs4na9ae8xwgx79k8btc', 1, 5, 0, 1, '2023-03-04 17:01:28', '2023-03-06 04:55:31'),
('9633adb50eab4ba8931862fe2727fc95', '91fe579a41c7497f8fb5381660394715', '87d6893b053f47d3bc9475f8f56dc79e', 'e6e4019134dd413db95a0af6b8027162', '37b32facfcfd4dd09e9fef1edcc60d5e', 'Phòng Đơn', 'Phòng dành cho 1 người', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677918204/booking-hotel/cjyjycq4613ubdumercz.jpg', 'booking-hotel/cjyjycq4613ubdumercz', 1, 6, 6, 0, '2023-03-03 04:23:23', '2023-04-14 09:01:06'),
('97d68ce7401d49939a359187c3d179c4', 'b94d280973d047d9a993b5838e0b2e56', '87d6893b053f47d3bc9475f8f56dc79e', 'e6e4019134dd413db95a0af6b8027162', 'b86f9aa063ab4e57833333c903b0248a', 'Phòng 1 người', 'Đây là phòng chỉ dành cho một người', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677859252/booking-hotel/wvogkt7ueglttjabj3zp.jpg', 'booking-hotel/wvogkt7ueglttjabj3zp', 1, 5, 0, 1, '2023-03-03 02:00:53', '2023-03-06 04:55:31'),
('b11a1b98a0c44d34832a21593f7f3cb0', 'c3c8c059018c4ba8ab1847492d8e5612', '704240830ffc4f48835f94c51861b702', 'e6e4019134dd413db95a0af6b8027162', 'c865704402d041449e8da24f65954d78', 'Phòng 1 người', 'Phòng sạch, đẹp, thoángg mát', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1678933244/booking-hotel/ghww5gcmtdjrjk68wdrr.jpg', 'booking-hotel/ghww5gcmtdjrjk68wdrr', 2, 3, 0, 0, '2023-03-16 02:20:42', '2023-04-15 04:01:01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_images`
--

CREATE TABLE `room_images` (
  `r_image_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `r_image_value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `room_images`
--

INSERT INTO `room_images` (`r_image_id`, `r_image_value`, `file_name`, `room_id`) VALUES
('09bd08535ad742e2adfb963cfb53ffa9', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677855959/booking-hotel/y7kcbpscxsmeebugdzvo.jpg', 'booking-hotel/y7kcbpscxsmeebugdzvo', '0bfe2b86c911419c930f2daafeeb4e5f'),
('0a5a80e66b744408a5237ba07869044e', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677918204/booking-hotel/qaezacy12gjue6zimewa.jpg', 'booking-hotel/qaezacy12gjue6zimewa', '9633adb50eab4ba8931862fe2727fc95'),
('2e5a410367c74ee38896f28baf48112d', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949288/booking-hotel/obir3ubypqmwaldm0rkj.jpg', 'booking-hotel/obir3ubypqmwaldm0rkj', '7ed23bfdf90546c092b2b665cecbb038'),
('3180dbcbbe3545549fcc8501083639dd', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949745/booking-hotel/mxsthvggbiyezdokhdtc.jpg', 'booking-hotel/mxsthvggbiyezdokhdtc', '12b83be1a61646cb970430cf6f69c719'),
('389e2b445440456da940ea7418c50553', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677918204/booking-hotel/ldhxrntvx4h6xfknd5yi.jpg', 'booking-hotel/ldhxrntvx4h6xfknd5yi', '9633adb50eab4ba8931862fe2727fc95'),
('3d8161e9bae34355aeb34f4d2e82d2ea', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677859252/booking-hotel/s4lml5vnknnamywuokkh.jpg', 'booking-hotel/s4lml5vnknnamywuokkh', '97d68ce7401d49939a359187c3d179c4'),
('481df7f6324540f0b0711ba2e786487b', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677904373/booking-hotel/mdegto9ign0ma9nxqxkn.jpg', 'booking-hotel/mdegto9ign0ma9nxqxkn', '553510d5925c43bb8ad1e56490334c71'),
('521e4828e9f04369aa0123c6bf3adb0a', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949745/booking-hotel/kopdcq4jwq1goinvybjv.jpg', 'booking-hotel/kopdcq4jwq1goinvybjv', '12b83be1a61646cb970430cf6f69c719'),
('5ae07d7edfb74219ab718f40342d8ad6', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677859252/booking-hotel/endc91pes8t7ohyiyb0i.jpg', 'booking-hotel/endc91pes8t7ohyiyb0i', '97d68ce7401d49939a359187c3d179c4'),
('644153b8d1d9436cafeba00254ecfc79', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677904373/booking-hotel/kk4niexdmzkmjze7daox.jpg', 'booking-hotel/kk4niexdmzkmjze7daox', '553510d5925c43bb8ad1e56490334c71'),
('6a38ebbf16eb45c290a66b5b282595b5', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949288/booking-hotel/nto2oxczoepbtd85qbvh.jpg', 'booking-hotel/nto2oxczoepbtd85qbvh', '7ed23bfdf90546c092b2b665cecbb038'),
('802db8e7cb1d4423a8a1769598f7dead', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677904374/booking-hotel/hh8tjmkuqeaa21crbzno.jpg', 'booking-hotel/hh8tjmkuqeaa21crbzno', '553510d5925c43bb8ad1e56490334c71'),
('903e4d81fc3a4bf48109c754fb482c89', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677855961/booking-hotel/diizpuvi9in6lje1vahc.jpg', 'booking-hotel/diizpuvi9in6lje1vahc', '0bfe2b86c911419c930f2daafeeb4e5f'),
('9ba624713b414893961fcdc4cb68eb8e', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677904373/booking-hotel/ygbcjwaenppyr7y7rppz.jpg', 'booking-hotel/ygbcjwaenppyr7y7rppz', '553510d5925c43bb8ad1e56490334c71'),
('a8d17376a731460d8e2edcfb810198bc', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677947369/booking-hotel/x4zwmyme0flqj10fkut6.jpg', 'booking-hotel/x4zwmyme0flqj10fkut6', '7a9053e6046148208298dacbeee7add0'),
('b96880ee1af042d1b2958154470461d5', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677904373/booking-hotel/vmf34sfcjcs2fstkyymk.jpg', 'booking-hotel/vmf34sfcjcs2fstkyymk', '553510d5925c43bb8ad1e56490334c71'),
('be0a1f2f1a0c44a2a1d5c34d29f0f4c1', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677904374/booking-hotel/ok4vgp3osfkey3axrbic.jpg', 'booking-hotel/ok4vgp3osfkey3axrbic', '553510d5925c43bb8ad1e56490334c71'),
('be9e6cc6b7be4ffd98c11af906f44d9d', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949745/booking-hotel/dmcfrxh4wplwjt8iavft.jpg', 'booking-hotel/dmcfrxh4wplwjt8iavft', '12b83be1a61646cb970430cf6f69c719'),
('cf571e03083d48ab983518e6d430ebdb', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677947369/booking-hotel/c9fc5vls7j2kfgxsqexh.jpg', 'booking-hotel/c9fc5vls7j2kfgxsqexh', '7a9053e6046148208298dacbeee7add0'),
('cfa34ecdec534136bf4111a754452d75', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677918204/booking-hotel/znyokihjdez92xcmnneb.jpg', 'booking-hotel/znyokihjdez92xcmnneb', '9633adb50eab4ba8931862fe2727fc95'),
('dd7b0b195d98486799c0fee27ba54f23', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677855961/booking-hotel/rakuiuj29ptso9tffeqr.jpg', 'booking-hotel/rakuiuj29ptso9tffeqr', '0bfe2b86c911419c930f2daafeeb4e5f'),
('dde1e4bcae4c4130aff2a701f697fb3f', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1678933244/booking-hotel/sez2auatwoplzosprl2u.jpg', 'booking-hotel/sez2auatwoplzosprl2u', 'b11a1b98a0c44d34832a21593f7f3cb0'),
('e3efdc032dc84032999ed8afec20ee38', 'https://res.cloudinary.com/dtsq971i7/image/upload/v1677949288/booking-hotel/ou4gfewywdedwqlt2kra.jpg', 'booking-hotel/ou4gfewywdedwqlt2kra', '7ed23bfdf90546c092b2b665cecbb038');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_prices`
--

CREATE TABLE `room_prices` (
  `floor_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int(11) DEFAULT NULL CHECK (`price` > 10),
  `date_time` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `discount` tinyint(1) DEFAULT 0,
  `percent_discount` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `room_prices`
--

INSERT INTO `room_prices` (`floor_id`, `room_id`, `price`, `date_time`, `discount`, `percent_discount`) VALUES
('b27af104ba5b465685d4554e989ea12e', '0bfe2b86c911419c930f2daafeeb4e5f', 11111112, '2023-03-03 22:36:35', 1, 20),
('8dfe3ea0000346eb9385fe756c9169ed', '12b83be1a61646cb970430cf6f69c719', 1000000, '2023-03-05 00:09:06', 1, 1),
('dde8c9d5fb3a416db5c3a976bfeb2b13', '553510d5925c43bb8ad1e56490334c71', 400000, '2023-03-09 11:55:51', 1, 10),
('ecf440e257f648858a943ca2162b2be1', '7a9053e6046148208298dacbeee7add0', 222222, '2023-03-04 23:29:29', 0, 0),
('59244fff30a448e7a767feda5a0b28b1', '7ed23bfdf90546c092b2b665cecbb038', 2222222, '2023-03-05 00:01:28', 1, 10),
('91fe579a41c7497f8fb5381660394715', '9633adb50eab4ba8931862fe2727fc95', 1111111, '2023-03-04 15:23:23', 0, 0),
('b94d280973d047d9a993b5838e0b2e56', '97d68ce7401d49939a359187c3d179c4', 200000, '2023-03-03 23:00:53', 0, 0),
('c3c8c059018c4ba8ab1847492d8e5612', 'b11a1b98a0c44d34832a21593f7f3cb0', 2222222, '2023-03-16 09:20:42', 0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `room_types`
--

CREATE TABLE `room_types` (
  `rt_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rt_desc` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `room_types`
--

INSERT INTO `room_types` (`rt_id`, `rt_name`, `rt_type`, `rt_desc`) VALUES
('415b53927acf406ea20331cbe088b444', 'Phòng tiêu chuẩn có giường King', 'PT1', '1 giường đôi lớn'),
('5f40a30c35dc4a678a084495d188e4ab', 'Phòng 3 người có bồn tắm', 'PL31L1BL', '1 giường đôi và 1 giường đôi cực lớn'),
('704240830ffc4f48835f94c51861b702', 'Phòng 2 người', 'PL2', 'Dành cho 2 người và 1 trẻ nhỏ'),
('87d6893b053f47d3bc9475f8f56dc79e', 'Phòng 1 người', 'P1', 'Danh cho 1 người dung nhất'),
('a31d41355f454fca942dbd1754aa50e9', 'Phòng 4 người', 'PL24', '2 giường đôi'),
('deb7218077834e0686d341ef2361c0fb', 'Phòng Deluxe 4 Người', 'PD4-2BL', '2 giường đôi cực lớn ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seesions`
--

CREATE TABLE `seesions` (
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `services`
--

CREATE TABLE `services` (
  `service_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_desc` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `service_price` int(11) NOT NULL CHECK (`service_price` > 10),
  `hotel_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `statuses`
--

CREATE TABLE `statuses` (
  `status_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `statuses`
--

INSERT INTO `statuses` (`status_id`, `type`, `desc`, `key`, `value`) VALUES
('7547cac7c71148fd937f562e875acbf8', 'KH', 'Trạng thái không hiển thị sau khi tạo', 'KH1', 'HIDE'),
('e6e4019134dd413db95a0af6b8027162', 'KH', 'Trạng thái hiển thị sau khi tạo', 'KH2', 'SHOW');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tokens`
--

CREATE TABLE `tokens` (
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `bill_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'bill của đơn thanh toán',
  `order_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'mã vnp_TxnRef',
  `vnp_command` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pay',
  `vnp_response_code_refund` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vnp_message_refund` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` bigint(20) UNSIGNED NOT NULL COMMENT 'Tổng tiền',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'trạng thái của giao dịch',
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ID giao dịch được VNPay trả về sau khi xử lý thanh toán.',
  `bank_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã của ngân hàng đã xử lý thanh toán.',
  `pay_date` datetime DEFAULT NULL COMMENT 'Ngày và thời gian thanh toán được xử lý.',
  `response_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã phản hồi do VNPay trả về.',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `transactions`
--

INSERT INTO `transactions` (`id`, `bill_id`, `order_id`, `vnp_command`, `vnp_response_code_refund`, `vnp_message_refund`, `amount`, `status`, `transaction_id`, `bank_code`, `pay_date`, `response_code`, `created_at`, `updated_at`) VALUES
(22, 'bbfc28e8a3374232844618448e76b4c1', '20230615113411', 'pay', NULL, NULL, 360000, 'SUCCESS', '14039497', 'NCB', '2023-06-15 11:34:42', '00', '2023-06-15 04:34:12', '2023-06-15 04:34:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identity_card` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year_of_brith` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `address` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `picture` text COLLATE utf8mb4_unicode_ci DEFAULT '',
  `file_name_picture` text COLLATE utf8mb4_unicode_ci DEFAULT '',
  `hotel_id` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verify` tinyint(1) DEFAULT 0,
  `role` enum('ADMIN','HOTEL','USER') COLLATE utf8mb4_unicode_ci DEFAULT 'USER',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `username`, `password`, `phone`, `identity_card`, `year_of_brith`, `address`, `picture`, `file_name_picture`, `hotel_id`, `is_verify`, `role`, `created_at`, `updated_at`) VALUES
('5b6072ce53e645b4a286d40b53132f94', 'test', 'test1', 'test@gmail.com', 'test123', '$2b$10$DPWePDTV0Y7J5f/gp42hMeHBAVH4S0BX/sqcBtZJhxf7xnmhwmhtq', '0292822123', NULL, '', '', '', '', NULL, 0, 'USER', '2023-03-01 15:19:05', '2023-03-01 15:19:05'),
('d111cf3138f6484aa6d7e0e80cece7e4', 'test', 'test', 'test1@gmail.com', 'test1234', '$2b$10$4xwXXunFHD5We.gXx5EgV.tUkHoAJ.InPgq5cqAf0oKfzD2u27rkC', '0292928121', NULL, '', '', '', '', NULL, 0, 'HOTEL', '2023-03-01 15:19:53', '2023-03-14 00:48:29'),
('fc98bbeda29b42df9a5b54bbaef0029c', 'Phan Tấn', 'Lộc', 'admin@gmail.com', 'admin123', '$2b$10$9Xb2Ki.NDHQpR.YJZlDEoOLy6ACBnTMp7T736mrBHgTHCwBOWurv.', '0218212123', NULL, '', '', '', '', NULL, 0, 'ADMIN', '2023-03-01 14:36:06', '2023-03-13 06:40:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `use_service`
--

CREATE TABLE `use_service` (
  `floor_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bill_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD UNIQUE KEY `bill_id` (`bill_id`),
  ADD KEY `user_id` (`user_id`);
ALTER TABLE `bills` ADD FULLTEXT KEY `bill_id_2` (`bill_id`);

--
-- Chỉ mục cho bảng `bill_details`
--
ALTER TABLE `bill_details`
  ADD PRIMARY KEY (`bill_id`,`room_id`,`floor_id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `floor_id` (`floor_id`);

--
-- Chỉ mục cho bảng `device_types`
--
ALTER TABLE `device_types`
  ADD PRIMARY KEY (`dt_id`),
  ADD UNIQUE KEY `dt_id` (`dt_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `floors`
--
ALTER TABLE `floors`
  ADD PRIMARY KEY (`floor_id`),
  ADD UNIQUE KEY `floor_id` (`floor_id`),
  ADD KEY `hotel_id` (`hotel_id`) USING BTREE;

--
-- Chỉ mục cho bảng `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`hotel_id`),
  ADD UNIQUE KEY `hotel_id` (`hotel_id`),
  ADD UNIQUE KEY `hotel_name` (`hotel_name`),
  ADD KEY `fk_owner_id` (`owner_id`);
ALTER TABLE `hotels` ADD FULLTEXT KEY `provice_name` (`provice_name`);

--
-- Chỉ mục cho bảng `hotel_images`
--
ALTER TABLE `hotel_images`
  ADD PRIMARY KEY (`h_image_id`),
  ADD UNIQUE KEY `h_image_id` (`h_image_id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Chỉ mục cho bảng `hotel_tags`
--
ALTER TABLE `hotel_tags`
  ADD PRIMARY KEY (`tag_id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `p_user_id` (`p_user_id`),
  ADD KEY `p_bill_id` (`p_bill_id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`,`floor_id`),
  ADD UNIQUE KEY `room_id` (`room_id`),
  ADD KEY `floor_id` (`floor_id`),
  ADD KEY `rt_id` (`rt_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Chỉ mục cho bảng `room_images`
--
ALTER TABLE `room_images`
  ADD PRIMARY KEY (`r_image_id`),
  ADD UNIQUE KEY `r_image_id` (`r_image_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `room_prices`
--
ALTER TABLE `room_prices`
  ADD PRIMARY KEY (`room_id`,`floor_id`),
  ADD KEY `floor_id` (`floor_id`);

--
-- Chỉ mục cho bảng `room_types`
--
ALTER TABLE `room_types`
  ADD PRIMARY KEY (`rt_id`),
  ADD UNIQUE KEY `rt_id` (`rt_id`),
  ADD UNIQUE KEY `rt_type` (`rt_type`);

--
-- Chỉ mục cho bảng `seesions`
--
ALTER TABLE `seesions`
  ADD PRIMARY KEY (`user_id`);

--
-- Chỉ mục cho bảng `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`),
  ADD UNIQUE KEY `service_id` (`service_id`),
  ADD UNIQUE KEY `service_name` (`service_name`),
  ADD KEY `hotel_id` (`hotel_id`);

--
-- Chỉ mục cho bảng `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `status_id` (`status_id`),
  ADD UNIQUE KEY `key` (`key`),
  ADD UNIQUE KEY `value` (`value`);

--
-- Chỉ mục cho bảng `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`user_id`);

--
-- Chỉ mục cho bảng `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bill_id` (`bill_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `identity_card` (`identity_card`),
  ADD KEY `hotel_id` (`hotel_id`);
ALTER TABLE `users` ADD FULLTEXT KEY `first_name` (`first_name`,`last_name`);

--
-- Chỉ mục cho bảng `use_service`
--
ALTER TABLE `use_service`
  ADD PRIMARY KEY (`bill_id`,`room_id`,`floor_id`,`service_id`),
  ADD KEY `floor_id` (`floor_id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `service_id` (`service_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `bill_details`
--
ALTER TABLE `bill_details`
  ADD CONSTRAINT `bill_details_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bill_details_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bill_details_ibfk_3` FOREIGN KEY (`floor_id`) REFERENCES `rooms` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `device_types`
--
ALTER TABLE `device_types`
  ADD CONSTRAINT `device_types_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `floors`
--
ALTER TABLE `floors`
  ADD CONSTRAINT `floors_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `hotels`
--
ALTER TABLE `hotels`
  ADD CONSTRAINT `fk_owner_id` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `hotel_images`
--
ALTER TABLE `hotel_images`
  ADD CONSTRAINT `hotel_images_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `hotel_tags`
--
ALTER TABLE `hotel_tags`
  ADD CONSTRAINT `hotel_tags_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`p_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`p_bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_ibfk_2` FOREIGN KEY (`rt_id`) REFERENCES `room_types` (`rt_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_ibfk_4` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `room_images`
--
ALTER TABLE `room_images`
  ADD CONSTRAINT `room_images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `room_prices`
--
ALTER TABLE `room_prices`
  ADD CONSTRAINT `room_prices_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `rooms` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `room_prices_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `seesions`
--
ALTER TABLE `seesions`
  ADD CONSTRAINT `seesions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`hotel_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `use_service`
--
ALTER TABLE `use_service`
  ADD CONSTRAINT `use_service_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `bill_details` (`floor_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `use_service_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `bill_details` (`room_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `use_service_ibfk_3` FOREIGN KEY (`bill_id`) REFERENCES `bill_details` (`bill_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `use_service_ibfk_4` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
