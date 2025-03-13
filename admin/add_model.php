<?php
session_start();
require_once '../src/db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { 
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$model_id = $_POST['model_id'];
$name = $_POST['name'];
$description = $_POST['description'];

// Validate input (add more validation as needed)
if (empty($model_id) || empty($name)) {
    echo json_encode(['success' => false, 'message' => 'Model ID and Name are required']);
    exit;
}

$sql = "INSERT INTO models (model_id, name, description) VALUES (?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "sss", $model_id, $name, $description);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'Model added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>