<?php
// Bao gồm các file cần thiết
require_once 'db_connect.php'; // Cần kết nối DB để xóa token
require_once 'gmail_token_manager.php'; // Cần để lấy Auth URL

// Xóa refresh token cũ trong database
$sql = "UPDATE gmail_credentials SET refresh_token = NULL WHERE credential_key = 'main_refresh_token'";
if (mysqli_query($conn, $sql)) {
    echo "Đã xóa refresh token cũ trong database.<br>";
} else {
    echo "Lỗi khi xóa refresh token trong database: " . mysqli_error($conn) . "<br>";
}

// Tạo URL xác thực mới
// Cần tạo instance mới vì constructor yêu cầu $conn
$tokenManager = new GmailTokenManager($conn);
$authUrl = $tokenManager->getAuthUrl();

// Hiển thị link để người dùng click vào
echo "Click vào link sau để xác thực lại với Gmail và lưu refresh token vào database:<br>";
echo "<a href='" . htmlspecialchars($authUrl) . "'>Xác thực Gmail</a>"; // Dùng htmlspecialchars cho an toàn

mysqli_close($conn); // Đóng kết nối
?>