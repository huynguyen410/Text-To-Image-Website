<?php
session_start();

$timeout = 1800; // 30 phút

if (isset($_SESSION['last_activity'])) {
    $session_life = time() - $_SESSION['last_activity'];
    if ($session_life > $timeout) {
        session_destroy();
        if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
           strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
            ob_clean();
            header('Content-Type: application/json');
            echo json_encode(['success' => false, 'message' => 'Session timed out']);
            exit;
        } else {
            header("Location: ../src/index.php");
            exit;
        }
    }
}
$_SESSION['last_activity'] = time();
?>
