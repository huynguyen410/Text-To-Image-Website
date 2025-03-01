<?php
    header('Content-Type: application/json');
    session_start();
    session_unset();
    session_destroy();
    setcookie(session_name(), '', time() - 3600, "/"); // Hủy cookie session

    echo json_encode(['success' => true, 'message' => 'Logout successful']);
?>