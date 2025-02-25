<?php
header('Content-Type: application/json');
require_once 'db_connect.php'; // Include file kết nối cơ sở dữ liệu

$username = $_POST['username'];
$password = $_POST['password'];
$email = isset($_POST['email']) ? $_POST['email'] : null; // Lấy email (nếu có)

// Kiểm tra xem username đã tồn tại hay chưa
$sql = "SELECT id FROM users WHERE username = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "s", $username);
mysqli_stmt_execute($stmt);
mysqli_stmt_store_result($stmt);

if (mysqli_stmt_num_rows($stmt) > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists']);
} else {
    // Băm mật khẩu
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Thêm người dùng vào cơ sở dữ liệu
    $sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "sss", $username, $hashed_password, $email);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
    }
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>