<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image History</title>
    <link rel="stylesheet" href="../css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
    <script src="../js/utils.js" defer></script>
    <script src="../js/script.js" defer></script>
    <script src="../js/generate_image.js" defer></script>
    <script src="../js/premium.js" defer></script>
    <script>
        window.onload = () => {
            loadHistory(); // Gọi loadHistory với trang mặc định
        };
    </script>
</head>
<body>
    <div class="wrapper">
        <div class="content">
            <!-- Navbar -->
            <?php include_once 'navbar.php'; ?>

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
                            <h5 class="modal-title" id="notificationModalLabel">Notification</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="notificationModalBody">
                            <!-- Notification content will be inserted here -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lịch sử hình ảnh -->
            <div class="container mt-5">
                <div class="d-flex align-items-center justify-content-between">
                    <h2>Image History</h2>
                    <!-- Dropdown chọn số mục hiển thị mỗi trang -->
                    <div>
                        <select id="historyLimit" class="form-select w-auto">
                            <option value="10" selected>10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
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
            <a href="https://www.sgu.edu.vn/" target="_blank" rel="noopener noreferrer" class="link-secondary">Saigon University</a>
        </div>
    </footer>
</body>
</html>
