
function showAlert(message, type) {
    const toastElement = document.getElementById("formatToast");
    if (toastElement) {
        toastElement.querySelector(".toast-body").innerText = message;
        toastElement.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning");
        if (type === "success") toastElement.classList.add("text-bg-success");
        else if (type === "danger") toastElement.classList.add("text-bg-danger");
        else toastElement.classList.add("text-bg-warning");
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();
    }
}

function getCurrentUserInfo() {
    return fetch("get_user_info.php")
        .then(response => response.json())
        .catch(error => {
            showAlert("Không thể lấy thông tin người dùng.", "danger");
            return { success: false };
        });
}

function updateQuotaDisplay() {
    const quotaItem = document.getElementById("quota-item");
    const userQuotaSpan = document.getElementById("userQuota");
    const premiumItem = document.getElementById("premium-item");

    if (quotaItem && userQuotaSpan && premiumItem) {
        getCurrentUserInfo().then(userInfo => {
            if (userInfo.success) {
                quotaItem.style.display = "block";
                userQuotaSpan.innerText = userInfo.user.image_quota;
                premiumItem.style.display = "block";
            } else {
                quotaItem.style.display = "none";
                premiumItem.style.display = "block";
                userQuotaSpan.innerText = "0";
            }
        });
    }
}