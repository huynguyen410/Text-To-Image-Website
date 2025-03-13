<?php
    session_start();
    session_unset();
    session_destroy();
    setcookie(session_name(), '', time() - 3600, "/"); // Hủy cookie session
    header("Location: admin_login.php"); // Chuyển hướng đến trang admin login
    exit;
?>