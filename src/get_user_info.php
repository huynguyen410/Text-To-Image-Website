<?php
    header('Content-Type: application/json');
    session_start();
    require_once 'db_connect.php'; // Include file kết nối cơ sở dữ liệu

    if (isset($_SESSION['user_id'])) {
        echo json_encode(['success' => true, 'user' => ['id' => $_SESSION['user_id'], 'username' => $_SESSION['username'],  'role' => $_SESSION['role']]]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
    }
?>