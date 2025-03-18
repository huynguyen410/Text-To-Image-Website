<?php
header('Content-Type: application/json');
session_start();
require_once '../src/db_connect.php';

// Kiểm tra quyền admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { 
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$allowedLimits = [5, 10, 20, 50];
$limit = isset($_GET['limit']) && in_array(intval($_GET['limit']), $allowedLimits) ? intval($_GET['limit']) : 10;
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
if ($page < 1) {
    $page = 1;
}
$offset = ($page - 1) * $limit;

// Lấy tổng số dòng
$countSql = "SELECT COUNT(*) AS total FROM users";
$countResult = mysqli_query($conn, $countSql);
$totalRow = mysqli_fetch_assoc($countResult);
$total = $totalRow['total'];
$total_pages = ceil($total / $limit);

// Lấy danh sách người dùng theo phân trang
$sql = "SELECT id, username, email, created_at, role FROM users LIMIT $limit OFFSET $offset";
$result = mysqli_query($conn, $sql);

$users = array();
while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}

mysqli_close($conn);

echo json_encode([
    'success' => true, 
    'user' => $users, 
    'page' => $page, 
    'total_pages' => $total_pages
]);
?>
