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
        // Lấy số lượng ảnh đã tạo
        $sql_count = "SELECT COUNT(DISTINCT created_at) AS total FROM image_history WHERE user_id = ?";
        $stmt_count = mysqli_prepare($conn, $sql_count);
        mysqli_stmt_bind_param($stmt_count, "i", $user_id);
        mysqli_stmt_execute($stmt_count);
        $result_count = mysqli_stmt_get_result($stmt_count);
        $data_count = mysqli_fetch_assoc($result_count);
        $total_creation = $data_count['total'];
        mysqli_stmt_close($stmt_count);

        // Nếu số lượng ảnh > 5 thì tiến hành xóa ảnh cũ nhất
        if ($total_creation > 5) {
            $sql_get_oldest = "SELECT id, image_url, created_at FROM image_history WHERE user_id = ? ORDER BY created_at ASC LIMIT 1";
            $stmt_get_oldest = mysqli_prepare($conn, $sql_get_oldest);
            mysqli_stmt_bind_param($stmt_get_oldest, "i", $user_id);
            mysqli_stmt_execute($stmt_get_oldest);
            $result_oldest = mysqli_stmt_get_result($stmt_get_oldest);

             if ($row_oldest = mysqli_fetch_assoc($result_oldest)) {
                $oldest_creation_time = $row_oldest['created_at'];

                //Lấy tất cả ảnh CÙNG created_at để xoá
                $sql_get_all_oldest = "SELECT id, image_url FROM image_history WHERE user_id = ? AND created_at = ?";
                $stmt_get_all_oldest = mysqli_prepare($conn, $sql_get_all_oldest);
                mysqli_stmt_bind_param($stmt_get_all_oldest, "is", $user_id, $oldest_creation_time);
                mysqli_stmt_execute($stmt_get_all_oldest);
                $result_all_oldest = mysqli_stmt_get_result($stmt_get_all_oldest);

                  while($row_all_oldest = mysqli_fetch_assoc($result_all_oldest)) {
                      $oldest_id = $row_all_oldest['id'];
                      $oldest_image_url = $row_all_oldest['image_url'];

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
                   mysqli_stmt_close($stmt_get_all_oldest);
            }
              mysqli_stmt_close($stmt_get_oldest);
        }

        // Chèn dữ liệu vào bảng image_history
        $sql = "INSERT INTO image_history (user_id, prompt, style, image_url, created_at) VALUES (?, ?, ?, ?, NOW())";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "isss", $user_id, $prompt, $style, $image_url);

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