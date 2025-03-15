document.addEventListener("DOMContentLoaded", () => {
  // Xử lý nút "Đăng ký Premium"
  const premiumBtn = document.getElementById("premiumBtn");
  if (premiumBtn) {
    premiumBtn.addEventListener("click", function() {
      // Sử dụng hàm getCurrentUserInfo() để kiểm tra trạng thái đăng nhập
      getCurrentUserInfo().then(userInfo => {
        if (!userInfo.success) {
          // Nếu chưa đăng nhập, mở modal đăng nhập và thông báo
          const loginModalElement = document.getElementById("loginRegisterModal");
          const loginModal = new bootstrap.Modal(loginModalElement);
          loginModal.show();
          showAlert("Vui lòng đăng nhập để đăng ký Premium", "warning");
        } else {
          if (userInfo.isPremium === "yes") {
            // Nếu tài khoản đã là Premium, hiển thị thông báo
            showAlert("Tài khoản của bạn đã là Premium", "warning");
          } else {
            // Nếu đã đăng nhập và chưa Premium, mở modal thanh toán demo
            const premiumModalElement = document.getElementById("premiumModal");
            const premiumModal = new bootstrap.Modal(premiumModalElement);
            premiumModal.show();
          }
        }
      });
    });
  }

  // Xử lý nút "Đã chuyển khoản" trong modal Premium (Demo)
  const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
  if (confirmPremiumBtn) {
    confirmPremiumBtn.addEventListener("click", function() {
      fetch("js/update_premium.php", { method: "POST" })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            showAlert("Thanh toán thành công. Bạn đã đăng ký Premium!", "success");
            updateQuotaDisplay();
            // Reload trang để cập nhật trạng thái Premium
            window.location.reload();
          } else {
            showAlert("Thanh toán thất bại. Vui lòng thử lại sau.", "danger");
          }
        })
        .catch(error => {
          showAlert("Có lỗi xảy ra. Vui lòng thử lại sau.", "danger");
        });
    });
  }
});
