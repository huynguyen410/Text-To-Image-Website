<?php
    header('Content-Type: application/json');
    session_start();
    require_once 'db_connect.php';

    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        exit;
    }

    $user_id = $_SESSION['user_id'];

    // Lấy lịch sử hình ảnh của người dùng
    $sql = "SELECT prompt, style, image_url, model FROM image_history WHERE user_id = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $history = array();
    while ($row = mysqli_fetch_assoc($result)) {
        // Tạo URL đầy đủ cho hình ảnh
        $row['image_url'] =  $row['image_url']; // Đường dẫn đầy đủ tới ảnh
        $history[] = $row;
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);

    echo json_encode(['success' => true, 'history' => $history]);
?>