<?php
// Đặt header ở đầu
header('Content-Type: application/json');

// Mảng để lưu kết quả
$models = [];

// Bao gồm file kết nối cơ sở dữ liệu
require_once 'db_connect.php'; // db_connect.php nằm cùng thư mục src

// Kiểm tra $conn sau khi include (vẫn nên giữ lại bước kiểm tra cơ bản này)
if (!isset($conn) || !($conn instanceof mysqli)) {
    // Trả về lỗi JSON nếu kết nối không hợp lệ
    // Ghi log lỗi phía server thay vì chỉ echo lỗi ra client
    error_log('Database connection object ($conn) not found or invalid after including db_connect.php in get_models.php');
    echo json_encode(['error' => 'Internal server error: Invalid database connection.']);
    exit();
}

// Đặt encoding (vẫn tốt để có)
if (!$conn->set_charset("utf8mb4")) {
     error_log("Warning: Error loading character set utf8mb4 in get_models.php: " . $conn->error);
}

// --- Cấu hình Bảng Models ---
$models_table = 'models';
$status_column = 'status';
$active_status_value = 'active';
// --- Kết thúc Cấu hình Bảng ---

// Hàm tạo group_id an toàn
function generate_safe_group_id($input) {
    if (empty($input)) return 'default-group';
    $groupId = mb_strtolower($input, 'UTF-8');
    $groupId = preg_replace('/\s+/', '-', $groupId);
    $groupId = preg_replace('/[^\p{L}\p{N}\-_]/u', '', $groupId);
    $groupId = preg_replace('/-+/', '-', $groupId);
    $groupId = trim($groupId, '-');
    return $groupId ?: 'model-' . uniqid();
}

// Chuẩn bị câu lệnh SQL
$sql = "SELECT model_id, name FROM `" . $conn->real_escape_string($models_table) . "` WHERE `" . $conn->real_escape_string($status_column) . "` = ?";
$stmt = $conn->prepare($sql);

// Kiểm tra prepare cơ bản
if ($stmt) {
    // Gắn tham số
    $stmt->bind_param("s", $active_status_value);

    // Thực thi
    if ($stmt->execute()) {
        // Giả định mysqlnd đã được kích hoạt và get_result hoạt động
        $result = $stmt->get_result();
        if ($result && $result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $model_id = $row['model_id'] ?? null;
                $name = $row['name'] ?? null;

                if ($model_id) {
                    $group_id = generate_safe_group_id($model_id ?: $name);
                    $models[] = [
                        'model_id' => $model_id,
                        'name' => $name,
                        'group_id' => $group_id
                    ];
                }
            }
            $result->free();
        } elseif (!$result) {
             // Log lỗi nếu get_result thất bại
             error_log("Error getting result set in get_models.php: " . $stmt->error);
        }
        // Không cần else cho num_rows = 0
    } else {
        // Log lỗi nếu execute thất bại
        error_log("Query execution failed in get_models.php: " . $stmt->error);
    }
    $stmt->close();
} else {
    // Log lỗi nếu prepare thất bại
    error_log("Query preparation failed in get_models.php: " . $conn->error);
}

// Trả về JSON (sẽ là mảng rỗng [] nếu có lỗi hoặc không có model)
echo json_encode($models);

?> 