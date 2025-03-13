<?php
session_start();
// Kiểm tra xem người dùng đã đăng nhập và có quyền admin hay chưa
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') { 
    header("Location: admin_login.php"); // Chuyển hướng đến trang đăng nhập
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>AI Image Generator | Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="wrapper">
        <div class="content">
            <!-- Navbar -->
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="../admin/admin.php">AI Image Generator</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item" id="login-register-link" <?php if (isset($_SESSION['user_id'])) echo 'style="display:none;"'; ?>>
                                <a class="nav-link" href="#" id="login-link" data-bs-toggle="modal"
                                    data-bs-target="#loginRegisterModal">Login</a>
                            </li>
                             <li class="nav-item d-flex align-items-center" id="logout-link" <?php if (!isset($_SESSION['user_id'])) echo 'style="display:none;"'; ?>>
                                    <span class="nav-link me-2 text-white" id="username-display" ><?php echo isset($_SESSION['username']) ? "Logged in as: " . htmlspecialchars($_SESSION['username']) : ''; ?></span>
                                    <a class="nav-link btn btn-sm" href="admin_logout.php" id="logout-button" onclick="return confirm('Bạn có chắc chắn muốn đăng xuất không?');">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <!-- Body -->
            <div class="container">
                <h1 class="mt-4">Admin Panel</h1>
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="users-tab" data-bs-toggle="tab" data-bs-target="#users" type="button" role="tab" aria-controls="users" aria-selected="true">Users</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="models-tab" data-bs-toggle="tab" data-bs-target="#models" type="button" role="tab" aria-controls="models" aria-selected="false">Models</button>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="users" role="tabpanel" aria-labelledby="users-tab">
                        <h2>Users</h2>
                        <div id="user-list"></div>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">Add User</button>
                    </div>
                    <div class="tab-pane fade" id="models" role="tabpanel" aria-labelledby="models-tab">
                        <h2>Models</h2>
                        <div id="model-list"></div>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModelModal">Add Model</button>
                    </div>
                </div>
            </div>

            <!-- Modal for Add User -->
            <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addUserModalLabel">Add New User</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Add User Form -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal for Edit User -->
            <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Edit User Form -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="saveEditUser">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal for Add Model -->
            <div class="modal fade" id="addModelModal" tabindex="-1" aria-labelledby="addModelModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addModelModalLabel">Add New Model</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Add Model Form -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal for Edit Model -->
            <div class="modal fade" id="editModelModal" tabindex="-1" aria-labelledby="editModelModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editModelModalLabel">Edit Model</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Edit Model Form -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id = "saveEditModel">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Footer -->
    <footer class="bg-light text-center py-3 fixed-bottom">
        <div class="container">
            <p class="text-muted">© 2025 AI Image Generator</p>
            <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" class="link-secondary">Hugging Face</a> |
            <a href="https://www.sgu.edu.vn/" target="_blank" rel="noopener noreferrer" class="link-secondary">Đại học Sài Gòn</a>
        </div>
    </footer>

    <!-- Script -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/admin_script.js" defer></script>
</body>
</html>