<?php
session_start();
header('Content-Type: application/json');
require_once '../src/db_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Lấy trường isPremium của user
$sql = "SELECT isPremium FROM users WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
if ($row = mysqli_fetch_assoc($result)) {
    $isPremium = $row['isPremium'];
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}
mysqli_stmt_close($stmt);

// Nếu user premium thì không trừ lượt, trả về success ngay
if ($isPremium === 'yes') {
    echo json_encode(['success' => true, 'message' => 'Unlimited quota']);
    mysqli_close($conn);
    exit;
}

// Nếu không phải premium, trừ lượt tạo ảnh
$sql = "UPDATE users SET image_quota = image_quota - 1 WHERE id = ? AND image_quota > 0";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
if (mysqli_stmt_execute($stmt)) {
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['success' => true, 'message' => 'Quota updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No quota left']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
