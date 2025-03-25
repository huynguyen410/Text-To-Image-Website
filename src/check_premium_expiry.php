<?php
session_start();
header('Content-Type: application/json');
require_once "db_connect.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Lấy thông tin Premium
$sql = "SELECT isPremium, endPremium FROM users WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

if ($user && $user['isPremium'] === 'yes') {
    $today = new DateTime();
    $endPremium = new DateTime($user['endPremium']);
    
    if ($today >= $endPremium) {
        // Cập nhật isPremium thành 'no'
        $update_sql = "UPDATE users SET isPremium = 'no' WHERE id = ?";
        $stmt = mysqli_prepare($conn, $update_sql);
        mysqli_stmt_bind_param($stmt, "i", $user_id);
        $success = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        
        if ($success) {
            echo json_encode(['success' => true, 'expired' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error updating premium status']);
        }
    } else {
        echo json_encode(['success' => true, 'expired' => false]);
    }
} else {
    echo json_encode(['success' => true, 'expired' => false]);
}

mysqli_close($conn);
?>