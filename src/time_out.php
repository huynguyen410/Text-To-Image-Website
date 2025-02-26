<?php
    session_start();

    // Đặt thời gian timeout cho session (ví dụ: 30 phút)
    $timeout = 1800; // 30 phút (30 * 60 giây)

    // Kiểm tra xem session đã được tạo hay chưa
    if (isset($_SESSION['last_activity'])) {
        // Tính thời gian kể từ lần hoạt động cuối cùng
        $session_life = time() - $_SESSION['last_activity'];

        // Nếu session đã hết hạn, hủy session
        if ($session_life > $timeout) {
            session_destroy();
            header("Location: ../src/index.php"); // Chuyển hướng đến trang đăng nhập
            exit;
        }
    }

    // Cập nhật thời gian hoạt động cuối cùng
    $_SESSION['last_activity'] = time();
?>