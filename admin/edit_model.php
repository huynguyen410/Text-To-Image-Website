<?php
session_start();

// Đảm bảo phản hồi luôn là JSON
header('Content-Type: application/json');

// Kiểm tra lỗi PHP và tắt hiển thị lỗi trên production
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

require_once '../src/db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Kiểm tra kết nối cơ sở dữ liệu
if (!$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// Lấy dữ liệu từ POST
$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$model_id = isset($_POST['model_id']) ? trim($_POST['model_id']) : '';
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$status = isset($_POST['status']) ? trim($_POST['status']) : '';

// Validate input
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid model ID']);
    exit;
}
if (empty($model_id) || empty($name) || empty($status)) {
    echo json_encode(['success' => false, 'message' => 'Model ID, Name, and Status are required']);
    exit;
}
if (!in_array($status, ['active', 'inactive'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid status value']);
    exit;
}

// Chuẩn bị và thực thi câu lệnh SQL
$sql = "UPDATE models SET model_id = ?, name = ?, description = ?, status = ? WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare statement failed: ' . mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "ssssi", $model_id, $name, $description, $status, $id);
if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'message' => 'Model updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating model: ' . mysqli_error($conn)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>