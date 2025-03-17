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
console.log("premiumBtn:", premiumBtn);
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

const updateImageContainer = (selectedModels) => {
  const stableDiffusionGroup = document.querySelector("#stable-diffusion-group");
  const flux1Group = document.querySelector("#flux1-group");
  const fluxMidjourneyGroup = document.querySelector("#flux-midjourney-group");
  const defaultImages = document.querySelector("#default-images");

  defaultImages.style.display = "none";
  stableDiffusionGroup.style.display = "none";
  flux1Group.style.display = "none";
  fluxMidjourneyGroup.style.display = "none";

  document.querySelector("#stable-diffusion-container").innerHTML = "";
  document.querySelector("#flux1-container").innerHTML = "";
  document.querySelector("#flux-midjourney-container").innerHTML = "";

  selectedModels.forEach(modelId => {
    if (modelId === "stabilityai/stable-diffusion-3.5-large") {
      stableDiffusionGroup.style.display = "flex";
      generatedImages[modelId].forEach((imgObject, index) => {
        const imgCard = createImageCard(imgObject.url, index);
        document.querySelector("#stable-diffusion-container").appendChild(imgCard);
      });
    } else if (modelId === "black-forest-labs/FLUX.1-dev") {
      flux1Group.style.display = "flex";
      generatedImages[modelId].forEach((imgObject, index) => {
        const imgCard = createImageCard(imgObject.url, index);
        document.querySelector("#flux1-container").appendChild(imgCard);
      });
    } else if (modelId === "strangerzonehf/Flux-Midjourney-Mix2-LoRA") {
      fluxMidjourneyGroup.style.display = "flex";
      generatedImages[modelId].forEach((imgObject, index) => {
        const imgCard = createImageCard(imgObject.url, index);
        document.querySelector("#flux-midjourney-container").appendChild(imgCard);
      });
    }
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

const generateSingleImage = async (modelId, userPrompt, userStyle, apiToken) => {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        inputs: `${userPrompt}, ${userStyle}`,
        options: {
          wait_for_model: true,
          use_cache: false
        },
      }),
    });
    if (!response.ok) {
      throw new Error(`Không thể tạo ảnh cho model ${modelId}`);
    }
    return await response.blob();
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const generateAiImages = async (userPrompt, userStyle, userImgQuantity, selectedModels) => {
  try {
    const HUGGINGFACE_API_TOKEN = "";
    let errorMessages = [];
    Object.keys(generatedImages).forEach(model => generatedImages[model] = []);

    for (const MODEL_ID of selectedModels) {
      const imgDataArray = [];
      console.log(`Generating ${userImgQuantity} images for ${MODEL_ID}...`);
      for (let i = 0; i < userImgQuantity; i++) {
        let blob = null;
        let retries = 0;
        const maxRetries = 3;
        while (blob === null && retries < maxRetries) {
          blob = await generateSingleImage(MODEL_ID, userPrompt, userStyle, HUGGINGFACE_API_TOKEN);
          if (blob === null) {
            retries++;
            console.warn(`Retry ${retries}/${maxRetries} for image ${i + 1} of ${MODEL_ID}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        if (blob) {
          const b64_json = await blobToBase64(blob);
          const url = URL.createObjectURL(blob);
          imgDataArray.push({ url });
          saveImageToHistory(userPrompt, userStyle, b64_json, blob.size, MODEL_ID);
        } else {
          console.error(`Không thể tạo ảnh cho model ${MODEL_ID}`);
          errorMessages.push(`Model ${MODEL_ID} không thể tạo ảnh`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      generatedImages[MODEL_ID] = imgDataArray;
      console.log(`${MODEL_ID} generated ${imgDataArray.length} images`);
    }
    updateImageContainer(selectedModels);
    if (errorMessages.length > 0) {
      showAlert(`Một số ảnh không được tạo: ${errorMessages.join('; ')}`, "danger");
    }
  } catch (error) {
    showAlert("Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại sau.", "danger");
  } finally {
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
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
      const selectedModels = Array.from(document.querySelectorAll('input[name="model"]:checked')).map(cb => cb.value);
      if (selectedModels.length === 0) {
        showAlert("Vui lòng chọn ít nhất 1 mô hình.", "warning");
        return;
      }
      generateBtn.setAttribute("disabled", true);
      generateBtn.innerText = "Generating";
      isImageGenerating = true;
      document.querySelector("#default-images").style.display = "none";
      selectedModels.forEach(modelId => {
        if (modelId === "stabilityai/stable-diffusion-3.5-large") {
          const group = document.querySelector("#stable-diffusion-group");
          group.style.display = "flex";
          document.querySelector("#stable-diffusion-container").innerHTML = '<div class="img_card loading"><img src="../images/loader.svg" alt="Loading"></div>';
        } else if (modelId === "black-forest-labs/FLUX.1-dev") {
          const group = document.querySelector("#flux1-group");
          group.style.display = "flex";
          document.querySelector("#flux1-container").innerHTML = '<div class="img_card loading"><img src="../images/loader.svg" alt="Loading"></div>';
        } else if (modelId === "strangerzonehf/Flux-Midjourney-Mix2-LoRA") {
          const group = document.querySelector("#flux-midjourney-group");
          group.style.display = "flex";
          document.querySelector("#flux-midjourney-container").innerHTML = '<div class="img_card loading"><img src="../images/loader.svg" alt="Loading"></div>';
        }
      });
      generateAiImages(userPrompt, userStyle, userImgQuantity, selectedModels);
    });
  });
};

generateForm.addEventListener("submit", handleImageGeneration);

const saveImageToHistory = async (prompt, style, image_data, blobSize, modelId) => {
  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('style', style);
    formData.append('image_data', image_data);
    formData.append('blob_size', blobSize);
    formData.append('model_id', modelId);
    // Giả sử file save_image_history.php nằm trong project/src (cùng với index.html)
    const response = await fetch("save_image_history.php", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!data.success) {
      console.error("Lưu lịch sử ảnh thất bại");
    }
  } catch (error) {
    console.error("Error saving image history:", error);
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
