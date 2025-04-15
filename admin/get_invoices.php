<?php
ob_start(); // Bắt đầu output buffering
header('Content-Type: application/json');
session_start();
require_once '../src/db_connect.php'; // Đảm bảo đường dẫn này đúng

// Kiểm tra quyền admin
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$allowedLimits = [5, 10, 20, 25, 50];
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
$total_pages = ($limit > 0) ? ceil($total / $limit) : 0;

// --- THAY ĐỔI ORDER BY ---
$sql = "SELECT i.invoice_id, i.customer_id, i.customer_username, i.total_price, i.created_at
        FROM invoice i
        ORDER BY i.invoice_id ASC -- Sắp xếp theo invoice_id tăng dần
        LIMIT ? OFFSET ?";
// --- KẾT THÚC THAY ĐỔI ---

$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Prepare Statement Error: ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "ii", $limit, $offset);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);


$invoices = array();
while ($row = mysqli_fetch_assoc($result)) {
     // Map key nếu cần cho JS
     $row['customer_name'] = $row['customer_username'];
     unset($row['customer_username']);
    $invoices[] = $row;
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
ob_end_clean(); // Kết thúc và xóa output buffering

echo json_encode([
    'success'     => true,
    'invoice'     => $invoices,
    'page'        => $page,
    'total_pages' => $total_pages
]);
?>