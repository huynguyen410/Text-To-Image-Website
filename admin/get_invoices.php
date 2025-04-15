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

$allowedLimits = [5, 10, 20, 25, 50]; // Thêm 25 vào danh sách hợp lệ
$limit = isset($_GET['limit']) && in_array((int)$_GET['limit'], $allowedLimits) ? (int)$_GET['limit'] : 10;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) {
    $page = 1;
}
$offset = ($page - 1) * $limit;

// Lấy tổng số dòng trong bảng invoice (không cần join)
$countSql = "SELECT COUNT(*) AS total FROM invoice";
$countResult = mysqli_query($conn, $countSql);
if (!$countResult) {
    echo json_encode(['success' => false, 'message' => 'Count Query Error: ' . mysqli_error($conn)]);
    exit;
}
$totalRow = mysqli_fetch_assoc($countResult);
$total = $totalRow['total'];
$total_pages = ($limit > 0) ? ceil($total / $limit) : 0;

// --- THAY ĐỔI CÂU LỆNH SQL ---
// Bỏ LEFT JOIN users, chọn trực tiếp customer_username từ bảng invoice
$sql = "SELECT i.invoice_id, i.customer_id, i.customer_username, i.total_price, i.created_at
        FROM invoice i
        ORDER BY i.created_at DESC -- Sắp xếp hóa đơn mới nhất lên đầu (tùy chọn)
        LIMIT ? OFFSET ?"; // Sử dụng prepared statement
// --- KẾT THÚC THAY ĐỔI SQL ---

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
    // Đổi tên key 'customer_name' thành 'customer_username' để nhất quán
    // Hoặc giữ nguyên 'customer_name' nếu JS đã dùng key này, chỉ cần đảm bảo gán đúng giá trị
     $row['customer_name'] = $row['customer_username']; // Gán giá trị từ cột mới vào key cũ mà JS đang dùng
     unset($row['customer_username']); // Xóa key gốc nếu không cần
    $invoices[] = $row;
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
ob_end_clean(); // Kết thúc và xóa output buffering

echo json_encode([
    'success'     => true,
    'invoice'     => $invoices, // Giữ nguyên key 'invoice' như JS đang dùng
    'page'        => $page,
    'total_pages' => $total_pages
]);
?>