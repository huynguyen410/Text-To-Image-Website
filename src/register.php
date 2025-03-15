<?php
ob_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once 'db_connect.php';

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');
$email = trim($_POST['email'] ?? '');

// Kiểm tra thông tin cần thiết
if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required']);
    exit;
}

// Kiểm tra xem username đã tồn tại hay chưa
$sql = "SELECT id FROM users WHERE username = ?";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "s", $username);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);
if (mysqli_stmt_num_rows($stmt) > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists']);
    exit;
}
mysqli_stmt_close($stmt);

// Băm mật khẩu
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$role = 'customer';  // Role mặc định của user mới
$image_quota = 20;   // Số lượt tạo ảnh mặc định
$isPremium = 'no';   // isPremium mặc định

$sql = "INSERT INTO users (username, password, email, role, image_quota, isPremium) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "ssssis", $username, $hashed_password, $email, $role, $image_quota, $isPremium);
if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);

// Thay vì ob_end_clean(), dùng flush để gửi output
ob_end_flush();
exit;
?>
