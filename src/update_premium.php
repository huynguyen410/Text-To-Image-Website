<?php
session_start();
header('Content-Type: application/json');
require_once "db_connect.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$total_price = $data['totalPrice'];
$duration_months = $data['durationMonths'];

$user_id = $_SESSION['user_id'];

// Get customer name from users table
$sql = "SELECT username FROM users WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);
$customer_name = $user['username'];
mysqli_stmt_close($stmt);

// Start transaction
mysqli_begin_transaction($conn);

try {
    // Insert into invoice table
    $invoice_sql = "INSERT INTO invoice (invoice_id, customer_name, total_price, created_at) 
                    VALUES (?, ?, ?, NOW())";
    $invoice_id = "INV" . time() . rand(100, 999); // Tạo invoice_id đơn giản
    $stmt = mysqli_prepare($conn, $invoice_sql);
    mysqli_stmt_bind_param($stmt, "ssi", $invoice_id, $customer_name, $total_price);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // Update users table with premium status and dates
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

    // Commit transaction
    mysqli_commit($conn);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Premium status updated',
        'invoice_id' => $invoice_id,
        'startPremium' => $start_premium,
        'endPremium' => $end_premium
    ]);

} catch (Exception $e) {
    // Rollback transaction on error
    mysqli_rollback($conn);
    echo json_encode([
        'success' => false, 
        'message' => 'Error: ' . $e->getMessage()
    ]);
}

mysqli_close($conn);
?>