<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image History</title>
    <link rel="stylesheet" href="../css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../js/script.js" defer></script>
    <script>
        window.onload = () => {
            loadHistory(); // Gọi loadHistory với trang mặc định
        };
    </script>
</head>
<body>
    <div class="wrapper">
        <div class="content">
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="../src/index.php">AI Image Generator</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="image_history.php" id="history-link">History</a>
                            </li>
                            <li class="nav-item" id="login-register-link">
                                <a class="nav-link" href="#" id="login-link" data-bs-toggle="modal"
                                    data-bs-target="#loginRegisterModal">Login</a>
                            </li>
                            <span class="nav-link me-2" id="username-display" style="display: none;"></span>
                            <li class="nav-item" id="logout-link" style="display: none;">
                                <a class="nav-link" href="#" id="logout-button">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="container mt-5">
                <h2>Image History</h2>
                <!-- Dropdown chọn số mục hiển thị mỗi trang -->
                <div class="d-flex justify-content-end mb-3">
                    <select id="historyLimit" class="form-select w-auto">
                        <option value="10" selected>10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <hr class="border-2 border-top bg-primary" />
                <div class="row" id="image-history-container">
                    <!-- Các ảnh lịch sử sẽ được hiển thị tại đây -->
                </div>
                <!-- Container hiển thị các nút phân trang -->
                <div id="history-pagination"></div>
            </div>
        </div>
    </div>
    <!-- Footer -->
    <footer class="bg-light text-center py-3">
        <div class="container">
            <p class="text-muted">© 2025 AI Image Generator</p>
            <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" class="link-secondary">Hugging Face</a> |
            <a href="https://www.sgu.edu.vn/" target="_blank" rel="noopener noreferrer" class="link-secondary">Đại học Sài Gòn</a>
        </div>
    </footer>
</body>
</html>
