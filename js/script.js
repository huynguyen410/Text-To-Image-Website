document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutButton = document.getElementById('logout-button');
    const loginRegisterLink = document.getElementById('login-register-link');
    const logoutLink = document.getElementById('logout-link');
    const usernameDisplay = document.getElementById('username-display');
    const loginRegisterModal = document.getElementById('loginRegisterModal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showLoginFormButton = document.getElementById('show-login-form');
    const showRegisterFormButton = document.getElementById('show-register-form');
    const historyLink = document.getElementById('history-link');

    // Hàm hiển thị form đăng nhập
    const showLoginForm = () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        document.getElementById('loginRegisterModalLabel').textContent = "Login";
    };

    // Hàm hiển thị form đăng ký
    const showRegisterForm = () => {
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
        document.getElementById('loginRegisterModalLabel').textContent = "Register";
    };

    // Hàm ẩn modal
    const hideLoginRegisterModal = () => {
        const modal = bootstrap.Modal.getInstance(loginRegisterModal);
        modal.hide();
    };

    // Hàm hiển thị thông tin người dùng và nút đăng xuất
    const showLogout = (username) => {
        loginRegisterLink.style.display = 'none';
        logoutLink.style.display = 'block';
        historyLink.style.display = 'block';
        usernameDisplay.style.display = 'block';
        usernameDisplay.textContent = `Logged in as: ${username}`;
    };

    // Hàm ẩn thông tin người dùng và nút đăng xuất
    const hideLogout = () => {
        loginRegisterLink.style.display = 'block';
        logoutLink.style.display = 'none';
        historyLink.style.display = 'none';
        usernameDisplay.style.display = 'none';
        usernameDisplay.textContent = '';
    };

    // Hàm hiển thị modal thông báo
    const showNotificationModal = (message, type = 'info', callback = null) => {
        const modalBody = document.getElementById('notificationModalBody');
        const modalTitle = document.getElementById('notificationModalLabel');

        modalBody.innerHTML = message;
        modalTitle.textContent = type === 'success' ? 'Success' : 'Error';

        modalBody.className = 'modal-body';
        if (type === 'success') {
            modalBody.classList.add('text-success');
        } else if (type === 'danger') {
            modalBody.classList.add('text-danger');
        } else if (type === 'warning') {
            modalBody.classList.add('text-warning');
        }

        const modalElement = document.getElementById('notificationModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Nếu có callback, gọi nó sau khi modal đóng
        if (callback) {
            modalElement.addEventListener('hidden.bs.modal', function handler() {
                callback();
                // Xóa sự kiện để tránh gọi lại nhiều lần
                modalElement.removeEventListener('hidden.bs.modal', handler);
            });
        }
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser()
                .then(data => {
                    if (data.success) {
                        hideLogout();
                        localStorage.removeItem('username');
                        showNotificationModal('Logout successfully', 'success', () => {
                            window.location.href = 'index.php'; // Chuyển hướng sau khi modal đóng
                        });
                    } else {
                        hideLogout();
                        showNotificationModal('Logout failed: ' + data.message, 'danger');
                    }
                });
        });
    }

    const checkLoginStatus = async () => {
        const username = localStorage.getItem('username');
        if (username) {
            showLogout(username);
        } else {
            hideLogout();
        }
    };

    checkLoginStatus();

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const email = document.getElementById('register-email').value;
            const data = await registerUser(username, password, email);
            if (data.success) {
                showNotificationModal('Registration successful', 'success');
                hideLoginRegisterModal();
                checkLoginStatus();
            } else {
                hideLoginRegisterModal();
                checkLoginStatus();
                showNotificationModal('Registration failed: ' + data.message, 'danger');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const data = await loginUser(username, password);
            if (data.success) {
                hideLoginRegisterModal();
                localStorage.setItem('username', username);
                showNotificationModal('Login successful', 'success', () => {
                    window.location.reload(); // Reload sau khi modal đóng
                });
            } else {
                hideLoginRegisterModal();
                showNotificationModal('Login failed: ' + data.message, 'danger');
            }
        });
    }

    if (showLoginFormButton) {
        showLoginFormButton.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }

    if (showRegisterFormButton) {
        showRegisterFormButton.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });
    }

    if (loginRegisterModal) {
        loginRegisterModal.addEventListener('show.bs.modal', () => {
            showLoginForm();
        });
    }

    historyLink.addEventListener('click', (e) => {
        e.preventDefault();
        getUserInfo().then(userInfo => {
            if (!userInfo.success) {
                showNotificationModal('You must be logged in to view history.', 'warning');
                return;
            }
            window.location.href = '../src/image_history.php';
        });
    });

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
        const tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
        tooltipTriggerEl.addEventListener('mouseleave', function () {
            tooltip.hide();
        });
    });
});

const registerUser = async (username, password, email) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    const response = await fetch('register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });
    return await response.json();
};

const loginUser = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const response = await fetch('../src/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });
    return await response.json();
};

const logoutUser = async () => {
    const response = await fetch('../src/logout.php');
    return await response.json();
};

const getUserInfo = async () => {
    const response = await fetch("../src/get_user_info.php");
    return await response.json();
};

const loadHistory = async (page = 1) => {
    const limit = parseInt(document.getElementById("historyLimit")?.value) || 10;
    try {
        const response = await fetch(`get_image_history.php?page=${page}&limit=${limit}`);
        const data = await response.json();

        if (data.success) {
            const container = document.getElementById("image-history-container");
            const pagination = document.getElementById("history-pagination");
            container.innerHTML = "";

            // Hiển thị các ảnh nếu có
            if (data.history && data.history.length > 0) {
                data.history.forEach(item => {
                    container.innerHTML += `
                        <div class="col-md-3 mb-3">
                            <div class="card">
                                <img src="${item.image_url}" class="card-img-top" alt="Image">
                                <div class="card-body">
                                    <h5 class="card-title">Prompt: ${item.prompt}</h5>
                                    <p class="card-text">Style: ${item.style}</p>
                                    <p class="card-text">Model: ${item.model}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });

                // Chỉ tạo phân trang nếu có nhiều hơn 1 trang
                if (data.total_pages > 1) {
                    let paginationHTML = `<nav><ul class="pagination justify-content-center">`;
                    if (data.page > 1) {
                        paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${data.page - 1}">Previous</a></li>`;
                    } else {
                        paginationHTML += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
                    }
                    
                    for (let i = 1; i <= data.total_pages; i++) {
                        if (i === data.page) {
                            paginationHTML += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
                        } else {
                            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
                        }
                    }
                    
                    if (data.page < data.total_pages) {
                        paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${data.page + 1}">Next</a></li>`;
                    } else {
                        paginationHTML += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
                    }
                    
                    paginationHTML += `</ul></nav>`;
                    pagination.innerHTML = paginationHTML;

                    // Gắn sự kiện cho các liên kết phân trang
                    document.querySelectorAll("#history-pagination a.page-link").forEach(link => {
                        link.addEventListener('click', function(e) {
                            e.preventDefault();
                            const newPage = parseInt(this.getAttribute("data-page"));
                            loadHistory(newPage);
                        });
                    });
                } else {
                    // Nếu chỉ có 1 trang hoặc không có phân trang, xóa nội dung phân trang
                    pagination.innerHTML = "";
                }
            } else {
                // Nếu không có ảnh, xóa cả container và phân trang
                container.innerHTML = "<p>No images in history.</p>";
                if (pagination) pagination.innerHTML = "";
            }
        } else {
            showNotificationModal('Failed to load image history: ' + data.message, 'danger');
        }
    } catch (error) {
        console.error("Error loading image history:", error);
        showNotificationModal('Error loading image history.', 'danger');
    }
};

document.addEventListener("DOMContentLoaded", function() {
    const historyLimitDropdown = document.getElementById("historyLimit");
    if (historyLimitDropdown) {
        historyLimitDropdown.addEventListener("change", () => {
            loadHistory(1);
        });
    }
});