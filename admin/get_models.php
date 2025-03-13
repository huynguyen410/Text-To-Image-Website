<?php
header('Content-Type: application/json');
session_start();
require_once '../src/db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { 
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$sql = "SELECT id, model_id, name, description, status FROM models";
$result = mysqli_query($conn, $sql);

$models = array();
while ($row = mysqli_fetch_assoc($result)) {
    $models[] = $row;
}

mysqli_close($conn);

echo json_encode(['success' => true, 'models' => $models]);
?>