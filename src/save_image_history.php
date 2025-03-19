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
$prompt = mysqli_real_escape_string($conn, $_POST['prompt'] ?? '');
$style = mysqli_real_escape_string($conn, $_POST['style'] ?? '');
$image_data = $_POST['image_data'] ?? '';
$blob_size = floatval($_POST['blob_size'] ?? 0);
$model_id = mysqli_real_escape_string($conn, $_POST['model_id'] ?? '');

error_log("User ID: $user_id");
error_log("Prompt: $prompt, Style: $style, Model ID: $model_id, Blob Size: $blob_size");

if (empty($prompt) || empty($image_data) || empty($model_id)) {
    error_log("Thiếu dữ liệu: " . print_r($_POST, true));
    echo json_encode(['success' => false, 'message' => 'Thiếu dữ liệu bắt buộc']);
    exit;
}

if ($blob_size > 2000000) {
    error_log("Blob size too large: " . $blob_size);
    echo json_encode(['success' => false, 'message' => 'Blob size too large']);
    exit;
}

if (!preg_match('/^data:image\/(jpeg|png|gif);base64,/', $image_data)) {
    error_log("Invalid base64: " . substr($image_data, 0, 100));
    echo json_encode(['success' => false, 'message' => 'Invalid base64 data']);
    exit;
}

// Cập nhật upload directory theo đường dẫn mới
$upload_dir = '/Text-To-Image-Website-main/Text-To-Image-Website/images/';
$filename = uniqid() . '.jpg';
$file_path = $_SERVER['DOCUMENT_ROOT'] . $upload_dir . $filename;
$image_url = $upload_dir . $filename;

error_log("Document root: " . $_SERVER['DOCUMENT_ROOT']);
error_log("Upload dir: " . $upload_dir);
error_log("Full file path: " . $file_path);

// Kiểm tra nếu thư mục không tồn tại thì tạo mới
$directory = dirname($file_path);
if (!file_exists($directory)) {
    error_log("Directory does not exist: " . $directory . " - attempting to create it.");
    if (!mkdir($directory, 0777, true)) {
        error_log("Failed to create directory: " . $directory);
        echo json_encode(['success' => false, 'message' => 'Thư mục không tồn tại và không thể tạo: ' . $directory]);
        exit;
    } else {
        error_log("Directory created: " . $directory);
    }
}

if (!is_writable($directory)) {
    error_log("Not writable: " . $directory);
    echo json_encode(['success' => false, 'message' => 'Không có quyền ghi vào ' . $directory]);
    exit;
}

$decoded_image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image_data));
if ($decoded_image === false) {
    error_log("Decode failed: " . substr($image_data, 0, 100));
    echo json_encode(['success' => false, 'message' => 'Failed to decode base64']);
    exit;
}

if (file_put_contents($file_path, $decoded_image) === false) {
    $error = error_get_last();
    error_log("File write failed: " . print_r($error, true));
    echo json_encode(['success' => false, 'message' => 'Failed to save file: ' . ($error['message'] ?? 'Unknown')]);
    exit;
}

error_log("File written successfully: " . $file_path);

$max_history_count = 100;
$sql_count = "SELECT COUNT(DISTINCT creation_id) AS history_count FROM image_history WHERE user_id = ?";
$stmt_count = mysqli_prepare($conn, $sql_count);
if (!$stmt_count) {
    error_log("Prepare count failed: " . mysqli_error($conn));
    echo json_encode(['success' => false, 'message' => 'SQL error: ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt_count, "i", $user_id);
mysqli_stmt_execute($stmt_count);
$result_count = mysqli_stmt_get_result($stmt_count);
$row_count = mysqli_fetch_assoc($result_count);
$history_count = $row_count['history_count'] ?? 0;
error_log("Current history count: " . $history_count);
mysqli_stmt_close($stmt_count);

if ($history_count >= $max_history_count) {
    $sql_oldest = "SELECT MIN(created_at) AS oldest_created_at FROM image_history WHERE user_id = ?";
    $stmt_oldest = mysqli_prepare($conn, $sql_oldest);
    if (!$stmt_oldest) {
        error_log("Prepare oldest failed: " . mysqli_error($conn));
        echo json_encode(['success' => false, 'message' => 'SQL error: ' . mysqli_error($conn)]);
        exit;
    }
    mysqli_stmt_bind_param($stmt_oldest, "i", $user_id);
    mysqli_stmt_execute($stmt_oldest);
    $result_oldest = mysqli_stmt_get_result($stmt_oldest);
    $row_oldest = mysqli_fetch_assoc($result_oldest);
    $oldest_created_at = $row_oldest['oldest_created_at'];
    error_log("Oldest created_at: " . $oldest_created_at);
    mysqli_stmt_close($stmt_oldest);

    if ($oldest_created_at) {
        $sql_delete = "SELECT id, image_url FROM image_history WHERE user_id = ? AND created_at = ? LIMIT 1";
        $stmt_delete = mysqli_prepare($conn, $sql_delete);
        if (!$stmt_delete) {
            error_log("Prepare delete failed: " . mysqli_error($conn));
            echo json_encode(['success' => false, 'message' => 'SQL error: ' . mysqli_error($conn)]);
            exit;
        }
        mysqli_stmt_bind_param($stmt_delete, "is", $user_id, $oldest_created_at);
        mysqli_stmt_execute($stmt_delete);
        $result_delete = mysqli_stmt_get_result($stmt_delete);
        $row_delete = mysqli_fetch_assoc($result_delete);
        mysqli_stmt_close($stmt_delete);

        if ($row_delete) {
            $oldest_id = $row_delete['id'];
            $oldest_file = $_SERVER['DOCUMENT_ROOT'] . $row_delete['image_url'];
            error_log("Deleting oldest file: " . $oldest_file);
            if (file_exists($oldest_file)) {
                unlink($oldest_file);
                error_log("Oldest file deleted: " . $oldest_file);
            } else {
                error_log("Oldest file not found: " . $oldest_file);
            }
            $sql_remove = "DELETE FROM image_history WHERE id = ?";
            $stmt_remove = mysqli_prepare($conn, $sql_remove);
            if (!$stmt_remove) {
                error_log("Prepare remove failed: " . mysqli_error($conn));
                echo json_encode(['success' => false, 'message' => 'SQL error: ' . mysqli_error($conn)]);
                exit;
            }
            mysqli_stmt_bind_param($stmt_remove, "i", $oldest_id);
            mysqli_stmt_execute($stmt_remove);
            mysqli_stmt_close($stmt_remove);
            error_log("Oldest history record removed: ID = " . $oldest_id);
        }
    }
}

$creation_id = uniqid();
error_log("Creation ID: " . $creation_id);
$sql = "INSERT INTO image_history (user_id, prompt, style, image_url, created_at, `model`, creation_id) VALUES (?, ?, ?, ?, NOW(), ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
if (!$stmt) {
    error_log("Prepare insert failed: " . mysqli_error($conn));
    echo json_encode(['success' => false, 'message' => 'SQL error: ' . mysqli_error($conn)]);
    exit;
}
mysqli_stmt_bind_param($stmt, "isssss", $user_id, $prompt, $style, $image_url, $model_id, $creation_id);
if (mysqli_stmt_execute($stmt)) {
    error_log("Image saved to history successfully. Creation ID: " . $creation_id);
    echo json_encode(['success' => true, 'message' => 'Image saved to history']);
} else {
    error_log("Execute insert failed: " . mysqli_error($conn));
    echo json_encode(['success' => false, 'message' => 'SQL error: ' . mysqli_error($conn)]);
}
mysqli_stmt_close($stmt);
mysqli_close($conn);
exit;
?>
