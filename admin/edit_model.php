<?php
session_start();
require_once '../src/db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { 
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$id = $_POST['id'];
$model_id = $_POST['model_id'];
$name = $_POST['name'];
$description = $_POST['description'];
$status = $_POST['status'];

// Validate input (add more validation as needed)
if (empty($model_id) || empty($name) || empty($status)) {
    echo json_encode(['success' => false, 'message' => 'Model ID, Name and Status are required']);
    exit;
}

$sql = "UPDATE models SET model_id = ?, name = ?, description = ?, status = ? WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ssssi", $model_id, $name, $description, $status, $id);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'Model updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>