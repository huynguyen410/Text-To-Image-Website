<?php
header('Content-Type: application/json');
session_start();
require_once '../src/db_connect.php'; // Đảm bảo đường dẫn này đúng

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

$whereClause = " WHERE deleted_at IS NULL ";

// Lấy tổng số dòng (chỉ đếm người dùng chưa bị xóa mềm)
$countSql = "SELECT COUNT(*) AS total FROM users" . $whereClause;
$countResult = mysqli_query($conn, $countSql);
if (!$countResult) {
     echo json_encode(['success' => false, 'message' => 'Count Query Error: ' . mysqli_error($conn)]);
     exit;
}
$totalRow = mysqli_fetch_assoc($countResult);
$total = $totalRow['total'];
$total_pages = ($limit > 0) ? ceil($total / $limit) : 0;

// --- THAY ĐỔI ORDER BY ---
$sql = "SELECT id, username, email, created_at, role,
               isPremium as is_premium,
               startPremium as start_premium,
               endPremium as end_premium
        FROM users
       " . $whereClause . "
        ORDER BY id ASC -- Sắp xếp theo ID tăng dần
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

$users = array();
while ($row = mysqli_fetch_assoc($result)) {
    $users[] = $row;
}
mysqli_stmt_close($stmt);
mysqli_close($conn);

echo json_encode([
    'success' => true,
    'user' => $users,
    'page' => $page,
    'total_pages' => $total_pages
]);
?>