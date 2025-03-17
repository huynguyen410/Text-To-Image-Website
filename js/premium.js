document.addEventListener("DOMContentLoaded", () => {
  // Xử lý nút "Đăng ký Premium"
  const premiumBtn = document.getElementById("premiumBtn");
  if (premiumBtn) {
    premiumBtn.addEventListener("click", function() {
      getCurrentUserInfo().then(userInfo => {
        if (!userInfo.success) {
          const loginModalElement = document.getElementById("loginRegisterModal");
          const loginModal = new bootstrap.Modal(loginModalElement);
          loginModal.show();
          showAlert("Vui lòng đăng nhập để đăng ký Premium", "warning");
        } else {
          // Sửa chỗ này: kiểm tra isPremium từ userInfo.user
          if (userInfo.user.isPremium === "yes") {
            showAlert("Tài khoản của bạn đã là Premium", "warning");
          } else {
            const premiumModalElement = document.getElementById("premiumModal");
            const premiumModal = new bootstrap.Modal(premiumModalElement);
            premiumModal.show();
            // Ẩn thông tin thanh toán và vô hiệu nút xác nhận
            const paymentInfoDiv = document.getElementById("paymentInfo");
            paymentInfoDiv.style.display = "none";
            const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
            if (confirmPremiumBtn) {
              confirmPremiumBtn.disabled = true;
            }
          }
        }
      });
    });
  }

  // Xử lý nút "Xem thông tin thanh toán"
  const showPaymentInfoBtn = document.getElementById("showPaymentInfoBtn");
  if (showPaymentInfoBtn) {
    showPaymentInfoBtn.addEventListener("click", function() {
      updatePaymentInfo();
      document.getElementById("paymentInfo").style.display = "block";
      const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
      if (confirmPremiumBtn) {
        confirmPremiumBtn.disabled = false;
      }
    });
  }
  
  // Lắng nghe sự thay đổi của nhóm radio để cập nhật thông tin nếu đã hiển thị
  const packageRadios = document.querySelectorAll('input[name="package"]');
  packageRadios.forEach(radio => {
    radio.addEventListener("change", function() {
      const paymentInfoDiv = document.getElementById("paymentInfo");
      if (paymentInfoDiv.style.display !== "none") {
        updatePaymentInfo();
      }
    });
  });
  
  // Hàm cập nhật thông tin thanh toán demo dựa trên gói được chọn
  const updatePaymentInfo = () => {
    const selectedPackage = document.querySelector('input[name="package"]:checked').value;
    let price = "";
    switch(selectedPackage) {
      case "1":
        price = "499.000 VNĐ";
        break;
      case "3":
        price = "1.299.000 VNĐ";
        break;
      case "6":
        price = "2.299.000 VNĐ";
        break;
      case "12":
        price = "3.999.000 VNĐ";
        break;
      default:
        price = "499.000 VNĐ";
    }
    const paymentInfoDiv = document.getElementById("paymentInfo");
    paymentInfoDiv.innerHTML = `
      <table class="table table-bordered">
        <tr>
          <td class="text-center">
            <img src="../images/qr_demo.png" alt="QR Code" class="img-fluid" style="max-width: 200px;">
          </td>
        </tr>
        <tr>
          <td class="text-center">
            Giá: ${price}
          </td>
        </tr>
        <tr>
          <td class="text-center">
            Tên ngân hàng: ABC Bank<br>
            Số tài khoản: 123456789<br>
            Tên chủ tài khoản: Công ty XYZ
          </td>
        </tr>
      </table>
    `;
  };

  // Xử lý nút "Đã chuyển khoản"
  const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
  if (confirmPremiumBtn) {
    confirmPremiumBtn.addEventListener("click", function(e) {
      e.preventDefault();
      const paymentInfoDiv = document.getElementById("paymentInfo");
      if (paymentInfoDiv.style.display === "none") {
        showAlert("Vui lòng xem thông tin thanh toán trước khi xác nhận chuyển khoản.", "warning");
        return;
      }
      // Ẩn modal thanh toán để tránh chồng lấn với modal nhập mã giao dịch
      const premiumModalElement = document.getElementById("premiumModal");
      const premiumModalInstance = bootstrap.Modal.getInstance(premiumModalElement);
      if (premiumModalInstance) {
        premiumModalInstance.hide();
      }
      // Mở modal nhập mã giao dịch demo
      removeTransactionModal();
      createTransactionModal();
    });
  }

  // Hàm xóa modal nhập mã giao dịch nếu tồn tại
  const removeTransactionModal = () => {
    const existingModal = document.getElementById("transactionModal");
    if (existingModal) {
      existingModal.remove();
    }
  };

  // Hàm tạo modal nhập mã giao dịch (4 số cuối)
  const createTransactionModal = () => {
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal fade";
    modalDiv.id = "transactionModal";
    modalDiv.tabIndex = -1;
    modalDiv.setAttribute("aria-labelledby", "transactionModalLabel");
    modalDiv.setAttribute("aria-hidden", "true");
    modalDiv.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="transactionModalLabel">Nhập mã giao dịch</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="input-group">
              <span class="input-group-text">Mã giao dịch (4 số cuối):</span>
              <input type="text" id="transactionCodeInput" class="form-control" maxlength="4" placeholder="XXXX">
              <span id="transactionCodeValid" class="input-group-text" style="display:none; color: green;">
                <i class="bi bi-check-circle-fill"></i>
              </span>
            </div>
            <small class="text-muted">Vui lòng nhập 4 số cuối của mã giao dịch.</small>
          </div>
          <div class="modal-footer">
            <button type="button" id="transactionConfirmBtn" class="btn btn-success" disabled>Xác nhận mã</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);
    const transactionModal = new bootstrap.Modal(modalDiv);
    transactionModal.show();

    const transactionInput = document.getElementById("transactionCodeInput");
    const transactionConfirmBtn = document.getElementById("transactionConfirmBtn");
    const validSpan = document.getElementById("transactionCodeValid");

    transactionInput.addEventListener("input", function() {
      const code = transactionInput.value;
      if (code.length === 4 && /^\d{4}$/.test(code)) {
        validSpan.style.display = "inline-block";
        transactionConfirmBtn.disabled = false;
      } else {
        validSpan.style.display = "none";
        transactionConfirmBtn.disabled = true;
      }
    });

    transactionConfirmBtn.addEventListener("click", function() {
      const code = transactionInput.value;
      if (code.length !== 4 || !/^\d{4}$/.test(code)) {
        showAlert("Vui lòng nhập đúng 4 số cuối của mã giao dịch.", "warning");
        return;
      }
      // Gọi file update_premium.php để cập nhật trạng thái Premium (demo)
      fetch("update_premium.php", { method: "POST" })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            showCustomSuccessModal();
            updateQuotaDisplay();
            // Đóng modal nhập mã
            const transactionModalInstance = bootstrap.Modal.getInstance(modalDiv);
            if (transactionModalInstance) {
              transactionModalInstance.hide();
            }
          } else {
            showAlert("Thanh toán thất bại: " + result.message, "danger");
          }
        })
        .catch(error => {
          showAlert("Có lỗi xảy ra. Vui lòng thử lại sau.", "danger");
        });
    });
  };

  // Hàm hiển thị modal thông báo thanh toán thành công (demo)
  const showCustomSuccessModal = () => {
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal fade";
    modalDiv.id = "successModal";
    modalDiv.tabIndex = -1;
    modalDiv.setAttribute("aria-hidden", "true");
    modalDiv.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-success">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title"><i class="bi bi-check-circle-fill"></i> Thành công!</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Thanh toán thành công. Tài khoản của bạn đã được cập nhật thành Premium.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);
    const successModal = new bootstrap.Modal(modalDiv);
    successModal.show();
    modalDiv.addEventListener("hidden.bs.modal", () => {
      modalDiv.remove();
    });
  };
});
