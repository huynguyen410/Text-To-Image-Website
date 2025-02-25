const historyLink = document.getElementById('history-link');
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

// Hàm hiển thị form đăng nhập
const showLoginForm = () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    document.getElementById('loginRegisterModalLabel').textContent = "Login"; // Cập nhật tiêu đề modal
};

// Hàm hiển thị form đăng ký
const showRegisterForm = () => {
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
    document.getElementById('loginRegisterModalLabel').textContent = "Register"; // Cập nhật tiêu đề modal
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

// Xử lý sự kiện click trên liên kết "History"
historyLink.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn chuyển hướng trang
    // Gọi hàm để hiển thị lịch sử hình ảnh
    showImageHistory();
});

const showImageHistory = async () => {
    try {
        const response = await fetch("get_image_history.php");
        const data = await response.json();

        if (data.success) {
            const history = data.history;
            let historyHTML = "<h2>Image History</h2><ul>";

            history.forEach(item => {
                historyHTML += `<li>
                                    <p>Prompt: ${item.prompt}</p>
                                    <p>Style: ${item.style}</p>
                                    <img src="${item.image_url}" width="200">
                                 </li>`; //Sửa
            });

            historyHTML += "</ul>";
            imageGallery.innerHTML = historyHTML; // Hiển thị lịch sử trong img_gallery
        } else {
            alert("Failed to load image history: " + data.message);
        }
    } catch (error) {
        console.error("Error loading image history:", error);
        alert("Error loading image history.");
    }
};

// Xử lý sự kiện click trên nút "Logout"
logoutButton.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn chuyển hướng trang
    // Thêm code để gọi API đăng xuất ở đây
    logoutUser()
        .then(data => {
            if (data.success) {
                hideLogout();
                // Xóa thông tin đăng nhập khỏi Local Storage
                localStorage.removeItem('username');
                checkLoginStatus();
                alert('Logout successful');
            } else {
                alert('Logout failed: ' + data.message);
            }
        });
});

// Hàm kiểm tra trạng thái đăng nhập (ví dụ)
const checkLoginStatus = async () => {
    const username = localStorage.getItem('username');
    if (username) {
        showLogout(username);
    } else {
        hideLogout();
    }
};

// Gọi hàm kiểm tra trạng thái đăng nhập khi trang được tải
checkLoginStatus();

// Thêm code để xử lý submit form đăng ký
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn chặn submit mặc định

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

// Thêm code để xử lý submit form đăng nhập
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn chặn submit mặc định

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const data = await loginUser(username, password);

    if (data.success) {
        alert('Login successful');
        hideLoginRegisterModal();
        // Lưu thông tin đăng nhập vào Local Storage
        localStorage.setItem('username', username);
        checkLoginStatus();

    } else {
        alert('Login failed: ' + data.message);
    }
});

// Xử lý sự kiện click trên nút "Show Login Form"
showLoginFormButton.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

// Xử lý sự kiện click trên nút "Show Register Form"
showRegisterFormButton.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

// Hiển thị form đăng nhập khi modal được hiển thị
loginRegisterModal.addEventListener('show.bs.modal', () => {
   showLoginForm();
});

// Các hàm gọi API (thêm vào file script.js)
const registerUser = async (username, password, email) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email); // Gửi email (nếu có)

    const response = await fetch('register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });
    const data = await response.json();
    return data;
};

const loginUser = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch('login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });
    const data = await response.json();
    return data;
};

const logoutUser = async () => {
    const response = await fetch('logout.php');
    const data = await response.json();
    return data;
};

const getUserInfo = async () => {
    const response = await fetch('get_user_info.php');
    const data = await response.json();
    return data;
};