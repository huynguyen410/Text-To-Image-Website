<?php
session_start();
header('Content-Type: application/json');
require_once "db_connect.php"; // Đảm bảo đường dẫn này đúng

// Kiểm tra đăng nhập
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Lấy dữ liệu POST
$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['totalPrice']) || !isset($data['durationMonths'])) {
     echo json_encode(['success' => false, 'message' => 'Invalid input data']);
     exit;
}

$total_price = $data['totalPrice'];
$duration_months = $data['durationMonths'];
$user_id = $_SESSION['user_id'];
$customer_username = null; // Khởi tạo biến để lưu username

// Khởi tạo giao dịch (transaction)
mysqli_begin_transaction($conn);

try {
    // --- BƯỚC 1: Lấy username từ bảng users ---
    $get_username_sql = "SELECT username FROM users WHERE id = ?";
    $stmt_get_user = mysqli_prepare($conn, $get_username_sql);
    if (!$stmt_get_user) {
         throw new Exception("Prepare statement failed (get username): " . mysqli_error($conn));
    }
    mysqli_stmt_bind_param($stmt_get_user, "i", $user_id);
    mysqli_stmt_execute($stmt_get_user);
    $result_user = mysqli_stmt_get_result($stmt_get_user);
    $user_data = mysqli_fetch_assoc($result_user);
    mysqli_stmt_close($stmt_get_user);

    if (!$user_data || !isset($user_data['username'])) {
        // Rất hiếm khi xảy ra nếu user_id trong session hợp lệ
        throw new Exception("Could not find username for the current user.");
    }
    $customer_username = $user_data['username'];
    // --- KẾT THÚC BƯỚC 1 ---


    // --- BƯỚC 2: Chèn vào bảng invoice với customer_id VÀ customer_username ---
    $invoice_sql = "INSERT INTO invoice (customer_id, total_price, created_at, customer_username)
                    VALUES (?, ?, NOW(), ?)"; // Bỏ invoice_id tự tạo, thêm customer_username
    $stmt_invoice = mysqli_prepare($conn, $invoice_sql);
     if (!$stmt_invoice) {
         throw new Exception("Prepare statement failed (insert invoice): " . mysqli_error($conn));
    }
    // Bind các tham số: customer_id (int), total_price (decimal/double), customer_username (string)
    // Lưu ý: Kiểu dữ liệu cho total_price có thể là 'd' (double) hoặc 's' nếu bạn xử lý nó như string
    mysqli_stmt_bind_param($stmt_invoice, "ids", $user_id, $total_price, $customer_username);
    mysqli_stmt_execute($stmt_invoice);
    $new_invoice_id = mysqli_insert_id($conn); // Lấy ID tự tăng của hóa đơn vừa tạo
    mysqli_stmt_close($stmt_invoice);
    // --- KẾT THÚC BƯỚC 2 ---


    // --- BƯỚC 3: Cập nhật bảng users ---
    $start_premium = date('Y-m-d');
    $end_premium = date('Y-m-d', strtotime("+$duration_months months"));

    $user_sql = "UPDATE users SET
                 isPremium = 'yes',
                 startPremium = ?,
                 endPremium = ?
                 WHERE id = ?";
    $stmt_user_update = mysqli_prepare($conn, $user_sql);
     if (!$stmt_user_update) {
         throw new Exception("Prepare statement failed (update user): " . mysqli_error($conn));
    }
    mysqli_stmt_bind_param($stmt_user_update, "ssi", $start_premium, $end_premium, $user_id);
    mysqli_stmt_execute($stmt_user_update);
    mysqli_stmt_close($stmt_user_update);
    // --- KẾT THÚC BƯỚC 3 ---

    // Hoàn tất giao dịch
    mysqli_commit($conn);

    echo json_encode([
        'success' => true,
        'message' => 'Premium status updated successfully',
        'invoice_id' => $new_invoice_id, // Trả về ID thực tế từ DB
        'startPremium' => $start_premium,
        'endPremium' => $end_premium
    ]);

} catch (Exception $e) {
    // Nếu có lỗi, rollback giao dịch
    mysqli_rollback($conn);
    error_log("Error in update_premium.php: " . $e->getMessage()); // Ghi log lỗi
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred during the update process. Please try again later. Details: ' . $e->getMessage() // Cung cấp thêm chi tiết lỗi nếu cần thiết cho debug
    ]);
} finally {
     // Đảm bảo đóng kết nối ngay cả khi có lỗi
     if (isset($conn)) {
        mysqli_close($conn);
     }
}
?>