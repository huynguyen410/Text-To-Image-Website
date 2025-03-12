const generateForm = document.querySelector(".generate_form");
const generateBtn = document.querySelector(".generate_btn");
let isImageGenerating = false;
const promptInput = document.querySelector(".prompt_input"); // Lấy prompt input
const detailedPromptModal = document.getElementById('detailedPromptModal');
const formatSelect = document.querySelector(".format_select"); // Dropdown định dạng ảnh

// Hiển thị/ẩn Detailed Prompt Form
const showDetailedPromptFormBtn = document.getElementById('showDetailedPromptForm');
const detailedPromptForm = document.getElementById('detailedPromptForm');
const backgroundInput = document.getElementById('backgroundInput');
const characterInput = document.getElementById('characterInput');
const hairstyleInput = document.getElementById('hairstyleInput');
const skinColorInput = document.getElementById('skinColorInput');
const generateFromDetailsBtn = document.getElementById('generateFromDetails');

// Store generated images by model
let generatedImages = {
  "stabilityai/stable-diffusion-3.5-large": [],
  "black-forest-labs/FLUX.1-dev": [],
  "strangerzonehf/Flux-Midjourney-Mix2-LoRA": []
};

// Lắng nghe sự thay đổi của dropdown định dạng ảnh
formatSelect.addEventListener("change", handleFormatChange);

function handleFormatChange(e) {
  const newFormat = e.target.value;
  convertImageFormat(newFormat);
  showAlert("Đổi định dạng thành công!", "success");
}

function convertImageFormat(newFormat) {
  // Lấy tất cả các thẻ ảnh trong gallery
  const imageCards = document.querySelectorAll(".img_card");
  imageCards.forEach(card => {
    const imgElement = card.querySelector("img");
    // Nếu ảnh là ảnh mặc định (đường dẫn tương đối), cập nhật phần mở rộng file
    if (imgElement.src.includes("../images/")) {
      imgElement.src = imgElement.src.replace(/\.(jpg|jpeg|png|webp)$/i, `.${newFormat}`);
    }
    // Cập nhật thuộc tính download của nút download
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
    // Cập nhật nội dung thông báo
    toastElement.querySelector(".toast-body").innerText = message;
    // Cập nhật lớp màu theo loại thông báo
    toastElement.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning");
    if (type === "success") {
      toastElement.classList.add("text-bg-success");
    } else if (type === "danger") {
      toastElement.classList.add("text-bg-danger");
    } else {
      toastElement.classList.add("text-bg-warning");
    }
    // Khởi tạo và hiển thị Toast với delay 3000ms
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
  }
}

// Hiển thị 4 ảnh mặc định khi tải trang
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

// Cập nhật container dựa trên các mô hình được chọn
const updateImageContainer = (selectedModels) => {
  const stableDiffusionGroup = document.querySelector("#stable-diffusion-group");
  const flux1Group = document.querySelector("#flux1-group");
  const fluxMidjourneyGroup = document.querySelector("#flux-midjourney-group");
  const defaultImages = document.querySelector("#default-images");

  // Ẩn ảnh mặc định
  defaultImages.style.display = "none";

  // Ẩn tất cả nhóm mô hình trước
  stableDiffusionGroup.style.display = "none";
  flux1Group.style.display = "none";
  fluxMidjourneyGroup.style.display = "none";

  // Xóa nội dung cũ trong container
  document.querySelector("#stable-diffusion-container").innerHTML = "";
  document.querySelector("#flux1-container").innerHTML = "";
  document.querySelector("#flux-midjourney-container").innerHTML = "";

  // Hiển thị chỉ các mô hình được chọn
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

// Hàm tạo img_card để tái sử dụng (bao gồm nút Download và nút Xóa nền)
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

  // Tạo nút Xóa nền (overlay button)
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

// Hàm gọi API xóa nền sử dụng API cục bộ (Flask) với rembg
async function removeBackground(imgElement, btn) {
  btn.disabled = true;
  const originalText = btn.innerText;
  btn.innerText = "Đang xóa nền...";
  try {
    // Lấy blob của ảnh hiện tại
    const responseImage = await fetch(imgElement.src);
    const imageBlob = await responseImage.blob();

    // Tạo FormData và thêm file ảnh
    const formData = new FormData();
    formData.append('image', imageBlob, 'input.png');

    // Gọi API background removal cục bộ
    const response = await fetch('http://localhost:5000/remove-background', {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Background removal error:", errorText);
      throw new Error("Background removal failed");
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
      const errorData = await response.json();
      throw new Error(`Failed to generate image with ${modelId}: ${errorData.error || 'Unknown error'}`);
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
          console.error(`Failed to generate image ${i + 1} for ${MODEL_ID} after ${maxRetries} retries`);
          errorMessages.push(`Model ${MODEL_ID} failed to generate image ${i + 1}`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      generatedImages[MODEL_ID] = imgDataArray;
      console.log(`${MODEL_ID} generated ${imgDataArray.length} images out of ${userImgQuantity}`);
    }

    updateImageContainer(selectedModels);

    if (errorMessages.length > 0) {
      alert(`Some images failed to generate:\n${errorMessages.join('\n')}`);
    }

  } catch (error) {
    alert(`Error: ${error.message}`);
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

  getUserInfo().then(userInfo => {
    if (!userInfo.success) {
      alert("You must be logged in to generate images.");
      return;
    }

    if (isImageGenerating) return;

    // Lấy prompt từ input field
    let userPrompt = promptInput.value;

    const userStyle = document.querySelector(".style_select").value;
    const userImgQuantity = parseInt(document.querySelector(".img_quantity").value);
    const selectedModels = Array.from(document.querySelectorAll('input[name="model"]:checked')).map(cb => cb.value);

    if (selectedModels.length === 0) {
      alert("Please select at least one model.");
      return;
    }

    generateBtn.setAttribute("disabled", true);
    generateBtn.innerText = "Generating";
    isImageGenerating = true;

    // Ẩn ảnh mặc định ngay lập tức
    document.querySelector("#default-images").style.display = "none";

    // Hiển thị loading cho các mô hình được chọn
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

    const response = await fetch("save_image_history.php", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      console.error("Failed to save image to history:", data.message);
    }
  } catch (error) {
    console.error("Error saving image to history:", error);
  }
};

let modalInstance;
// Hiển thị/ẩn Detailed Prompt Form
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

// Gọi hàm hiển thị ảnh mặc định khi tải trang
document.addEventListener("DOMContentLoaded", showDefaultImages);
