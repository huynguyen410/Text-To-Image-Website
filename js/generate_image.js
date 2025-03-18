const generateForm = document.querySelector(".generate_form");
const generateBtn = document.querySelector(".generate_btn");
let isImageGenerating = false;
const promptInput = document.querySelector(".prompt_input");
const detailedPromptModal = document.getElementById('detailedPromptModal');
const formatSelect = document.querySelector(".format_select");

// Elements của Detailed Prompt Modal
const showDetailedPromptFormBtn = document.getElementById('showDetailedPromptForm');
const detailedPromptForm = document.getElementById('detailedPromptForm');
const backgroundInput = document.getElementById('backgroundInput');
const characterInput = document.getElementById('characterInput');
const hairstyleInput = document.getElementById('hairstyleInput');
const skinColorInput = document.getElementById('skinColorInput');
const generateFromDetailsBtn = document.getElementById('generateFromDetails');
const premiumBtn = document.getElementById("premiumBtn");
// console.log("premiumBtn:", premiumBtn);
premiumBtn.addEventListener("click", function() {
  console.log("premiumBtn clicked");
  // ...
});

// Store generated images by model
let generatedImages = {
  "stabilityai/stable-diffusion-3.5-large": [],
  "black-forest-labs/FLUX.1-dev": [],
  "strangerzonehf/Flux-Midjourney-Mix2-LoRA": []
};

formatSelect.addEventListener("change", handleFormatChange);

function handleFormatChange(e) {
  const newFormat = e.target.value;
  convertImageFormat(newFormat);
  showAlert("Đổi định dạng thành công!", "success");
}

function convertImageFormat(newFormat) {
  const imageCards = document.querySelectorAll(".img_card");
  imageCards.forEach(card => {
    const imgElement = card.querySelector("img");
    if (imgElement.src.includes("../images/")) {
      imgElement.src = imgElement.src.replace(/\.(jpg|jpeg|png|webp)$/i, `.${newFormat}`);
    }
    const downloadBtn = card.querySelector(".download_btn");
    if (downloadBtn) {
      let fileName = downloadBtn.download;
      if (!fileName) fileName = `image.${newFormat}`;
      else {
        fileName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, `.${newFormat}`);
      }
      downloadBtn.download = fileName;
    }
  });
}

function showAlert(message, type) {
  const toastElement = document.getElementById("formatToast");
  if (toastElement) {
    toastElement.querySelector(".toast-body").innerText = message;
    toastElement.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning");
    if (type === "success") {
      toastElement.classList.add("text-bg-success");
    } else if (type === "danger") {
      toastElement.classList.add("text-bg-danger");
    } else {
      toastElement.classList.add("text-bg-warning");
    }
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
  }
}

function updateUserQuota() {
  // Sửa đường dẫn thành file update_image_quota.php nằm trong src
  return fetch("update_image_quota.php", { method: "POST" })
    .then(response => response.json())
    .catch(error => {
      showAlert("Không thể cập nhật lượt tạo ảnh. Vui lòng thử lại sau.", "danger");
      return { success: false };
    });
}

function getCurrentUserInfo() {
  // Sửa đường dẫn thành file get_user_info.php nằm trong src
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

const showDefaultImages = () => {
  const defaultContainer = document.querySelector("#default-container");
  defaultContainer.innerHTML = "";
  const defaultImages = [
    "../images/img-1.jpg",
    "../images/img-2.jpg",
    "../images/img-3.jpg",
    "../images/img-4.jpg"
  ];
  defaultImages.forEach((url, index) => {
    const imgCard = createImageCard(url, index);
    defaultContainer.appendChild(imgCard);
  });
};

const createImageCard = (url, index) => {
  const imgCard = document.createElement("div");
  imgCard.classList.add("img_card");

  const imgElement = document.createElement("img");
  imgElement.src = url;

  const downloadBtn = document.createElement("a");
  downloadBtn.classList.add("download_btn");
  downloadBtn.href = url;
  downloadBtn.download = `${new Date().getTime()}_${index}.jpg`;
  downloadBtn.innerHTML = `<img src="../images/download.svg" alt="download icon">`;

  const bgRemoveBtn = document.createElement("button");
  bgRemoveBtn.classList.add("bg-remove-btn");
  bgRemoveBtn.innerText = "Xóa nền";
  bgRemoveBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    removeBackground(imgElement, bgRemoveBtn);
  });

  imgCard.appendChild(imgElement);
  imgCard.appendChild(downloadBtn);
  imgCard.appendChild(bgRemoveBtn);
  return imgCard;
};

async function removeBackground(imgElement, btn) {
  btn.disabled = true;
  const originalText = btn.innerText;
  btn.innerText = "Đang xóa nền...";
  try {
    const responseImage = await fetch(imgElement.src);
    const imageBlob = await responseImage.blob();
    const formData = new FormData();
    formData.append('image', imageBlob, 'input.png');

    const response = await fetch('http://localhost:5000/remove-background', {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      console.error("Lỗi xóa nền");
      throw new Error("Xóa nền thất bại");
    }
    const resultBlob = await response.blob();
    const newUrl = URL.createObjectURL(resultBlob);
    imgElement.src = newUrl;
    showAlert("Xóa nền thành công!", "success");
    btn.innerText = "Đã xóa nền";
  } catch (error) {
    console.error(error);
    showAlert("Xóa nền thất bại", "danger");
    btn.innerText = originalText;
  }
  btn.disabled = false;
}

const generateSingleImage = async (modelId, prompt, style, variation = 0, maxRetries = 3) => {
  // console.log(`Generating image for ${modelId} (variation ${variation})...`);
  let retries = 0;
  let blob = null;

  // Thêm biến thể vào prompt
  const variationPrompt = `${prompt} (variation ${variation})`;
  const fullPrompt = style ? `${variationPrompt}, ${style} style` : variationPrompt;

  while (retries < maxRetries && !blob) {
    try {
      const response = await fetch("generate_image.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          style: style,
          modelId: modelId,
          quantity: 1
        }),
      });

      const data = await response.json();

      if (data.success && data.image) {
        const byteCharacters = atob(data.image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        blob = new Blob([byteArray], { type: "image/jpeg" });
      } else {
        throw new Error(data.error || `Không thể tạo ảnh cho model ${modelId}`);
      }
    } catch (error) {
      retries++;
      console.error(`Thử lại (${retries}/${maxRetries}) cho ${modelId}: ${error.message}`);
      if (retries === maxRetries) {
        showAlert(`Không thể tạo ảnh cho model ${modelId} sau ${maxRetries} lần thử`, "danger");
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return blob;
};

const generateAiImages = async (prompt, style, quantity, selectedModels) => {
  try {
    generatedImages = {};
    selectedModels.forEach(model => {
      generatedImages[model] = [];
    });

    for (const model of selectedModels) {
      for (let i = 0; i < quantity; i++) {
        const blob = await generateSingleImage(model, prompt, style, i); // Truyền i làm variation
        if (blob) {
          const url = URL.createObjectURL(blob);
          generatedImages[model].push({ url, blob });
          updateImageContainer(selectedModels);

          const blobSize = blob.size / 1024;
          saveImageToHistory(prompt, style, url, blobSize, model);
        }
      }
    }
  } catch (error) {
    showAlert("Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại sau.", "danger");
  } finally {
    isImageGenerating = false;
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
  }
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(URL.createObjectURL(new Blob([`
      self.onmessage = function(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
          self.postMessage(e.target.result.split(',')[1]);
        };
        fileReader.onerror = function(error) {
          self.postMessage(null);
        };
        fileReader.readAsDataURL(event.data);
      };
    `], { type: 'text/javascript' })));
    worker.onmessage = function (event) {
      const base64String = event.data;
      resolve(base64String);
      worker.terminate();
    };
    worker.onerror = function (error) {
      reject(error);
      worker.terminate();
    };
    worker.postMessage(blob);
  });
};

// Hàm hỗ trợ để thoát ký tự đặc biệt trong CSS selector
const escapeCSSSelector = (id) => {
  return id.replace(/([:./[\]])/g, '\\$1');
};

// Ánh xạ từ model_id sang group_id (dựa trên models.name)
const modelIdToGroupId = {
  "stabilityai/stable-diffusion-3.5-large": "stable-diffusion-3.5",
  "black-forest-labs/FLUX.1-dev": "flux1",
  "strangerzonehf/Flux-Midjourney-Mix2-LoRA": "flux-midjourney"
};

const handleImageGeneration = (e) => {
  e.preventDefault();
  getCurrentUserInfo().then(userInfo => {
    if (!userInfo.success) {
      showAlert("Bạn phải đăng nhập để tạo ảnh.", "danger");
      return;
    }
    if (userInfo.user.image_quota <= 0) {
      showAlert("Hết lượt tạo ảnh", "danger");
      return;
    }
    updateUserQuota().then(result => {
      if (!result.success) {
        showAlert("Không thể cập nhật lượt tạo ảnh. Vui lòng thử lại sau.", "danger");
        generateBtn.removeAttribute("disabled");
        generateBtn.innerText = "Generate";
        return;
      }
      updateQuotaDisplay();
      const userPrompt = promptInput.value;
      const userStyle = document.querySelector(".style_select").value;
      const userImgQuantity = parseInt(document.querySelector(".img_quantity").value);
      const selectedModels = Array.from(document.querySelectorAll('input[name="model[]"]:checked')).map(cb => cb.value);
      if (selectedModels.length === 0) {
        showAlert("Vui lòng chọn ít nhất 1 mô hình.", "warning");
        return;
      }
      generateBtn.setAttribute("disabled", true);
      generateBtn.innerText = "Generating";
      isImageGenerating = true;

      // Debug: Log các checkbox để kiểm tra
      // console.log("Checkbox được chọn:", document.querySelectorAll('input[name="model[]"]:checked'));

      // Ẩn container mặc định nếu có
      const defaultImages = document.querySelector("#default-images");
      if (defaultImages) {
        defaultImages.style.display = "none";
      }

      // Hiển thị loader cho các container tương ứng với mô hình được chọn
      selectedModels.forEach(modelId => {
        const groupId = modelIdToGroupId[modelId]; // Lấy group_id từ ánh xạ
        const escapedGroupId = escapeCSSSelector(groupId); // Thoát ký tự đặc biệt
        const group = document.querySelector(`#${escapedGroupId}-group`);
        if (group) {
          group.style.display = "flex";
          const container = document.querySelector(`#${escapedGroupId}-container`);
          if (container) {
            container.innerHTML = '<div class="img_card loading"><img src="../images/loader.svg" alt="Loading"></div>';
          } else {
            console.warn(`Không tìm thấy container với ID: #${escapedGroupId}-container`);
          }
        } else {
          // console.warn(`Không tìm thấy nhóm với ID: #${escapedGroupId}-group`);
          // console.log("Các nhóm hiện có trong DOM:", document.querySelectorAll(".model-group"));
        }
      });

      // Gọi hàm tạo ảnh
      generateAiImages(userPrompt, userStyle, userImgQuantity, selectedModels);
    });
  });
};

const updateImageContainer = (selectedModels) => {
  const defaultImages = document.querySelector("#default-images");
  const modelResults = document.querySelector("#model-results");

  // Ẩn container mặc định nếu có
  if (defaultImages) {
    defaultImages.style.display = "none";
  }

  // Duyệt qua tất cả các model-group hiện có và ẩn chúng
  const allModelGroups = document.querySelectorAll(".model-group");
  allModelGroups.forEach(group => {
    group.style.display = "none";
    const container = group.querySelector(".img_container");
    if (container) container.innerHTML = ""; // Xóa nội dung cũ
  });

  // Hiển thị và cập nhật các container cho các mô hình được chọn
  selectedModels.forEach(modelId => {
    const groupId = modelIdToGroupId[modelId]; // Lấy group_id từ ánh xạ
    const escapedGroupId = escapeCSSSelector(groupId); // Thoát ký tự đặc biệt
    const group = document.querySelector(`#${escapedGroupId}-group`);
    
    if (group) {
      group.style.display = "flex"; // Hiển thị container
      const container = document.querySelector(`#${escapedGroupId}-container`);
      if (container) {
        container.innerHTML = ""; // Xóa nội dung cũ
        generatedImages[modelId].forEach((imgObject, index) => {
          const imgCard = createImageCard(imgObject.url, index);
          container.appendChild(imgCard);
        });
      } else {
        console.warn(`Không tìm thấy container với ID: #${escapedGroupId}-container`);
      }
    } else {
      console.warn(`Không tìm thấy nhóm với ID: #${escapedGroupId}-group`);
    }
  });
};

generateForm.addEventListener("submit", handleImageGeneration);

const saveImageToHistory = async (prompt, style, imageUrl, blobSize, modelId) => {
  try {
    // Chuyển blob URL thành base64
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Không thể lấy blob: ${response.status}`);
    }
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    const base64Promise = new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result);
    });
    const imageData = await base64Promise;

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('style', style);
    formData.append('image_data', imageData);
    formData.append('blob_size', blobSize);
    formData.append('model_id', modelId);

    // console.log('Dữ liệu gửi đi:', { prompt, style, imageData: imageData.slice(0, 50) + '...', blobSize, modelId });

    const responseFetch = await fetch("save_image_history.php", {
      method: "POST",
      body: formData,
    });

    if (!responseFetch.ok) {
      const text = await responseFetch.text();
      throw new Error(`HTTP error! Status: ${responseFetch.status}, Response: ${text}`);
    }

    let data;
    try {
      data = await responseFetch.json();
    } catch (jsonError) {
      const text = await responseFetch.text(); // Đọc lại text nếu JSON thất bại
      console.error('Phản hồi không phải JSON:', text);
      throw new Error(`Phản hồi không phải JSON: ${text.slice(0, 100)}...`);
    }
  } catch (error) {
    console.error("Error saving image history:", error.message);
    showAlert(`Lỗi khi lưu lịch sử ảnh: ${error.message}`, "danger");
  }
};

let modalInstance;
showDetailedPromptFormBtn.addEventListener('click', () => {
  const modalElement = document.getElementById('detailedPromptModal');
  modalElement.inert = false;
  modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
});

const resetModal = () => {
  backgroundInput.value = "";
  characterInput.value = "";
  hairstyleInput.value = "";
  skinColorInput.value = "";
};

detailedPromptModal.addEventListener('hidden.bs.modal', function (event) {
  resetModal();
  document.body.classList.remove('modal-open');
  document.body.style.overflow = 'auto';
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
});

generateFromDetailsBtn.addEventListener('click', () => {
  let detailedPrompt = "";
  if (backgroundInput.value) detailedPrompt += `Background: ${backgroundInput.value}, `;
  if (characterInput.value) detailedPrompt += `Character: ${characterInput.value}, `;
  if (hairstyleInput.value) detailedPrompt += `Hairstyle: ${hairstyleInput.value}, `;
  if (skinColorInput.value) detailedPrompt += `Skin Color: ${skinColorInput.value}, `;
  promptInput.value = detailedPrompt;
});

// Đảm bảo các event listener khác (như confirmPremiumBtn) không gây xung đột
document.addEventListener("DOMContentLoaded", () => {
  showDefaultImages();
  updateQuotaDisplay();
});
document.addEventListener('DOMContentLoaded', () => {
  const premiumBtn = document.getElementById("premiumBtn");
  // console.log("premiumBtn:", premiumBtn);
  if (premiumBtn) {
    premiumBtn.addEventListener("click", function() {
      console.log("premiumBtn clicked");
      // Các xử lý khác...
    });
  } else {
    console.error("Không tìm thấy phần tử có id 'premiumBtn'");
  }
});
