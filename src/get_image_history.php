<?php
header('Content-Type: application/json');
session_start();
require_once 'db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập hay chưa
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Cho phép limit là 10, 20, 50, 100; mặc định là 10 nếu không truyền hoặc không hợp lệ
$allowedLimits = [10, 20, 50, 100];
$limit = (isset($_GET['limit']) && in_array(intval($_GET['limit']), $allowedLimits)) ? intval($_GET['limit']) : 10;

// Xác định trang hiện tại
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
if ($page < 1) {
    $page = 1;
}
$offset = ($page - 1) * $limit;

// Đếm tổng số bản ghi cho user này
$sqlCount = "SELECT COUNT(*) AS total FROM image_history WHERE user_id = ?";
$stmtCount = mysqli_prepare($conn, $sqlCount);
mysqli_stmt_bind_param($stmtCount, "i", $user_id);
mysqli_stmt_execute($stmtCount);
$resultCount = mysqli_stmt_get_result($stmtCount);
$rowCount = mysqli_fetch_assoc($resultCount);
$totalRecords = $rowCount['total'];
$totalPages = ceil($totalRecords / $limit);
mysqli_stmt_close($stmtCount);

// Lấy lịch sử hình ảnh với phân trang, sắp xếp theo thời gian tạo giảm dần
$sql = "SELECT 
            ih.prompt, 
            ih.style, 
            ih.image_url, 
            ih.model_identifier_snapshot,
            m.model_id as current_model_id,
            m.name as model_name,
            m.description as model_description
        FROM image_history ih
        LEFT JOIN models m ON ih.model_id_fk = m.id
        WHERE ih.user_id = ? 
        ORDER BY ih.created_at DESC 
        LIMIT ? OFFSET ?";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'SQL error: ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "iii", $user_id, $limit, $offset);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$history = array();
while ($row = mysqli_fetch_assoc($result)) {
    // Nếu cần xử lý đường dẫn ảnh, có thể cập nhật tại đây
    $history[] = $row;
}

mysqli_stmt_close($stmt);
mysqli_close($conn);

echo json_encode([
    'success'     => true,
    'history'     => $history,
    'page'        => $page,
    'total_pages' => $totalPages,
    'limit'       => $limit,
    'total_records' => $totalRecords
]);
?>
