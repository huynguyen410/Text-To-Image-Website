<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
        <!-- Vì index.php nằm trong src, link đến chính nó chỉ cần 'index.php' -->
        <a class="navbar-brand" href="index.php">AI Image Generator</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        -controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <!-- Nút Đăng ký Premium -->
                <li class="nav-item" id="premium-item">
                    <button type="button" class="btn btn-warning" id="premiumBtn">Đăng ký Premium</button>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="image_history.php" id="history-link" style="display: none;">History</a>
                </li>
                <!-- Hiển thị số lượt tạo ảnh -->
                <li class="nav-item" id="quota-item">
                    <span class="nav-link">
                        <i class="bi bi-lightning-fill"></i>
                        Lượt tạo ảnh: <span id="userQuota">0</span>
                    </span>
                </li>
                <!-- Login/Logout -->
                <li class="nav-item" id="login-register-link">
                    <a class="nav-link" href="#" id="login-link" data-bs-toggle="modal" data-bs-target="#loginRegisterModal">Login</a>
                </li>
                <span class="nav-link me-2" id="username-display" style="display: none;"></span>
                <li class="nav-item" id="logout-link" style="display: none;">
                    <a class="nav-link" href="#" id="logout-button">Logout</a>
                </li>
            </ul>
          </div>
    </div>
</nav>