<?php
session_start();
require_once '../src/db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { 
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$id = $_POST['id'];
$username = $_POST['username'];
$email = $_POST['email'];
$password = isset($_POST['password']) ? $_POST['password'] : '';
$confirm_password = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : ''; // Get confirm_password

// Validate input
if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Username is required']);
    exit;
}

// Kiểm tra email nếu có giá trị
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Chuẩn bị câu lệnh SQL
if (!empty($password)) {
    // Validate confirm password
    if (empty($confirm_password)) {
        echo json_encode(['success' => false, 'message' => 'Please confirm the new password']);
        exit;
    }
    if ($password !== $confirm_password) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
        exit;
    }

    // Nếu mật khẩu mới hợp lệ, mã hóa và cập nhật cả mật khẩu
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $sql = "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sssi", $username, $email, $hashed_password, $id);
} else {
    // Nếu không có mật khẩu mới, chỉ cập nhật username và email
    $sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ssi", $username, $email, $id);
}

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'User updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>