<?php
session_start();
header('Content-Type: application/json');
require_once "db_connect.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Lấy dữ liệu POST
$data = json_decode(file_get_contents('php://input'), true);
$total_price = $data['totalPrice'];
$duration_months = $data['durationMonths'];

$user_id = $_SESSION['user_id'];

// Bỏ qua phần lấy username vì ta sẽ sử dụng $user_id trực tiếp cho invoice

// Khởi tạo giao dịch (transaction)
mysqli_begin_transaction($conn);

try {
    // Chèn vào bảng invoice với cột customer_id thay vì customer_name
    $invoice_sql = "INSERT INTO invoice (invoice_id, customer_id, total_price, created_at) 
                    VALUES (?, ?, ?, NOW())";
    // Tạo invoice_id đơn giản
    $invoice_id = "INV" . time() . rand(100, 999); 
    $stmt = mysqli_prepare($conn, $invoice_sql);
    // Bind các tham số: invoice_id (string), customer_id (int), total_price (int)
    mysqli_stmt_bind_param($stmt, "sii", $invoice_id, $user_id, $total_price);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // Cập nhật bảng users: thay đổi trạng thái premium và cập nhật ngày bắt đầu & hết hạn
    $start_premium = date('Y-m-d');
    $end_premium = date('Y-m-d', strtotime("+$duration_months months"));
    
    $user_sql = "UPDATE users SET 
                isPremium = 'yes',
                startPremium = ?,
                endPremium = ?
                WHERE id = ?";
    $stmt = mysqli_prepare($conn, $user_sql);
    mysqli_stmt_bind_param($stmt, "ssi", $start_premium, $end_premium, $user_id);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // Hoàn tất giao dịch
    mysqli_commit($conn);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Premium status updated',
        'invoice_id' => $invoice_id,
        'startPremium' => $start_premium,
        'endPremium' => $end_premium
    ]);

} catch (Exception $e) {
    // Nếu có lỗi, rollback giao dịch
    mysqli_rollback($conn);
    echo json_encode([
        'success' => false, 
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

mysqli_close($conn);
?>
