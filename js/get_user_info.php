<?php
session_start();
header('Content-Type: application/json');
require_once '../src/db_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT id, username, image_quota, isPremium FROM users WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    // Nếu user premium, hiển thị quota là "Unlimited", ngược lại là số lượt thực tế
    $quota = ($row['isPremium'] === 'yes') ? "Unlimited" : (int)$row['image_quota'];
    echo json_encode([
        'success' => true,
        'user_id' => $row['id'],
        'username' => $row['username'],
        'image_quota' => $quota,
        'isPremium' => $row['isPremium']
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
