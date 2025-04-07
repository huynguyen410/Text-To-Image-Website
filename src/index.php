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
<meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin-allow-popups">
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
  <script src="../js/utils.js" defer></script>
  <script src="../js/script.js" defer></script>
  <script src="../js/generate_image.js" defer></script>
  <!-- Premium script đã chuyển vào project/js/ -->
  <script src="../js/premium.js" defer></script>
</head>
<body>
  <div class="wrapper">
    <div class="content">
      <!-- Navbar -->
      <?php include_once 'navbar.php';?>

      <!-- Premium Modal (Demo thanh toán) -->
      <div class="modal fade" id="premiumModal" tabindex="-1" aria-labelledby="premiumModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="premiumModalLabel">Upgrade to Premium</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Phần chọn gói Premium -->
              <h6 class="mb-3">Choose your Premium package</h6>
              <div class="btn-group d-flex" role="group" aria-label="Premium Packages">
                <input type="radio" class="btn-check" name="package" id="package1" autocomplete="off" value="1" checked>
                <label class="btn btn-outline-primary flex-fill" for="package1">1 Month</label>

                <input type="radio" class="btn-check" name="package" id="package3" autocomplete="off" value="3">
                <label class="btn btn-outline-primary flex-fill" for="package3">3 Months</label>

                <input type="radio" class="btn-check" name="package" id="package6" autocomplete="off" value="6">
                <label class="btn btn-outline-primary flex-fill" for="package6">6 Months</label>

                <input type="radio" class="btn-check" name="package" id="package12" autocomplete="off" value="12">
                <label class="btn btn-outline-primary flex-fill" for="package12">1 Year</label>
              </div>
              <!-- Nút hiển thị thông tin thanh toán -->
              <div class="mt-4">
                <button id="showPaymentInfoBtn" class="btn btn-info">Show payment information</button>
              </div>
              <!-- Phần hiển thị thông tin thanh toán (ẩn mặc định) -->
              <div id="paymentInfo" class="mt-3" style="display: none;">
                <!-- Payment content will be updated by JavaScript -->
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success" id="confirmPremiumBtn">Confirm Payment</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Thông Báo -->
      <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="notificationModalLabel">Thông Báo</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body" id="notificationModalBody">
                      <!-- Nội dung thông báo sẽ được chèn vào đây -->
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Đóng</button>
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

      <!-- Additional Information Section -->
      <section class="info_section bg-body-tertiary container-fluid py-5">
          <div class="container">
              <div class="row justify-content-center">
                  <div class="col-lg-10 text-center">
                      <h2 class="mb-4">Explore the Power of AI Image Generation</h2>
                      <p class="lead mb-4">
                          Unleash your creativity with our advanced AI models. Simply enter a description, choose your preferred style and model, and watch your ideas come to life with stunning detail. Whether you're a professional artist, designer, or just exploring, our platform provides the tools you need to create unique and captivating images.
                      </p>
                      <div class="row">
                          <div class="col-md-4 mb-3">
                              <div class="card h-100 shadow-sm border-light">
                                  <div class="card-body">
                                      <i class="bi bi-stars fs-2 text-primary mb-3 d-block"></i>
                                      <h5 class="card-title">Diverse Models</h5>
                                      <p class="card-text">Experiment with various cutting-edge AI models, each offering a unique artistic interpretation of your prompts.</p>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-4 mb-3">
                              <div class="card h-100 shadow-sm border-light">
                                  <div class="card-body">
                                      <i class="bi bi-palette-fill fs-2 text-success mb-3 d-block"></i>
                                      <h5 class="card-title">Rich Styles</h5>
                                      <p class="card-text">From realistic to anime and abstract art, select the perfect style that matches your vision.</p>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-4 mb-3">
                              <div class="card h-100 shadow-sm border-light">
                                  <div class="card-body">
                                      <i class="bi bi-download fs-2 text-info mb-3 d-block"></i>
                                      <h5 class="card-title">Easy Downloads</h5>
                                      <p class="card-text">Quickly download your generated images in various formats like JPG, PNG, or WEBP with just a click.</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <hr class="my-5">

                      <div class="row justify-content-center mt-4">
                          <div class="col-lg-8 text-center">
                              <h3 class="mb-4">How it Works - It's Simple</h3>
                          </div>
                      </div>
                      <div class="row text-center">
                          <div class="col-md-4 mb-3">
                              <div class="card border-0 bg-transparent">
                                  <div class="card-body">
                                      <span class="badge bg-primary rounded-pill fs-4 mb-3 px-3">1</span>
                                      <h5 class="card-title mt-2">Enter Description</h5>
                                      <p class="card-text text-muted">Write a detailed description of the image you want to create.</p>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-4 mb-3">
                              <div class="card border-0 bg-transparent">
                                  <div class="card-body">
                                      <span class="badge bg-primary rounded-pill fs-4 mb-3 px-3">2</span>
                                      <h5 class="card-title mt-2">Select Options</h5>
                                      <p class="card-text text-muted">Choose the AI model, style, and number of images you desire.</p>
                                  </div>
                              </div>
                          </div>
                          <div class="col-md-4 mb-3">
                              <div class="card border-0 bg-transparent">
                                  <div class="card-body">
                                       <span class="badge bg-primary rounded-pill fs-4 mb-3 px-3">3</span>
                                      <h5 class="card-title mt-2">Generate & Download</h5>
                                      <p class="card-text text-muted">Click "Generate" and download your amazing creations!</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                       <!-- Tùy chọn: Nút kêu gọi hành động -->
                       <!-- <a href="#" class="btn btn-lg btn-primary mt-4 generate_btn">Bắt đầu Sáng tạo Ngay!</a> -->
                  </div>
              </div>
          </div>
      </section>
      <!-- End Additional Information Section -->

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
                  <label for="backgroundInput" class="form-label">Background:</label>
                  <input type="text" class="form-control" id="backgroundInput" placeholder="Background(e.g., A majestic mountain range)">
                </div>
                <div class="mb-3">
                  <label for="characterInput" class="form-label">Character:</label>
                  <input type="text" class="form-control" id="characterInput" placeholder="Character: (e.g., A brave knight in shining armor)">
                </div>
                <div class="mb-3">
                  <label for="hairstyleInput" class="form-label">Hairstyle:</label>
                  <input type="text" class="form-control" id="hairstyleInput" placeholder="Hairstyle: (e.g., Long hair)">
                </div>
                <div class="mb-3">
                  <label for="skinColorInput" class="form-label">Skin Color:</label>
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
    <footer class="bg-light text-center py-3 border-top">
      <div class="container">
        <p class="text-muted">© 2025 AI Image Generator</p>
        <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" class="link-secondary">Hugging Face</a> |
        <a href="https://www.sgu.edu.vn/" target="_blank" rel="noopener noreferrer" class="link-secondary">Saigon University</a>
      </div>
    </footer>
  </div>
</body>
</html>
