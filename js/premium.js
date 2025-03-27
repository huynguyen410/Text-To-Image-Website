// Chờ cả gapi và gsi load xong trước khi thực thi logic
function initApp() {
  // Hàm tạo chuỗi ngẫu nhiên 6 ký tự số
  function generateRandomNumberString(length) {
    const digits = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
  }

  // Hàm lấy thông tin người dùng
  function getCurrentUserInfo() {
    return fetch("../src/get_user_info.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
  }

  // Biến toàn cục lưu thông tin giao dịch
  window.expectedPrice = "";
  // window.expectedTransferContent sẽ được khởi tạo 1 lần sau khi đăng nhập thành công.
  // Khi đăng xuất, bạn cần reset lại biến này (ví dụ: gán bằng chuỗi rỗng)
  window.expectedTransferContent = "";
  let accessToken = null;

  // Cấu hình Gmail API
  const CLIENT_ID = '508561204784-51pehda0ihlu4a74lr8ed3f13k49t3i3.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyDtTvaRz5vaLVpgMGUyJ8jhwBukHdwFPr8';
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
  const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

  // Khởi tạo Gmail API
  function initGmailClient() {
    return new Promise((resolve, reject) => {
      gapi.load('client', () => {
        gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS
        }).then(() => {
          resolve();
        }).catch((error) => {
          console.error("Lỗi khởi tạo Gmail API:", error);
          reject(error);
        });
      });
    });
  }

  // Xử lý OAuth 2.0 để lấy access token
 // Trong hàm initApp()
 function authorizeGmail() {
  return new Promise((resolve, reject) => {
      fetch("../src/gmail_token_manager.php", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          }
      })
      .then(response => {
          console.log("Phản hồi từ server:", response); // Debug
          return response.json();
      })
      .then(token => {
          console.log("Token nhận được:", token); // Debug
          if (token && token !== null) {
              accessToken = token;
              gapi.auth.setToken({ access_token: accessToken });
              resolve();
          } else {
              const tokenClient = google.accounts.oauth2.initTokenClient({
                  client_id: CLIENT_ID,
                  scope: SCOPES,
                  callback: (response) => {
                      if (response && response.access_token) {
                          accessToken = response.access_token;
                          gapi.auth.setToken({ access_token: accessToken });
                          
                          fetch("../src/gmail_token_manager.php", {
                              method: "POST",
                              headers: {
                                  "Content-Type": "application/json"
                              },
                              body: JSON.stringify({
                                  access_token: response.access_token,
                                  expires_in: response.expires_in || 3600,
                                  refresh_token: response.refresh_token || null
                              })
                          })
                          .then(() => resolve())
                          .catch(error => {
                              console.error("Lỗi khi lưu token về server:", error);
                              reject(error);
                          });
                      } else {
                          reject("Không lấy được access token");
                      }
                  },
                  prompt: ''
              });
              tokenClient.requestAccessToken({ prompt: '' });
          }
      })
      .catch(error => {
          console.error("Lỗi khi kiểm tra token từ server:", error);
          reject(error);
      });
  });
}

  // Kiểm tra email từ Timo Support
  function checkGmailForTransfer(expectedAmount, expectedDescription) {
    return gapi.client.gmail.users.messages.list({
      'userId': 'me',
      'q': 'from:"Timo Support"',
      'maxResults': 1
    }).then(response => {
      let messages = response.result.messages;
      if (!messages || messages.length === 0) {
        console.log("Không tìm thấy email từ Timo Support.");
        return false;
      }
      return gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': messages[0].id,
        'format': 'full'
      }).then(msgRes => {
        let body = extractMessageBody(msgRes.result);
        console.log("Nội dung email ban đầu:", body);
        
        const strippedBody = body.replace(/<[^>]+>/g, ' ');
        console.log("Nội dung email sau khi loại bỏ HTML:", strippedBody);
        
        const normalizedAmount = expectedAmount.replace(/[^\d]/g, '');
        const normalizedEmailDigits = strippedBody.replace(/[^\d]/g, '');
        
        const isAmountCorrect = normalizedEmailDigits.includes(normalizedAmount);
        const isCodeMatching = strippedBody.includes(expectedDescription);
        
        console.log("Normalized expectedAmount:", normalizedAmount);
        console.log("Normalized email digits:", normalizedEmailDigits);
        console.log("Kiểm tra số tiền chuyển:", normalizedAmount, isAmountCorrect ? "Đúng" : "Không đúng");
        console.log("Kiểm tra mã chuyển khoản:", expectedDescription, isCodeMatching ? "Khớp" : "Không khớp");
        
        return isAmountCorrect && isCodeMatching;
      });
    }).catch(error => {
      console.error("Lỗi khi kiểm tra email:", error);
      return false;
    });
  }

  // Trích xuất nội dung email
  function extractMessageBody(message) {
    function getTextFromPayload(payload) {
      if (payload.body && payload.body.data) {
        return payload.body.data;
      }
      if (payload.parts) {
        for (let part of payload.parts) {
          if (part.mimeType === 'text/plain' && part.body && part.body.data) {
            return part.body.data;
          }
          const nestedText = getTextFromPayload(part);
          if (nestedText) return nestedText;
        }
      }
      return "";
    }
    const encodedBody = getTextFromPayload(message.payload);
    try {
      return decodeURIComponent(escape(window.atob(encodedBody.replace(/-/g, '+').replace(/_/g, '/'))));
    } catch (e) {
      console.error("Lỗi giải mã nội dung email", e);
      return "";
    }
  }

  // Hàm hiển thị modal hết hạn Premium
  function showPremiumExpiredModal() {
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal fade";
    modalDiv.id = "expiredModal";
    modalDiv.tabIndex = -1;
    modalDiv.setAttribute("aria-hidden", "true");
    modalDiv.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title"><i class="bi bi-exclamation-triangle-fill"></i> Premium đã hết hạn</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Tài khoản Premium của bạn đã hết hạn. Để tiếp tục sử dụng các tính năng Premium, vui lòng đăng ký lại.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button id="renewPremiumBtn" class="btn btn-primary">OK</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);
    const expiredModal = new bootstrap.Modal(modalDiv);
    expiredModal.show();

    // Xử lý nút "OK" để mở modal đăng ký Premium
    document.getElementById("renewPremiumBtn").addEventListener("click", function() {
      expiredModal.hide();
      const premiumModalElement = document.getElementById("premiumModal");
      const premiumModal = new bootstrap.Modal(premiumModalElement);
      premiumModal.show();
      document.getElementById("paymentInfo").style.display = "none";
      const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
      if (confirmPremiumBtn) confirmPremiumBtn.disabled = true;
    });

    modalDiv.addEventListener("hidden.bs.modal", () => modalDiv.remove());
  }

  // Hàm kiểm tra trạng thái Premium
  function checkPremiumStatus() {
    getCurrentUserInfo().then(userInfo => {
      if (userInfo.success && userInfo.user.isPremium === "yes") {
        const today = new Date();
        const endPremium = new Date(userInfo.user.endPremium);
        if (today >= endPremium) {
          fetch("../src/check_premium_expiry.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
          .then(result => {
            if (result.success && result.expired) {
              showPremiumExpiredModal(); // Hiển thị modal hết hạn
              updateQuotaDisplay();
            }
          })
          .catch(error => console.error("Lỗi khi kiểm tra Premium:", error));
        }
      }
    });
  }

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
        } else if (userInfo.user.isPremium === "yes") {
          showAlert("Tài khoản của bạn đã là Premium", "warning");
        } else {
          const premiumModalElement = document.getElementById("premiumModal");
          const premiumModal = new bootstrap.Modal(premiumModalElement);
          premiumModal.show();
          document.getElementById("paymentInfo").style.display = "none";
          const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
          if (confirmPremiumBtn) confirmPremiumBtn.disabled = true;
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
      if (confirmPremiumBtn) confirmPremiumBtn.disabled = false;
    });
  }

  // Lắng nghe thay đổi gói
  const packageRadios = document.querySelectorAll('input[name="package"]');
  packageRadios.forEach(radio => {
    radio.addEventListener("change", function() {
      const paymentInfoDiv = document.getElementById("paymentInfo");
      if (paymentInfoDiv.style.display !== "none") {
        updatePaymentInfo();
      }
    });
  });

  // Cập nhật thông tin thanh toán với mức giá mới
  function updatePaymentInfo() {
    const selectedPackage = document.querySelector('input[name="package"]:checked').value;
    let price = "";
    switch (selectedPackage) {
      case "1": price = "39000 VND"; break;
      case "3": price = "69000 VND"; break;
      case "6": price = "99000 VND"; break;
      case "12": price = "129000 VND"; break;
      default: price = "39000 VND";
    }
    window.expectedPrice = price;
    // Chỉ tạo mã chuyển khoản nếu chưa có (nghĩa là khi đăng nhập mới)
    if (!window.expectedTransferContent) {
      window.expectedTransferContent = generateRandomNumberString(6);
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
          <td class="text-center">Giá: ${price}</td>
        </tr>
        <tr>
          <td class="text-center">
            Tên ngân hàng: Timo Bank<br>
            Số tài khoản: 9021848957816<br>
            Tên chủ tài khoản: Nguyen Huu Duc
          </td>
        </tr>
        <tr>
          <td class="text-center">Nội dung chuyển khoản: ${window.expectedTransferContent}</td>
        </tr>
      </table>
    `;
  }

  // Xử lý nút "Đã chuyển khoản"
  const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
  if (confirmPremiumBtn) {
    confirmPremiumBtn.addEventListener("click", function(e) {
      e.preventDefault();
      const paymentInfoDiv = document.getElementById("paymentInfo");
      if (paymentInfoDiv.style.display === "none") {
        showAlert("Vui lòng xem thông tin thanh toán trước.", "warning");
        return;
      }
      const premiumModalElement = document.getElementById("premiumModal");
      const premiumModalInstance = bootstrap.Modal.getInstance(premiumModalElement);
      if (premiumModalInstance) premiumModalInstance.hide();

      showAlert("Đang kiểm tra giao dịch...", "info");
      initGmailClient()
        .then(() => authorizeGmail())
        .then(() => checkGmailForTransfer(window.expectedPrice, window.expectedTransferContent))
        .then(found => {
          if (found) {
            const selectedPackage = document.querySelector('input[name="package"]:checked').value;
            const priceMap = {
              "1": 39000,
              "3": 69000,
              "6": 99000,
              "12": 129000
            };
            const totalPrice = priceMap[selectedPackage];
            const durationMonths = parseInt(selectedPackage);

            fetch("../src/update_premium.php", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                totalPrice: totalPrice,
                durationMonths: durationMonths
              })
            })
            .then(response => response.json())
            .then(result => {
              if (result.success) {
                showCustomSuccessModal();
                updateQuotaDisplay();
              } else {
                showAlert("Thanh toán thất bại: " + result.message, "danger");
              }
            })
            .catch(() => showAlert("Lỗi server. Vui lòng thử lại.", "danger"));
          } else {
            showAlert("Không tìm thấy giao dịch khớp. Vui lòng kiểm tra lại.", "warning");
          }
        })
        .catch(error => {
          console.error(error);
          showAlert("Lỗi khi kiểm tra Gmail. Vui lòng thử lại.", "danger");
        });
    });
  }

  // Modal thông báo thành công
  function showCustomSuccessModal() {
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
    modalDiv.addEventListener("hidden.bs.modal", () => modalDiv.remove());
  }

  // Gọi hàm kiểm tra Premium khi khởi tạo
  checkPremiumStatus();
}

// Load Google API scripts và chạy app khi sẵn sàng
function loadScriptsAndInit() {
  const gapiScript = document.createElement('script');
  gapiScript.src = 'https://apis.google.com/js/api.js';
  gapiScript.async = true;
  gapiScript.onload = () => {
    const gsiScript = document.createElement('script');
    gsiScript.src = 'https://accounts.google.com/gsi/client';
    gsiScript.async = true;
    gsiScript.onload = () => {
      console.log("Cả gapi và gsi đã load xong.");
      initApp(); // Chạy logic sau khi cả hai script đã sẵn sàng
    };
    gsiScript.onerror = () => console.error("Lỗi load gsi script");
    document.head.appendChild(gsiScript);
  };
  gapiScript.onerror = () => console.error("Lỗi load gapi script");
  document.head.appendChild(gapiScript);
}

document.addEventListener("DOMContentLoaded", loadScriptsAndInit);
