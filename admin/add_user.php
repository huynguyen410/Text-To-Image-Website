<?php
session_start();
require_once '../src/db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || $_SESSION['username'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
$email = $_POST['email'] ?? '';
$role = $_POST['role'] ?? '';

// Validate input (thêm kiểm tra nếu cần)
if (empty($username) || empty($password) || empty($role)) {
    echo json_encode(['success' => false, 'message' => 'Username, password, and role are required']);
    exit;
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Đặt số lần tạo ảnh theo role
$image_quota = ($role === 'admin') ? 99999 : 20;
$isPremium = ($role === 'admin') ? 'yes' : 'no';

$sql = "INSERT INTO users (username, password, email, role, image_quota, isPremium) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "ssssis", $username, $hashed_password, $email, $role, $image_quota, $isPremium);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'User added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
exit;
?>
