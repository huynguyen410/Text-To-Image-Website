<?php
session_start();
header('Content-Type: application/json');
require_once "db_connect.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$sql = "SELECT id, username, image_quota, isPremium, endPremium FROM users WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => mysqli_error($conn)]);
    exit;
}

mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    $quota = ($row['isPremium'] === 'yes') ? "Unlimited" : (int)$row['image_quota'];
    $role = isset($_SESSION['role']) ? $_SESSION['role'] : null;
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $row['id'],
            'username' => $row['username'],
            'role' => $role,
            'image_quota' => $quota,
            'isPremium' => $row['isPremium'],
            'endPremium' => $row['endPremium']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>