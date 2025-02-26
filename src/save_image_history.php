<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
session_start();
require_once 'db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập hay chưa
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$prompt = mysqli_real_escape_string($conn, $_POST['prompt']);
$style = mysqli_real_escape_string($conn, $_POST['style']);
$image_data = $_POST['image_data'];
$blob_size = $_POST['blob_size']; // Get blob size

// Kiểm tra kích thước Blob
if ($blob_size > 2000000) { // 2MB
    error_log("Blob size too large: " . $blob_size);
    echo json_encode(['success' => false, 'message' => 'Blob size too large']);
    exit;
}


if (!preg_match('/^[a-zA-Z0-9\/+=]+$/', $image_data)) {
    error_log("Invalid base64 data");
    echo json_encode(['success' => false, 'message' => 'Invalid base64 data']);
    exit;
}

// Tạo tên file duy nhất
$filename = uniqid() . '.jpg';

$upload_dir = '/Text-To-Image-Website/images/';

$file = $_SERVER['DOCUMENT_ROOT'] . $upload_dir . $filename;

$image_url = $upload_dir . $filename;

// Giải mã dữ liệu base64
$decoded_image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image_data));

// Kiểm tra xem giải mã có thành công hay không
if ($decoded_image === false) {
    echo json_encode(['success' => false, 'message' => 'Failed to decode base64 image data']);
    exit;
}

// Lưu hình ảnh vào thư mục
$success = file_put_contents($file, $decoded_image);

if ($success) {
    // Chèn dữ liệu vào bảng image_history
    $sql = "INSERT INTO image_history (user_id, prompt, style, image_url) VALUES (?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "isss", $user_id, $prompt, $style, $image_url);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'message' => 'Image saved to history']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
    }
} else {
    $error = error_get_last();
    error_log("file_put_contents error: " . print_r($error, true));
    echo json_encode(['success' => false, 'message' => 'Failed to save image file: ' . $error['message']]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>