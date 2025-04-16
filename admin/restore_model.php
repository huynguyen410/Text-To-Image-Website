<?php
require_once '../src/db_connect.php';

// Check if user is logged in and is admin
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id'])) {
        $id = filter_var($_POST['id'], FILTER_VALIDATE_INT);
        
        if ($id === false || $id <= 0) {
            echo json_encode(['success' => false, 'message' => 'Invalid Model ID']);
            exit;
        }
        
        // Restore model by setting deleted_at to NULL
        $sql = "UPDATE models SET deleted_at = NULL WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['success' => true, 'message' => 'Model restored successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Model not found or already restored']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error restoring model: ' . $conn->error]);
        }
        
        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Model ID not provided']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?> 