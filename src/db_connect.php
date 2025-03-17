<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "imagegenerator";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => "Connection failed: " . mysqli_connect_error()]);
    exit;
}
?>
