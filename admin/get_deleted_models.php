<?php
header('Content-Type: application/json');
session_start();
require_once '../src/db_connect.php';

// Kiểm tra quyền admin
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$allowedLimits = [5, 10, 20, 25, 50];
$limit = isset($_GET['limit']) && in_array(intval($_GET['limit']), $allowedLimits) ? intval($_GET['limit']) : 10;
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
if ($page < 1) {
    $page = 1;
}
$offset = ($page - 1) * $limit;

// Lấy tổng số dòng đã xóa
$countSql = "SELECT COUNT(*) AS total FROM models WHERE deleted_at IS NOT NULL";
$countResult = mysqli_query($conn, $countSql);
if (!$countResult) {
    echo json_encode(['success' => false, 'message' => 'Count Query Error: ' . mysqli_error($conn)]);
    exit;
}
$totalRow = mysqli_fetch_assoc($countResult);
$total = $totalRow['total'];
$total_pages = ($limit > 0) ? ceil($total / $limit) : 0;

// Lấy danh sách model đã xóa
$sql = "SELECT id, model_id, name, description, status, deleted_at 
        FROM models 
        WHERE deleted_at IS NOT NULL 
        ORDER BY deleted_at DESC 
        LIMIT ? OFFSET ?";

$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare Statement Error: ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "ii", $limit, $offset);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$models = array();
while ($row = mysqli_fetch_assoc($result)) {
    $models[] = $row;
}

if (isset($stmt)) {
    mysqli_stmt_close($stmt);
}
mysqli_close($conn);

echo json_encode([
    'success' => true,
    'model' => $models,
    'page' => $page,
    'total_pages' => $total_pages
]);
?> 