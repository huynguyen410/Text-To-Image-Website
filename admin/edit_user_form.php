<?php
session_start();
require_once '../src/db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { 
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$id = $_GET['id'];

// Validate input
if (empty($id)) {
    echo "User ID is required.";
    exit;
}

$sql = "SELECT id, username, email FROM users WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    ?>
    <form id="edit_user_form">
        <input type="hidden" name="id" value="<?php echo htmlspecialchars($row['id']); ?>">
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" name="username" value="<?php echo htmlspecialchars($row['username']); ?>" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" name="email" value="<?php echo htmlspecialchars($row['email']); ?>">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">New Password (Optional)</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="Enter new password">
        </div>
        <div class="mb-3">
            <label for="confirm_password" class="form-label">Confirm New Password</label>
            <input type="password" class="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm new password">
        </div>
    </form>
    <?php
} else {
    echo "User not found.";
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>