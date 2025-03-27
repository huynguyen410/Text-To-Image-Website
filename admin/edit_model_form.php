<?php
session_start();
require_once '../src/db_connect.php';

// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Validate input
if ($id <= 0) {
    echo "Model ID is required.";
    exit;
}

$sql = "SELECT id, model_id, name, description, status FROM models WHERE id = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    ?>
    <form id="edit_model_form">
        <input type="hidden" name="id" value="<?php echo htmlspecialchars($row['id']); ?>">
        <div class="mb-3">
            <label for="model_id" class="form-label">Model ID</label>
            <input type="text" class="form-control" id="model_id" name="model_id" value="<?php echo htmlspecialchars($row['model_id']); ?>" required>
        </div>
        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" name="name" value="<?php echo htmlspecialchars($row['name']); ?>" required>
        </div>
        <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea class="form-control" id="description" name="description"><?php echo htmlspecialchars($row['description']); ?></textarea>
        </div>
        <div class="mb-3">
            <label for="status" class="form-label">Status</label>
            <select class="form-select" id="status" name="status" required>
                <option value="active" <?php if ($row['status'] == 'active') echo 'selected'; ?>>Active</option>
                <option value="inactive" <?php if ($row['status'] == 'inactive') echo 'selected'; ?>>Inactive</option>
            </select>
        </div>
    </form>
    <?php
} else {
    echo "Model not found.";
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>