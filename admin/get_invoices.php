<?php
ob_start();
header('Content-Type: application/json');
session_start();
require_once '../src/db_connect.php';

// Kiểm tra quyền admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { 
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$allowedLimits = [5, 10, 20, 50];
$limit = isset($_GET['limit']) && in_array((int)$_GET['limit'], $allowedLimits) ? (int)$_GET['limit'] : 10;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) {
    $page = 1;
}
$offset = ($page - 1) * $limit;

// Lấy tổng số dòng trong bảng invoice
$countSql = "SELECT COUNT(*) AS total FROM invoice";
$countResult = mysqli_query($conn, $countSql);
if (!$countResult) {
    echo json_encode(['success' => false, 'message' => 'Count Query Error: ' . mysqli_error($conn)]);
    exit;
}
$totalRow = mysqli_fetch_assoc($countResult);
$total = $totalRow['total'];
$total_pages = ceil($total / $limit);

// Lấy danh sách invoice với các cột đã được cập nhật
$sql = "SELECT i.invoice_id, i.customer_id, i.total_price, i.created_at, u.username as customer_name 
        FROM invoice i 
        LEFT JOIN users u ON i.customer_id = u.id 
        LIMIT $limit OFFSET $offset";
$result = mysqli_query($conn, $sql);
if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Fetch Query Error: ' . mysqli_error($conn)]);
    exit;
}

$invoices = array();
while ($row = mysqli_fetch_assoc($result)) {
    $invoices[] = $row;
}

mysqli_close($conn);
ob_end_clean();
echo json_encode([
    'success'     => true, 
    'invoice'     => $invoices, 
    'page'        => $page, 
    'total_pages' => $total_pages
]);
?>
