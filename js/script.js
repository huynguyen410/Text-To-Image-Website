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
        usernameDisplay.style.display = 'block';
        usernameDisplay.textContent = `Logged in as: ${username}`;
    };

    // Hàm ẩn thông tin người dùng và nút đăng xuất
    const hideLogout = () => {
        loginRegisterLink.style.display = 'block';
        logoutLink.style.display = 'none';
        usernameDisplay.style.display = 'none';
        usernameDisplay.textContent = '';
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser()
                .then(data => {
                    if (data.success) {
                        hideLogout();
                        localStorage.removeItem('username');
                        alert('Logout successfully');
                        window.location.href = 'index.php';
                    } else {
                        alert('Logout failed: ' + data.message);
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
                alert('Registration successful');
                hideLoginRegisterModal();
                checkLoginStatus();
            } else {
                alert('Registration failed: ' + data.message);
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
                alert('Login successful');
                hideLoginRegisterModal();
                localStorage.setItem('username', username);
                // Reload trang sau khi đăng nhập thành công
                window.location.reload();
            } else {
                alert('Login failed: ' + data.message);
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
        // get_user_info.php hiện nằm trong js/, từ index.php cần dùng đường dẫn ../js/get_user_info.php
        getUserInfo().then(userInfo => {
            if (!userInfo.success) {
                alert("You must be logged in to view history.");
                return;
            }
            window.location.href = 'image_history.php';
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
    // Giả sử register.php nằm trong project/src
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
    // Giả sử login.php nằm trong src
    const response = await fetch('../src/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });
    return await response.json();
};

const logoutUser = async () => {
    // Giả sử logout.php nằm trong src
    const response = await fetch('../src/logout.php');
    return await response.json();
};

const getUserInfo = async () => {
    // Vì get_user_info.php nằm trong project/js, từ index.php cần dùng đường dẫn: ../js/get_user_info.php
    const response = await fetch("../src/get_user_info.php");
    return await response.json();
};

const loadHistory = async () => {
    try {
        const response = await fetch("get_image_history.php");
        const data = await response.json();

        if (data.success) {
            const history = data.history;
            let historyHTML = "";

            history.forEach(item => {
                historyHTML += `
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

            document.getElementById("image-history-container").innerHTML = historyHTML;
        } else {
            alert("Failed to load image history: " + data.message);
        }
    } catch (error) {
        console.error("Error loading image history:", error);
        alert("Error loading image history.");
    }
}
