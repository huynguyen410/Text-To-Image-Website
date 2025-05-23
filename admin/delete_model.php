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
        
        // Use soft delete instead of hard delete
        $sql = "UPDATE models SET deleted_at = NOW() WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(['success' => true, 'message' => 'Model marked as deleted successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Model not found or already deleted']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error marking model as deleted: ' . $conn->error]);
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