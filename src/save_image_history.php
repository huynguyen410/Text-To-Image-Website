<?php
// Cho môi trường dev (sau này chuyển về 0 trong production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

session_start();
require_once 'db_connect.php';

error_log("save_image_history.php started.");
error_log("POST data: " . print_r($_POST, true));

// Kiểm tra kết nối DB
if (!$conn) {
    $err = mysqli_connect_error();
    error_log("Kết nối DB thất bại: " . $err);
    echo json_encode(['success' => false, 'message' => 'Kết nối DB thất bại: ' . $err]);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    error_log("Not logged in for user_id");
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Get data from POST since we're using FormData
if (!isset($_POST['prompt']) || !isset($_POST['style']) || !isset($_POST['image_data']) || !isset($_POST['model_id'])) {
    error_log("Missing required fields. Received: " . print_r($_POST, true));
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$prompt = $_POST['prompt'];
$style = $_POST['style'];
$image_data = $_POST['image_data'];
$model_identifier = $_POST['model_id'];

// Create images directory if it doesn't exist
$upload_dir = $_SERVER['DOCUMENT_ROOT'] . '/Text-To-Image-Website/images/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

// Extract the actual base64 data
$image_parts = explode(";base64,", $image_data);
$image_base64 = isset($image_parts[1]) ? $image_parts[1] : $image_data;

// Generate unique filename
$filename = uniqid() . '.jpg';
$file_path = $upload_dir . $filename;

// Save the image file
$success = file_put_contents($file_path, base64_decode($image_base64));
if (!$success) {
    error_log("Failed to save image file to: " . $file_path);
    echo json_encode(['success' => false, 'message' => 'Failed to save image file']);
    exit;
}

// Create relative URL path for database
$image_url = '/Text-To-Image-Website/images/' . $filename;

// Get model_id_fk from models table
$modelSql = "SELECT id FROM models WHERE model_id = ? AND deleted_at IS NULL LIMIT 1";
$modelStmt = $conn->prepare($modelSql);
$modelStmt->bind_param("s", $model_identifier);
$modelStmt->execute();
$modelResult = $modelStmt->get_result();
$model_id_fk = null;

if ($modelRow = $modelResult->fetch_assoc()) {
    $model_id_fk = $modelRow['id'];
}
$modelStmt->close();

// Check if user has reached the history limit
$sql_count = "SELECT COUNT(DISTINCT creation_id) AS history_count FROM image_history WHERE user_id = ?";
$stmt_count = $conn->prepare($sql_count);
$stmt_count->bind_param("i", $user_id);
$stmt_count->execute();
$history_count = $stmt_count->get_result()->fetch_assoc()['history_count'];
$stmt_count->close();

if ($history_count >= 10) {
    // Get the oldest record
    $sql_oldest = "SELECT MIN(created_at) AS oldest_created_at FROM image_history WHERE user_id = ?";
    $stmt_oldest = $conn->prepare($sql_oldest);
    $stmt_oldest->bind_param("i", $user_id);
    $stmt_oldest->execute();
    $oldest_date = $stmt_oldest->get_result()->fetch_assoc()['oldest_created_at'];
    $stmt_oldest->close();

    // Delete the oldest record
    $sql_delete = "SELECT id, image_url FROM image_history WHERE user_id = ? AND created_at = ? LIMIT 1";
    $stmt_delete = $conn->prepare($sql_delete);
    $stmt_delete->bind_param("is", $user_id, $oldest_date);
    $stmt_delete->execute();
    $old_record = $stmt_delete->get_result()->fetch_assoc();
    $stmt_delete->close();

    if ($old_record) {
        // Delete the old image file if it exists
        $old_image_path = $_SERVER['DOCUMENT_ROOT'] . parse_url($old_record['image_url'], PHP_URL_PATH);
        if (file_exists($old_image_path)) {
            unlink($old_image_path);
        }

        // Delete the old record
        $sql_delete_record = "DELETE FROM image_history WHERE id = ?";
        $stmt_delete_record = $conn->prepare($sql_delete_record);
        $stmt_delete_record->bind_param("i", $old_record['id']);
        $stmt_delete_record->execute();
        $stmt_delete_record->close();
    }
}

// Insert new record with model_id_fk
$sql_insert = "INSERT INTO image_history (user_id, prompt, style, image_url, model_identifier_snapshot, model_id_fk) VALUES (?, ?, ?, ?, ?, ?)";
$stmt_insert = $conn->prepare($sql_insert);
$stmt_insert->bind_param("issssi", $user_id, $prompt, $style, $image_url, $model_identifier, $model_id_fk);

if ($stmt_insert->execute()) {
    echo json_encode(['success' => true, 'message' => 'Image history saved successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error saving image history: ' . $conn->error]);
}

$stmt_insert->close();
$conn->close();
?>
