<?php
  include 'time_out.php'; // timeout session
  require_once 'db_connect.php';

  $sql = "SELECT id, model_id, name, description FROM models WHERE status = 'active'";
  $result = mysqli_query($conn, $sql);

  $models = array();
  while ($row = mysqli_fetch_assoc($result)) {
    $models[] = $row;
  }

  mysqli_close($conn);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Image Generator</title>
  <!-- Link CSS -->
  <link rel="stylesheet" href="../css/style.css">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap JS Bundle -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Custom Scripts -->
  <script src="../js/script.js" defer></script>
  <script src="../js/generate_image.js" defer></script>
  <!-- Premium script đã chuyển vào project/js/ -->
  <script src="../js/premium.js" defer></script>
</head>
<body>
  <div class="wrapper">
    <div class="content">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
          <!-- Vì index.php nằm trong src, link đến chính nó chỉ cần 'index.php' -->
          <a class="navbar-brand" href="index.php">AI Image Generator</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <!-- Nút Đăng ký Premium -->
              <li class="nav-item" id="premium-item">
                <button type="button" class="btn btn-warning" id="premiumBtn">Đăng ký Premium</button>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="image_history.php" id="history-link">History</a>
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

      <!-- Premium Modal (Demo thanh toán) -->
      <div class="modal fade" id="premiumModal" tabindex="-1" aria-labelledby="premiumModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="premiumModalLabel">Thanh toán Premium</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Phần chọn gói Premium -->
              <h6 class="mb-3">Chọn gói Premium của bạn</h6>
              <div class="btn-group d-flex" role="group" aria-label="Premium Packages">
                <input type="radio" class="btn-check" name="package" id="package1" autocomplete="off" value="1" checked>
                <label class="btn btn-outline-primary flex-fill" for="package1">1 Tháng</label>

                <input type="radio" class="btn-check" name="package" id="package3" autocomplete="off" value="3">
                <label class="btn btn-outline-primary flex-fill" for="package3">3 Tháng</label>

                <input type="radio" class="btn-check" name="package" id="package6" autocomplete="off" value="6">
                <label class="btn btn-outline-primary flex-fill" for="package6">6 Tháng</label>

                <input type="radio" class="btn-check" name="package" id="package12" autocomplete="off" value="12">
                <label class="btn btn-outline-primary flex-fill" for="package12">1 Năm</label>
              </div>
              <!-- Nút hiển thị thông tin thanh toán -->
              <div class="mt-4">
                <button id="showPaymentInfoBtn" class="btn btn-info">Xem thông tin thanh toán</button>
              </div>
              <!-- Phần hiển thị thông tin thanh toán (ẩn mặc định) -->
              <div id="paymentInfo" class="mt-3" style="display: none;">
                <!-- Nội dung thanh toán sẽ được cập nhật bởi JavaScript -->
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" id="confirmPremiumBtn">Đã chuyển khoản</button>
            </div>
          </div>
        </div>
      </div>


      <!-- Toast Notification Container -->
      <div class="toast-container position-fixed top-0 end-0 p-3">
        <div id="formatToast" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">
              Đổi định dạng thành công!
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>

      <!-- Image Generator Section -->
      <section class="image_generator">
        <div class="content">
          <h1>AI Image Generator</h1>
          <p>Turn Your Imagination into Stunning Visuals in Seconds!</p>
          <form action="#" class="generate_form">
            <!-- Background Suggestions -->
            <div class="mb-3">
              <button type="button" class="btn btn-primary" id="showDetailedPromptForm"
                      data-bs-toggle="modal" data-bs-target="#detailedPromptModal">
                Create Detailed Prompt
              </button>
            </div>
            <!-- Model Selection Checkboxes -->
            <div class="model_selection" style="margin-bottom: 1rem;">
              <?php foreach ($models as $model): ?>
                <label data-bs-toggle="tooltip" data-bs-placement="top" title="<?php echo htmlspecialchars($model['description']); ?>">
                  <input type="checkbox" name="model[]" value="<?php echo htmlspecialchars($model['model_id']); ?>">
                  <?php echo htmlspecialchars($model['name']); ?>
                </label>
              <?php endforeach; ?>
            </div>
            <input type="text" class="prompt_input" placeholder="Describe your desired images in words" required>
            <div class="control">
              <select class="style_select">
                <option value="realistic">Realistic</option>
                <option value="anime">Anime</option>
                <option value="cartoon">Cartoon</option>
                <option value="abstract">Abstract</option>
                <option value="photorealistic">Photorealistic</option>
              </select>
              <select class="img_quantity">
                <option value="1">1 Image</option>
                <option value="2">2 Images</option>
                <option value="3">3 Images</option>
                <option value="4" selected>4 Images</option>
              </select>
              <select class="format_select">
                <option value="jpg" selected>JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
              <button type="submit" class="generate_btn">Generate</button>
            </div>
          </form>
        </div>
      </section>

      <!-- Image Gallery -->
      <section class="img_gallery">
        <div class="model-results" id="model-results">
          <!-- Container mặc định -->
          <div class="default-images" id="default-images">
            <div class="img_container" id="default-container"></div>
          </div>
          <?php
          if (!empty($models)) {
            foreach ($models as $model) {
              $model_id = $model['model_id']; // Dùng cho checkbox và API
              $model_name = $model['name']; // Dùng cho tiêu đề và ID
              $group_id = str_replace(' ', '-', strtolower($model_name)); // Chuyển tên thành ID hợp lệ (ví dụ: "Stable Diffusion 3.5" -> "stable-diffusion-3.5")
              ?>
              <div class="model-group" id="<?php echo htmlspecialchars($group_id); ?>-group" style="display: none;">
                <h3><?php echo htmlspecialchars($model_name); ?></h3>
                <div class="img_container" id="<?php echo htmlspecialchars($group_id); ?>-container"></div>
              </div>
              <?php
            }
          } else {
            ?>
            <div class="default-images" id="default-images">
              <div class="img_container" id="default-container"></div>
            </div>
            <?php
          }
          ?>
        </div>
      </section>

      <!-- Detailed Prompt Modal -->
      <div class="modal fade" id="detailedPromptModal" tabindex="-1" aria-labelledby="detailedPromptModalLabel"
           data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-modal="true" inert>
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="detailedPromptModalLabel">Create Detailed Prompt</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="detailedPromptForm">
                <div class="mb-3">
                  <label for="backgroundInput" class="form-label visually-hidden">Background:</label>
                  <input type="text" class="form-control" id="backgroundInput" placeholder="Background: (e.g., A majestic mountain range)">
                </div>
                <div class="mb-3">
                  <label for="characterInput" class="form-label visually-hidden">Character:</label>
                  <input type="text" class="form-control" id="characterInput" placeholder="Character: (e.g., A brave knight in shining armor)">
                </div>
                <div class="mb-3">
                  <label for="hairstyleInput" class="form-label visually-hidden">Hairstyle:</label>
                  <input type="text" class="form-control" id="hairstyleInput" placeholder="Hairstyle: (e.g., Long hair)">
                </div>
                <div class="mb-3">
                  <label for="skinColorInput" class="form-label visually-hidden">Skin Color:</label>
                  <input type="text" class="form-control" id="skinColorInput" placeholder="Skin Color: (e.g., Pale, dark, bronze)">
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="generateFromDetails" data-bs-dismiss="modal">Save</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Login/Register Modal -->
      <div class="modal fade" id="loginRegisterModal" tabindex="-1" aria-labelledby="loginRegisterModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="loginRegisterModalLabel"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="login-form">
                <div class="mb-3">
                  <label for="login-username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="login-username" required>
                </div>
                <div class="mb-3">
                  <label for="login-password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="login-password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <button type="button" class="btn btn-secondary" id="show-register-form">Need an account? Register</button>
              </form>
              <form id="register-form" style="display: none;">
                <div class="mb-3">
                  <label for="register-username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="register-username" required>
                </div>
                <div class="mb-3">
                  <label for="register-password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="register-password" required>
                </div>
                <div class="mb-3">
                  <label for="register-email" class="form-label">Email (optional)</label>
                  <input type="email" class="form-control" id="register-email">
                </div>
                <button type="submit" class="btn btn-primary">Register</button>
                <button type="button" class="btn btn-secondary" id="show-login-form">Already have an account? Login</button>
              </form>
            </div>
          </div>
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
  </div>
</body>
</html>
