<?php
include 'time_out.php'; // timeout session
header('Content-Type: application/json');
require_once 'db_connect.php';

// Kiểm tra xem thông tin đăng nhập có được gửi đến không
if (!isset($_POST['username']) || !isset($_POST['password'])) {
    echo json_encode(['success' => false, 'message' => 'Vui lòng điền đầy đủ thông tin đăng nhập']);
    exit;
}

$username = trim($_POST['username']);
$password = trim($_POST['password']);

// Tìm người dùng trong cơ sở dữ liệu
$sql = "SELECT id, username, password, role FROM users WHERE username = ?";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "s", $username);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    // Xác minh mật khẩu
    if (password_verify($password, $row['password'])) {
        // Lưu thông tin người dùng vào session
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['role'] = $row['role'];
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Incorrect password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
