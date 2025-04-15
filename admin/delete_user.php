<?php
session_start();
require_once '../src/db_connect.php'; // Đảm bảo đường dẫn này đúng

// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header('Content-Type: application/json'); // Đảm bảo header JSON được gửi đi
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Kiểm tra phương thức POST và sự tồn tại của id
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['id'])) {
     header('Content-Type: application/json');
     echo json_encode(['success' => false, 'message' => 'Invalid request']);
     exit;
}


$id = filter_var($_POST['id'], FILTER_VALIDATE_INT); // Validate ID là số nguyên

// Validate input
if ($id === false || $id <= 0) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Invalid User ID provided']);
    exit;
}

// --- THAY ĐỔI CÂU LỆNH SQL ---
// Thay vì DELETE, cập nhật cột deleted_at bằng thời gian hiện tại
$sql = "UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL";
// Thêm AND deleted_at IS NULL để tránh cập nhật lại nếu user đã bị xóa mềm
// --- KẾT THÚC THAY ĐỔI SQL ---

$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
     header('Content-Type: application/json');
     echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
     exit;
}

mysqli_stmt_bind_param($stmt, "i", $id);

header('Content-Type: application/json'); // Gửi header JSON trước khi echo
if (mysqli_stmt_execute($stmt)) {
    // Kiểm tra xem có dòng nào thực sự bị ảnh hưởng không
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['success' => true, 'message' => 'User deactivated successfully']); // Thay đổi thông báo
    } else {
         // Có thể do ID không tồn tại hoặc user đã bị xóa mềm trước đó
         echo json_encode(['success' => false, 'message' => 'User not found or already deactivated']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Error executing statement: ' . mysqli_stmt_error($stmt)]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>