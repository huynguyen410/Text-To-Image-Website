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
$model_id = mysqli_real_escape_string($conn, $_POST['model_id']); // Get model ID

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
      // Tạo creation_id duy nhất
      $creation_id = uniqid();

        // Giới hạn số lần tạo ảnh gần nhất
        $max_history_count = 5;

        // Lấy số lượng lần tạo ảnh của người dùng
        $sql_count_history = "SELECT COUNT(DISTINCT creation_id) AS history_count FROM image_history WHERE user_id = ?";
        $stmt_count_history = mysqli_prepare($conn, $sql_count_history);
        mysqli_stmt_bind_param($stmt_count_history, "i", $user_id);
        mysqli_stmt_execute($stmt_count_history);
        $result_count_history = mysqli_stmt_get_result($stmt_count_history);
        $row_count_history = mysqli_fetch_assoc($result_count_history);
        $history_count = $row_count_history['history_count'];
        mysqli_stmt_close($stmt_count_history);

        // Nếu vượt quá giới hạn, xóa ảnh cũ nhất
        if ($history_count >= $max_history_count) {
            // Lấy creation_id của lần tạo ảnh cũ nhất
            $sql_get_oldest_creation_id = "SELECT MIN(created_at) AS oldest_created_at FROM image_history WHERE user_id = ?";
            $stmt_get_oldest_creation_id = mysqli_prepare($conn, $sql_get_oldest_creation_id);
            mysqli_stmt_bind_param($stmt_get_oldest_creation_id, "i", $user_id);
            mysqli_stmt_execute($stmt_get_oldest_creation_id);
            $result_oldest_creation_id = mysqli_stmt_get_result($stmt_get_oldest_creation_id);
            $row_oldest_creation_id = mysqli_fetch_assoc($result_oldest_creation_id);
            $oldest_created_at = $row_oldest_creation_id['oldest_created_at'];
            mysqli_stmt_close($stmt_get_oldest_creation_id);

            // Lấy danh sách các ảnh cũ nhất
            $sql_get_oldest_images = "SELECT id, image_url FROM image_history WHERE user_id = ? AND created_at = ?";
            $stmt_get_oldest_images = mysqli_prepare($conn, $sql_get_oldest_images);
            mysqli_stmt_bind_param($stmt_get_oldest_images, "is", $user_id, $oldest_created_at);
            mysqli_stmt_execute($stmt_get_oldest_images);
            $result_oldest_images = mysqli_stmt_get_result($stmt_get_oldest_images);

            // Duyệt và xóa từng ảnh
            while ($row_oldest_images = mysqli_fetch_assoc($result_oldest_images)) {
                $oldest_id = $row_oldest_images['id'];
                $oldest_image_url = $row_oldest_images['image_url'];

                // Xóa file ảnh cũ
                $oldest_file = $_SERVER['DOCUMENT_ROOT'] . $oldest_image_url;
                if (file_exists($oldest_file)) {
                    unlink($oldest_file);
                }

                // Xóa bản ghi khỏi cơ sở dữ liệu
                $sql_delete_oldest = "DELETE FROM image_history WHERE id = ?";
                $stmt_delete_oldest = mysqli_prepare($conn, $sql_delete_oldest);
                mysqli_stmt_bind_param($stmt_delete_oldest, "i", $oldest_id);
                mysqli_stmt_execute($stmt_delete_oldest);
                 mysqli_stmt_close($stmt_delete_oldest);
            }
              mysqli_stmt_close($stmt_get_oldest_images);
        }

        // Chèn dữ liệu vào bảng image_history
        $sql = "INSERT INTO image_history (user_id, prompt, style, image_url, created_at, model, creation_id) VALUES (?, ?, ?, ?, NOW(), ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "isssss", $user_id, $prompt, $style, $image_url, $model_id, $creation_id);

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true, 'message' => 'Image saved to history']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error: ' . mysqli_error($conn)]);
        }
       mysqli_stmt_close($stmt);

    } else {
        $error = error_get_last();
        error_log("file_put_contents error: " . print_r($error, true));
        echo json_encode(['success' => false, 'message' => 'Failed to save image file: ' . $error['message']]);
    }

    mysqli_close($conn);
?>