<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
        <!-- Vì index.php nằm trong src, link đến chính nó chỉ cần 'index.php' -->
        <a class="navbar-brand" href="index.php">AI Image Generator</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto align-items-center">
                <!-- Premium Button -->
                <li class="nav-item me-2" id="premium-item">
                    <button type="button" class="btn btn-warning btn-sm" id="premiumBtn">Go Premium</button>
                </li>
                <!-- History Link -->
                <li class="nav-item" id="history-item" style="display: none;">
                    <a class="nav-link" href="image_history.php" id="history-link">
                        <i class="bi bi-clock-history me-1"></i>History
                    </a>
                </li>
                <!-- Image Quota -->
                <li class="nav-item me-2" id="quota-item">
                    <span class="nav-link" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Images you can generate">
                        <i class="bi bi-lightning-fill"></i>
                        Credits: <span id="userQuota">0</span>
                    </span>
                </li>
                <!-- Logged in User Info -->
                <li class="nav-item dropdown" id="user-dropdown" style="display: none;">
                  <a class="nav-link dropdown-toggle" href="#" id="userDropdownLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                     <i class="bi bi-person-circle me-1"></i><span id="username-display"></span>
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdownLink">
                    <!-- Add other user links here if needed -->
                    <li>
                        <a class="dropdown-item" href="#" id="logout-button">
                           <i class="bi bi-box-arrow-right me-1"></i>Logout
                        </a>
                    </li>
                  </ul>
                </li>
                <!-- Login/Register Link -->
                <li class="nav-item" id="login-register-link">
                    <a class="nav-link" href="#" id="login-link" data-bs-toggle="modal" data-bs-target="#loginRegisterModal">Login</a>
                </li>
            </ul>
          </div>
    </div>
</nav>