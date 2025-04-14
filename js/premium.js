// premium.js (Phiên bản sử dụng Bootstrap Modals cho thông báo)
// Ngày: 14/04/2025 (Ví dụ)

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
      return fetch("../src/get_user_info.php", { // Đảm bảo đường dẫn này đúng
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          }
      }).then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error getting user info! status: ${response.status}`);
          }
          return response.json();
      })
      .catch(error => {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          // Trả về một đối tượng lỗi chuẩn hóa
          return { success: false, message: "Không thể lấy thông tin người dùng: " + error.message };
      });
  }

  // ----- Các biến toàn cục -----
  window.expectedPrice = "";
  window.expectedTransferContent = "";
  let accessToken = null;

  // ----- Cấu hình Google API -----
  const CLIENT_ID = '537769433903-t7s4knrmcd8ituj7pqr4hhul4mj53tuk.apps.googleusercontent.com';
  const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
  const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

  // ----- Hàm hiển thị Modal Bootstrap động -----
  function showBootstrapModal(title, message, type = 'info') {
      // Xóa modal cũ nếu còn tồn tại để tránh trùng lặp ID
      const existingModal = document.getElementById('dynamicBootstrapModal');
      if (existingModal) {
          const modalInstance = bootstrap.Modal.getInstance(existingModal);
          if (modalInstance) {
              // Đảm bảo modal ẩn hoàn toàn trước khi xóa DOM listener
              existingModal.addEventListener('hidden.bs.modal', () => {
                  if(document.getElementById('dynamicBootstrapModal')) { // Kiểm tra lại trước khi xóa
                       document.getElementById('dynamicBootstrapModal').remove();
                  }
              }, { once: true });
              modalInstance.hide();
               // Nếu modal không ẩn được ngay, xóa luôn để tránh treo
               setTimeout(() => {
                    if(document.getElementById('dynamicBootstrapModal')) {
                         document.getElementById('dynamicBootstrapModal').remove();
                    }
               }, 500); // Đợi 0.5s
          } else {
               existingModal.remove(); // Xóa trực tiếp nếu không có instance
          }
      }


      // --- Định nghĩa styles và icons cho từng loại ---
      let modalHeaderClass = 'bg-primary';
      let modalIconClass = 'bi-info-circle-fill';
      let modalButtonClass = 'btn-primary';
      let modalHeaderTextColor = 'text-white';

      switch (type) {
          case 'success':
              modalHeaderClass = 'bg-success';
              modalIconClass = 'bi-check-circle-fill';
              modalButtonClass = 'btn-success';
              break;
          case 'warning':
              modalHeaderClass = 'bg-warning';
              modalIconClass = 'bi-exclamation-triangle-fill';
              modalButtonClass = 'btn-warning';
              modalHeaderTextColor = 'text-dark';
              break;
          case 'danger':
              modalHeaderClass = 'bg-danger';
              modalIconClass = 'bi-x-octagon-fill';
              modalButtonClass = 'btn-danger';
              break;
          case 'info':
               modalHeaderClass = 'bg-info';
               modalIconClass = 'bi-info-circle-fill';
               modalButtonClass = 'btn-info';
               modalHeaderTextColor = 'text-dark';
              break;
      }

      // --- Tạo cấu trúc HTML cho Modal ---
      const modalDiv = document.createElement('div');
      modalDiv.className = "modal fade";
      modalDiv.id = "dynamicBootstrapModal";
      modalDiv.tabIndex = -1;
      modalDiv.setAttribute("aria-labelledby", "dynamicBootstrapModalLabel");
      modalDiv.setAttribute("aria-hidden", "true");

      modalDiv.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-header ${modalHeaderClass} ${modalHeaderTextColor}">
              <h5 class="modal-title" id="dynamicBootstrapModalLabel">
                <i class="bi ${modalIconClass} me-2"></i>${title}
              </h5>
              <button type="button" class="btn-close ${modalHeaderTextColor === 'text-white' ? 'btn-close-white': ''}" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>${message}</p> </div>
            <div class="modal-footer">
              <button type="button" class="btn ${modalButtonClass}" data-bs-dismiss="modal">Đóng</button>
            </div>
          </div>
        </div>
      `;

      // --- Thêm Modal vào body và hiển thị ---
      document.body.appendChild(modalDiv);

      const modalElement = document.getElementById('dynamicBootstrapModal');
      if (!modalElement) {
           console.error("Không thể tạo #dynamicBootstrapModal");
           return;
      }
      const modalInstance = new bootstrap.Modal(modalElement);

      modalElement.addEventListener('hidden.bs.modal', function () {
        // Kiểm tra lại trước khi xóa
        if(document.getElementById('dynamicBootstrapModal')) {
             document.getElementById('dynamicBootstrapModal').remove();
        }
      }, { once: true });

      modalInstance.show();
    }


  // ----- Khởi tạo Google API Client -----
  function initGmailClient() {
      return new Promise((resolve, reject) => {
          if (typeof gapi === 'undefined' || !gapi.load) {
              console.error("gapi chưa được load.");
              // Sử dụng modal mới để báo lỗi
              showBootstrapModal("Lỗi Khởi Tạo", "Thư viện Google API (gapi) chưa sẵn sàng. Vui lòng tải lại trang.", "danger");
              return reject("Lỗi: Thư viện Google API (gapi) chưa sẵn sàng.");
          }
          gapi.load('client', () => {
              gapi.client.init({
                  discoveryDocs: DISCOVERY_DOCS
              }).then(() => {
                  console.log("Gmail API client đã khởi tạo.");
                  resolve();
              }).catch((error) => {
                  console.error("Lỗi khởi tạo Gmail API client:", error);
                  showBootstrapModal("Lỗi Khởi Tạo Gmail Client", `Không thể khởi tạo Gmail client. Lỗi: ${error.message || JSON.stringify(error)}`, "danger");
                  reject(error);
              });
          });
      });
  }

  // ----- Lấy Access Token từ Backend -----
  function authorizeGmail() {
      return new Promise((resolve, reject) => {
          console.log("Đang yêu cầu access token từ server...");
          fetch("../src/gmail_token_manager.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" }
          })
          .then(response => {
              if (!response.ok) {
                  console.error(`Lỗi HTTP từ gmail_token_manager.php: ${response.status} ${response.statusText}`);
                  throw new Error(`Lỗi server khi lấy token (${response.status})`);
              }
              return response.json();
          })
          .then(token => {
              if (token && typeof token === 'string') {
                  console.log("Nhận được Access Token hợp lệ từ server.");
                  accessToken = token;
                  if (typeof gapi !== 'undefined' && gapi.auth) {
                      gapi.auth.setToken({ access_token: accessToken });
                      console.log("Đã set access token cho gapi.");
                  } else {
                      console.error("gapi hoặc gapi.auth chưa sẵn sàng để set token.");
                      throw new Error("Lỗi cấu hình GAPI, không thể set token.");
                  }
                  resolve();
              } else {
                  console.error("Không lấy được access token hợp lệ từ server (Server trả về: " + JSON.stringify(token) + ").");
                  showBootstrapModal(
                      "Lỗi Ủy Quyền Gmail",
                      "Không thể truy cập Gmail để kiểm tra thanh toán. Có thể bạn cần cấp lại quyền truy cập cho ứng dụng (thông qua quản trị viên hoặc trang cài đặt) hoặc token đã hết hạn.",
                      "danger"
                  );
                  reject("Không có access token hợp lệ từ server.");
              }
          })
          .catch(error => {
              console.error("Lỗi nghiêm trọng khi gọi gmail_token_manager.php:", error);
              showBootstrapModal("Lỗi Kết Nối Server", `Lỗi kết nối hoặc xử lý phía server khi lấy token Gmail. Vui lòng thử lại sau. Chi tiết: ${error.message}`, "danger");
              reject("Lỗi khi lấy token Gmail: " + error.message);
          });
      });
  }


  // ----- Kiểm tra Email từ Timo Support -----
  function checkGmailForTransfer(expectedAmount, expectedDescription) {
      if (!accessToken || typeof gapi === 'undefined' || !gapi.client || !gapi.client.gmail) {
          console.error("Gmail API chưa sẵn sàng hoặc chưa được xác thực.");
          showBootstrapModal("Lỗi Kết Nối Gmail", "Chưa thể kết nối tới Gmail để kiểm tra. Vui lòng thử lại sau.", "danger");
          return Promise.reject("Gmail API not ready or not authorized.");
      }

      console.log(`Đang tìm email với Số tiền chứa "${expectedAmount}" và Nội dung chứa "${expectedDescription}"`);

      const actualSender = "Timo Support"; // <<<=== KIỂM TRA LẠI TÊN/EMAIL NGƯỜI GỬI NÀY
      const query = `from:"${actualSender}"`; // Query rộng nhất để test
      console.log("Sử dụng Query Gmail:", query);

      return gapi.client.gmail.users.messages.list({
          'userId': 'me', 'q': query, 'maxResults': 5
      }).then(response => {
          console.log("Kết quả trả về từ messages.list:", JSON.stringify(response, null, 2));

          if (!response || !response.result) throw new Error("Phản hồi không hợp lệ từ Gmail API (list).");
          if (!response.result.messages || response.result.messages.length === 0) {
              if (response.result.resultSizeEstimate > 0) console.warn(`API báo có ${response.result.resultSizeEstimate} email khớp query nhưng không trả về message IDs.`);
              else console.log(`Không tìm thấy email nào khớp với query: "${query}"`);
              return false;
          }

          let messages = response.result.messages;
          console.log(`Tìm thấy ${messages.length} email khớp query. Đang kiểm tra nội dung email đầu tiên: ${messages[0].id}`);

          return gapi.client.gmail.users.messages.get({
              'userId': 'me', 'id': messages[0].id, 'format': 'full'
          }).then(msgRes => {
              if (!msgRes || !msgRes.result) throw new Error("Phản hồi không hợp lệ khi lấy nội dung email.");

              let body = extractMessageBody(msgRes.result);
              console.log("Nội dung email gốc (đã giải mã):", body);
              if (!body) { console.log("Không thể trích xuất nội dung email."); return false; }

              const strippedBody = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
              console.log("Nội dung email sau khi loại bỏ HTML:", strippedBody);

              const normalizedExpectedAmount = expectedAmount.replace(/[^\d]/g, '');
              const normalizedExpectedDescription = expectedDescription.trim();

              const amountRegex = new RegExp(`\\b${normalizedExpectedAmount}\\b`);
              const isAmountCorrect = amountRegex.test(strippedBody.replace(/[.,]/g, ''));

              const codeRegex = new RegExp(`\\b${normalizedExpectedDescription}\\b`);
              const isCodeMatching = codeRegex.test(strippedBody);

              console.log(`Kiểm tra số tiền: Mong đợi chứa "${normalizedExpectedAmount}", Kết quả: ${isAmountCorrect}`);
              console.log(`Kiểm tra mã CK: Mong đợi chứa "${normalizedExpectedDescription}" (dùng regex \\b), Kết quả: ${isCodeMatching}`);

              if (isAmountCorrect && isCodeMatching) {
                  console.log("Tìm thấy giao dịch khớp!");
                  // GAPI call to mark as read (optional)
                  // gapi.client.gmail.users.messages.modify(...)
                  return true;
              } else {
                  console.log("Nội dung email không khớp với số tiền hoặc mã chuyển khoản.");
                  return false;
              }
          });
      }).catch(error => {
          console.error("Lỗi khi kiểm tra email (trong chain .catch):", error);
          let errorTitle = "Lỗi Kiểm Tra Email";
          let errorMessage = "Lỗi không xác định khi kiểm tra email từ Gmail.";
           if (error.result && error.result.error) {
               console.error("Chi tiết lỗi API:", error.result.error);
               errorMessage = `Lỗi Gmail API (${error.result.error.code}): ${error.result.error.message}`;
               if (error.result.error.status === 'UNAUTHENTICATED') {
                    errorMessage = "Phiên xác thực Gmail hết hạn hoặc không hợp lệ. Vui lòng thử xác thực lại.";
                    accessToken = null;
                    errorTitle = "Lỗi Xác Thực Gmail";
               }
          } else if (error.message) {
              errorMessage = error.message;
          }
          showBootstrapModal(errorTitle, errorMessage, "danger");
          return false; // Coi như không tìm thấy nếu có lỗi
      });
  }

  // ----- Trích xuất nội dung Email -----
  function extractMessageBody(message) {
      let encodedBody = "";
      const payload = message.payload;
      function findPlainTextPart(parts) { /* ... Giữ nguyên hàm này ... */
          for (let part of parts) {
              if (part.mimeType === 'text/plain' && part.body && part.body.data) { return part.body.data; }
              if (part.parts) { const nestedResult = findPlainTextPart(part.parts); if (nestedResult) return nestedResult; }
          } return null;
      }
      if (payload.parts) { encodedBody = findPlainTextPart(payload.parts); }
      if (!encodedBody && payload.body && payload.body.data) { console.log("Không tìm thấy part text/plain, lấy từ payload.body.data."); encodedBody = payload.body.data; }
      if (!encodedBody && payload.parts) { /* ... Giữ nguyên logic tìm text/html ... */
          for (let part of payload.parts) { if (part.mimeType === 'text/html' && part.body && part.body.data) { console.log("Lấy phần text/html làm phương án cuối."); encodedBody = part.body.data; break;}}
      }
      if (encodedBody) { try { const base64 = encodedBody.replace(/-/g, '+').replace(/_/g, '/'); const decoded = window.atob(base64); return decodeURIComponent(escape(decoded)); } catch (e) { console.error("Lỗi giải mã email:", e); return ""; }}
      else { console.log("Không tìm thấy nội dung email phù hợp."); return ""; }
  }

  // ----- Hiển thị Modal Hết hạn Premium -----
  function showPremiumExpiredModal() {
      // (Giữ nguyên hàm này vì nó đã là modal chuyên biệt)
      if (document.getElementById("expiredModal")) return;
      const modalDiv = document.createElement("div");
      // ... (innerHTML và logic của showPremiumExpiredModal giữ nguyên) ...
      modalDiv.className = "modal fade";
      modalDiv.id = "expiredModal";
      modalDiv.tabIndex = -1;
      modalDiv.setAttribute("aria-labelledby", "expiredModalLabel");
      modalDiv.setAttribute("aria-hidden", "true");
      modalDiv.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content border-warning"> <div class="modal-header bg-warning text-dark"> <h5 class="modal-title" id="expiredModalLabel"><i class="bi bi-exclamation-triangle-fill me-2"></i>Premium đã hết hạn</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> </div> <div class="modal-body"> <p>Tài khoản Premium của bạn đã hết hạn hoặc không còn hiệu lực.</p> <p>Để tiếp tục sử dụng các tính năng Premium, vui lòng gia hạn hoặc đăng ký lại.</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button> <button id="renewPremiumBtn" type="button" class="btn btn-primary">Gia hạn / Đăng ký lại</button> </div> </div>
      </div>`;
      document.body.appendChild(modalDiv);
      const expiredModalEl = document.getElementById("expiredModal");
      const expiredModal = new bootstrap.Modal(expiredModalEl);
      expiredModal.show();
      const renewBtn = document.getElementById("renewPremiumBtn");
      if(renewBtn) { /* ... logic nút renew giữ nguyên ... */
          renewBtn.addEventListener("click", function() {
              expiredModal.hide();
              const premiumModalElement = document.getElementById("premiumModal");
              if (premiumModalElement) {
                   const premiumModal = bootstrap.Modal.getOrCreateInstance(premiumModalElement);
                   premiumModal.show();
                   const paymentInfoDiv = document.getElementById("paymentInfo");
                   if(paymentInfoDiv) paymentInfoDiv.style.display = "none";
                   const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
                   if (confirmPremiumBtn) confirmPremiumBtn.disabled = true;
              } else {
                   console.error("Không tìm thấy premiumModal");
                   showBootstrapModal("Lỗi Giao Diện", "Không thể mở cửa sổ đăng ký Premium.", "danger");
              }
          });
      }
      expiredModalEl.addEventListener('hidden.bs.modal', () => modalDiv.remove(), { once: true });
  }

  // ----- Kiểm tra Trạng thái Premium -----
  function checkPremiumStatus() {
      getCurrentUserInfo().then(userInfo => {
          if (userInfo.success && userInfo.user) {
              const isPremium = userInfo.user.isPremium === "yes";
              const endPremiumDate = userInfo.user.endPremium ? new Date(userInfo.user.endPremium) : null;
              const today = new Date(); today.setHours(0, 0, 0, 0);
              if (isPremium && endPremiumDate && today >= endPremiumDate) {
                  console.log("Phát hiện Premium đã hết hạn...");
                  fetch("../src/check_premium_expiry.php", { method: "POST", headers: { "Content-Type": "application/json" }})
                  .then(response => response.json())
                  .then(result => {
                      if (result.success && result.expired) {
                          console.log("Backend xác nhận hết hạn. Hiển thị modal.");
                          showPremiumExpiredModal();
                          updateQuotaDisplay();
                      } else if (!result.success) { console.error("Lỗi từ check_premium_expiry.php:", result.message); }
                      else { console.log("Backend báo premium chưa hết hạn."); }
                  })
                  .catch(error => console.error("Lỗi khi gọi check_premium_expiry.php:", error));
              } else { console.log("Trạng thái Premium hợp lệ hoặc không phải Premium."); }
          } else { console.log("Người dùng chưa đăng nhập, bỏ qua kiểm tra premium."); }
      });
  }

  // ----- Xử lý các nút và sự kiện -----

  // Nút "Đăng ký Premium"
  const premiumBtn = document.getElementById("premiumBtn");
  if (premiumBtn) {
      premiumBtn.addEventListener("click", function() {
          getCurrentUserInfo().then(userInfo => {
              if (!userInfo.success || !userInfo.user) {
                  const loginModalElement = document.getElementById("loginRegisterModal");
                  if (loginModalElement) {
                      bootstrap.Modal.getOrCreateInstance(loginModalElement).show();
                      // Thay thế showAlert
                      showBootstrapModal("Yêu Cầu Đăng Nhập", "Vui lòng đăng nhập để có thể đăng ký Premium.", "warning");
                  } else {
                      console.error("Không tìm thấy loginRegisterModal");
                      showBootstrapModal("Lỗi", "Vui lòng đăng nhập để tiếp tục.", "warning");
                  }
              } else if (userInfo.user.isPremium === "yes") {
                  // Thay thế showAlert
                  showBootstrapModal("Thông Báo", "Tài khoản của bạn hiện đã là Premium.", "info");
              } else {
                  const premiumModalElement = document.getElementById("premiumModal");
                  if (premiumModalElement) {
                      const premiumModal = bootstrap.Modal.getOrCreateInstance(premiumModalElement);
                      premiumModal.show();
                      const paymentInfoDiv = document.getElementById("paymentInfo");
                      if(paymentInfoDiv) paymentInfoDiv.style.display = "none";
                      const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
                      if (confirmPremiumBtn) confirmPremiumBtn.disabled = true;
                      const defaultPackage = document.querySelector('input[name="package"][value="1"]');
                      if (defaultPackage) defaultPackage.checked = true;
                  } else {
                      console.error("Không tìm thấy premiumModal");
                      // Thay thế showAlert
                      showBootstrapModal("Lỗi Giao Diện", "Không thể mở cửa sổ đăng ký Premium. Vui lòng tải lại trang.", "danger");
                  }
              }
          });
      });
  }

  // Nút "Xem thông tin thanh toán"
  const showPaymentInfoBtn = document.getElementById("showPaymentInfoBtn");
  if (showPaymentInfoBtn) {
      showPaymentInfoBtn.addEventListener("click", function() {
          getCurrentUserInfo().then(userInfo => {
              if (!userInfo.success || !userInfo.user) {
                  // Thay thế showAlert
                  showBootstrapModal("Yêu Cầu Đăng Nhập", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để lấy thông tin thanh toán.", "warning");
                  const premiumModalElement = document.getElementById("premiumModal");
                  const premiumModal = bootstrap.Modal.getInstance(premiumModalElement);
                  if (premiumModal) premiumModal.hide();
                  const loginModalElement = document.getElementById("loginRegisterModal");
                  if (loginModalElement) bootstrap.Modal.getOrCreateInstance(loginModalElement).show();
                  return;
              }
              if (!window.expectedTransferContent) {
                  window.expectedTransferContent = generateRandomNumberString(6);
                  console.log("Đã tạo mã chuyển khoản mới:", window.expectedTransferContent);
              }
              updatePaymentInfo();
              const paymentInfoDiv = document.getElementById("paymentInfo");
              if(paymentInfoDiv) paymentInfoDiv.style.display = "block";
              const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
              if (confirmPremiumBtn) confirmPremiumBtn.disabled = false;
          });
      });
  }

  // Lắng nghe thay đổi gói premium
  const packageRadios = document.querySelectorAll('input[name="package"]');
  packageRadios.forEach(radio => {
      radio.addEventListener("change", function() {
          const paymentInfoDiv = document.getElementById("paymentInfo");
          if (paymentInfoDiv && paymentInfoDiv.style.display !== "none") {
              updatePaymentInfo();
          }
      });
  });

  // ----- Cập nhật Thông tin Thanh toán -----
  function updatePaymentInfo() {
      // (Giữ nguyên hàm này)
      const selectedPackageRadio = document.querySelector('input[name="package"]:checked');
      if (!selectedPackageRadio) { console.warn("Chưa chọn gói nào."); return; }
      const selectedPackage = selectedPackageRadio.value;
      let price = "";
      switch (selectedPackage) {
          case "1": price = "39,000 VND"; break; case "3": price = "69,000 VND"; break; case "6": price = "99,000 VND"; break; case "12": price = "129,000 VND"; break; default: price = "39,000 VND";
      }
      window.expectedPrice = price;
      if (!window.expectedTransferContent) { window.expectedTransferContent = generateRandomNumberString(6); console.log("Tạo mã CK trong updatePaymentInfo:", window.expectedTransferContent); }
      const paymentInfoDiv = document.getElementById("paymentInfo");
      if (!paymentInfoDiv) return;
      paymentInfoDiv.innerHTML = `
      <p class="text-center mb-3">Quét mã QR hoặc chuyển khoản thủ công theo thông tin dưới đây:</p>
      <table class="table table-bordered align-middle"> <tbody> <tr> <td rowspan="4" class="text-center" style="width: 220px;"> <img src="../images/qr_demo.png" alt="QR Code Thanh toán" class="img-fluid" style="max-width: 200px; border: 1px solid #dee2e6;"> <small class="d-block mt-1">Quét mã để thanh toán</small> </td> <th scope="row" style="width: 150px;">Ngân hàng</th> <td>Timo by Ban Viet Bank</td> </tr> <tr> <th scope="row">Số tài khoản</th> <td id="accNumber">9021848957816 <button class="btn btn-sm btn-outline-secondary ms-2 py-0 px-1" onclick="copyToClipboard('accNumber')"><i class="bi bi-clipboard"></i></button></td> </tr> <tr> <th scope="row">Chủ tài khoản</th> <td>Nguyen Huu Duc</td> </tr> <tr> <th scope="row">Số tiền</th> <td id="accPrice" class="fw-bold">${price} <button class="btn btn-sm btn-outline-secondary ms-2 py-0 px-1" onclick="copyToClipboard('accPrice', '${price.replace(/[^0-9]/g, '')}')"><i class="bi bi-clipboard"></i></button></td> </tr> <tr> <td colspan="3" class="text-center fw-bold bg-light"> Nội dung chuyển khoản <span class="text-danger">(Bắt buộc chính xác)</span>: <strong id="accContent" class="ms-2 user-select-all">${window.expectedTransferContent}</strong> <button class="btn btn-sm btn-outline-secondary ms-2 py-0 px-1" onclick="copyToClipboard('accContent')"><i class="bi bi-clipboard"></i></button> </td> </tr> </tbody> </table>
      <p class="text-center text-muted small mt-2">Sau khi chuyển khoản thành công, vui lòng nhấn nút "Tôi đã chuyển khoản" bên dưới.</p>`;
  }

  // ----- Hàm sao chép vào Clipboard -----
  window.copyToClipboard = function(elementId, valueToCopy = null) {
      // (Giữ nguyên hàm này)
      const element = document.getElementById(elementId); let textToCopy = valueToCopy; if (!textToCopy && element) { textToCopy = element.innerText || element.textContent; } if (textToCopy) { navigator.clipboard.writeText(textToCopy.trim()).then(() => { const originalButton = element.querySelector('button') || document.querySelector(`button[onclick*="'${elementId}'"]`); if(originalButton) { const originalIcon = originalButton.innerHTML; originalButton.innerHTML = '<i class="bi bi-check-lg"></i>'; originalButton.classList.remove('btn-outline-secondary'); originalButton.classList.add('btn-success'); setTimeout(() => { originalButton.innerHTML = originalIcon; originalButton.classList.remove('btn-success'); originalButton.classList.add('btn-outline-secondary'); }, 1500); } }).catch(err => { console.error('Lỗi sao chép:', err); showBootstrapModal("Lỗi Sao Chép", "Không thể tự động sao chép. Vui lòng sao chép thủ công.", "danger"); }); } else { console.error('Không có nội dung để sao chép:', elementId); }
  }


  // ----- Xử lý nút "Đã chuyển khoản" -----
  const confirmPremiumBtn = document.getElementById("confirmPremiumBtn");
  if (confirmPremiumBtn) {
      confirmPremiumBtn.addEventListener("click", function(e) {
          e.preventDefault();
          const paymentInfoDiv = document.getElementById("paymentInfo");
          if (!paymentInfoDiv || paymentInfoDiv.style.display === "none") {
              // Thay thế showAlert
              showBootstrapModal("Thiếu Thông Tin", "Vui lòng nhấn 'Xem thông tin thanh toán' để lấy mã giao dịch trước khi xác nhận.", "warning");
              return;
          }

          const premiumModalElement = document.getElementById("premiumModal");
          const premiumModalInstance = bootstrap.Modal.getInstance(premiumModalElement);
          if (premiumModalInstance) premiumModalInstance.hide();

          // Thay thế showAlert bằng modal (lưu ý: modal này sẽ cần đóng thủ công sau)
          showBootstrapModal("Đang xử lý", "Đang kiểm tra giao dịch qua Gmail, vui lòng chờ...", "info");

          initGmailClient()
              .then(() => authorizeGmail())
              .then(() => checkGmailForTransfer(window.expectedPrice, window.expectedTransferContent))
              .then(found => {
                  // Đóng modal "Đang xử lý" (nếu nó còn mở)
                  const loadingModal = document.getElementById('dynamicBootstrapModal');
                  if(loadingModal && loadingModal.querySelector('.modal-body p').textContent.includes("Đang kiểm tra")) {
                       bootstrap.Modal.getInstance(loadingModal)?.hide();
                  }

                  if (found) {
                      console.log("Xác nhận giao dịch thành công. Gọi update_premium.php...");
                      const selectedPackageRadio = document.querySelector('input[name="package"]:checked');
                      if (!selectedPackageRadio) throw new Error("Không tìm thấy gói đã chọn.");
                      const selectedPackage = selectedPackageRadio.value;
                      const priceMap = { "1": 39000, "3": 69000, "6": 99000, "12": 129000 };
                      const totalPrice = priceMap[selectedPackage];
                      const durationMonths = parseInt(selectedPackage);
                      if (!totalPrice || !durationMonths) throw new Error("Gói hoặc giá không hợp lệ.");

                      return fetch("../src/update_premium.php", {
                          method: "POST", headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ totalPrice, durationMonths })
                      })
                      .then(response => response.json())
                      .then(result => {
                          if (result.success) {
                              console.log("Cập nhật Premium thành công.");
                              showCustomSuccessModal(); // Hiển thị modal thành công riêng
                              updateQuotaDisplay();
                              window.expectedTransferContent = ""; // Reset mã
                          } else {
                              console.error("Lỗi từ update_premium.php:", result.message);
                              // Thay thế showAlert
                              showBootstrapModal("Lỗi Cập Nhật Tài Khoản", "Giao dịch đã được xác nhận, nhưng có lỗi khi cập nhật trạng thái Premium. Vui lòng liên hệ hỗ trợ. Lỗi: " + result.message, "danger");
                          }
                      });
                  } else {
                      console.log("Không tìm thấy giao dịch khớp trong Gmail.");
                       // Thay thế showAlert
                       showBootstrapModal(
                          "Không Tìm Thấy Giao Dịch",
                          "Hiện tại chưa tìm thấy giao dịch chuyển khoản khớp với thông tin bạn cung cấp trong Gmail.<br><br><strong>Lưu ý:</strong><ul><li>Đảm bảo bạn đã chuyển khoản <strong>đúng số tiền</strong> và <strong>chính xác nội dung chuyển khoản</strong>.</li><li>Email xác nhận từ ngân hàng có thể mất vài phút.</li><li>Vui lòng đợi thêm và nhấn 'Tôi đã chuyển khoản' lại.</li></ul>",
                          "warning"
                      );
                  }
              })
              .catch(error => {
                   const loadingModal = document.getElementById('dynamicBootstrapModal');
                   if(loadingModal && loadingModal.querySelector('.modal-body p').textContent.includes("Đang kiểm tra")) {
                        bootstrap.Modal.getInstance(loadingModal)?.hide();
                   }
                   console.error("Lỗi trong chuỗi xử lý thanh toán:", error);
                    // Thay thế showAlert
                   showBootstrapModal("Lỗi Xử Lý Thanh Toán", "Đã xảy ra lỗi trong quá trình kiểm tra thanh toán: " + (error.message || error), "danger");
              });
      });
  }

  // ----- Modal Thông báo Thành công -----
  function showCustomSuccessModal() {
       // (Giữ nguyên hàm này vì nó đã là modal chuyên biệt)
       if (document.getElementById("successModal")) return;
       const modalDiv = document.createElement("div");
       // ... (innerHTML và logic của showCustomSuccessModal giữ nguyên) ...
       modalDiv.className = "modal fade"; modalDiv.id = "successModal"; modalDiv.tabIndex = -1; modalDiv.setAttribute("aria-labelledby", "successModalLabel"); modalDiv.setAttribute("aria-hidden", "true");
       modalDiv.innerHTML = `
         <div class="modal-dialog modal-dialog-centered"> <div class="modal-content border-success shadow"> <div class="modal-header bg-success text-white"> <h5 class="modal-title" id="successModalLabel"><i class="bi bi-check-circle-fill me-2"></i>Thanh toán thành công!</h5> <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button> </div> <div class="modal-body"> <p>Cảm ơn bạn đã đăng ký! Tài khoản của bạn đã được nâng cấp thành Premium.</p> <p>Bạn có thể bắt đầu sử dụng các tính năng nâng cao ngay bây giờ.</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-success" data-bs-dismiss="modal">Tuyệt vời!</button> </div> </div> </div>`;
       document.body.appendChild(modalDiv);
       const successModalEl = document.getElementById("successModal");
       const successModal = new bootstrap.Modal(successModalEl);
       successModal.show();
       successModalEl.addEventListener('hidden.bs.modal', () => modalDiv.remove(), { once: true });
  }


  // ----- Hàm Cập nhật Hiển thị Quota (Ví dụ) -----
  function updateQuotaDisplay() {
      console.log("Cập nhật hiển thị quota...");
      // Thêm logic cập nhật giao diện ở đây nếu cần
  }

  // ----- Khởi chạy -----
  console.log("initApp: Bắt đầu khởi tạo ứng dụng Premium.");
  checkPremiumStatus(); // Kiểm tra khi tải trang

} // Kết thúc hàm initApp

// ----- Load Google API scripts và chạy app -----
function loadScriptsAndInit() {
  console.log("Bắt đầu load Google API scripts...");
  const gapiScript = document.createElement('script');
  gapiScript.src = 'https://apis.google.com/js/api.js';
  gapiScript.async = true; gapiScript.defer = true;
  gapiScript.onload = () => { console.log("Google API script (api.js) đã load."); loadGsiScript(); };
  gapiScript.onerror = () => {
       console.error("Lỗi load gapi script (api.js)");
       // Có thể hiển thị lỗi nghiêm trọng cho người dùng ở đây nếu cần
       document.body.innerHTML = '<div class="alert alert-danger m-5">Lỗi nghiêm trọng: Không thể tải thư viện Google API cần thiết. Vui lòng kiểm tra kết nối mạng và thử lại.</div>';
  };
  document.head.appendChild(gapiScript);
}

function loadGsiScript() {
  const gsiScript = document.createElement('script');
  gsiScript.src = 'https://accounts.google.com/gsi/client';
  gsiScript.async = true; gsiScript.defer = true;
  gsiScript.onload = () => { console.log("Google Sign-In script (gsi/client) đã load."); console.log("Gọi initApp()."); initApp(); };
  gsiScript.onerror = () => {
      console.error("Lỗi load gsi script (gsi/client)");
      document.body.innerHTML = '<div class="alert alert-danger m-5">Lỗi nghiêm trọng: Không thể tải thư viện Google Sign-In cần thiết. Vui lòng kiểm tra kết nối mạng và thử lại.</div>';
  };
  document.head.appendChild(gsiScript);
}

// Chạy hàm load scripts khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", loadScriptsAndInit);