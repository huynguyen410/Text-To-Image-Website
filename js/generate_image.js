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

// Thêm check if cho premiumBtn
const premiumBtn = document.getElementById("premiumBtn");
if(premiumBtn){
    premiumBtn.addEventListener("click", function() {
    console.log("premiumBtn clicked");
    // ...
    });
}

// Thêm biến để lưu dữ liệu model động
let modelDataMap = {}; // Map model_id to { group_id, name }

// Thêm biến để tham chiếu đến container chứa kết quả của các model
const modelResultsContainer = document.getElementById("model-results"); // Đảm bảo thẻ này tồn tại trong HTML

// Store generated images by model
let generatedImages = {}; // Khởi tạo rỗng, sẽ được điền động

if(formatSelect){
    formatSelect.addEventListener("change", handleFormatChange);
}


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

function updateUserQuota() {
  // Sửa đường dẫn thành file update_image_quota.php nằm trong src
  return fetch("update_image_quota.php", { method: "POST" })
    .then(response => response.json())
    .catch(error => {
      showAlert("Không thể cập nhật lượt tạo ảnh. Vui lòng thử lại sau.", "danger");
      return { success: false };
    });
}

const showDefaultImages = () => {
  const defaultContainer = document.querySelector("#default-container");
  if (defaultContainer) { // Kiểm tra xem defaultContainer có tồn tại không
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
  } else {
    console.log("Không tìm thấy phần tử có id 'default-container'"); // Ghi log để dễ debug
  }
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

// Hàm để lấy danh sách model từ backend
const fetchModels = async () => {
  try {
    // Sửa đường dẫn fetch thành đường dẫn tuyệt đối từ gốc web
    const response = await fetch('/Text-To-Image-Website/src/get_models.php');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const models = await response.json();

    modelDataMap = {}; // Reset map
    models.forEach(model => {
      // Tạo group_id an toàn từ model_id hoặc name nếu cần
      // Ví dụ đơn giản: thay thế ký tự không hợp lệ bằng '-' và chuyển thành chữ thường
      // Bạn có thể cần logic phức tạp hơn tùy theo định dạng model_id/name
      const groupId = (model.group_id || model.model_id || model.name)
                        .toLowerCase()
                        .replace(/[^a-z0-9\-_]/g, '-')
                        .replace(/-+/g, '-'); // Đảm bảo group_id hợp lệ cho CSS ID

      modelDataMap[model.model_id] = {
        group_id: groupId,
        name: model.name || model.model_id // Dùng name hoặc model_id nếu name không có
      };
    });
    // console.log("Models loaded:", modelDataMap);
    // Có thể bật lại nút Generate ở đây nếu bạn đã vô hiệu hóa nó ban đầu
    if(generateBtn) generateBtn.disabled = false;

  } catch (error) {
    console.error("Error fetching models:", error);
    showAlert("Không thể tải danh sách model. Một số chức năng có thể không hoạt động.", "danger");
    // Vô hiệu hóa nút Generate nếu không tải được model
    if(generateBtn) generateBtn.disabled = true;
  }
};

// Hàm đảm bảo HTML group cho model tồn tại
const ensureModelGroupExists = (groupId, modelName) => {
  if (!modelResultsContainer) {
      console.error("Container #model-results không tồn tại trong DOM.");
      return false; // Thoát nếu container chính không tồn tại
  }
  const groupElementId = `${groupId}-group`;
  let groupElement = document.getElementById(groupElementId);

  if (!groupElement) {
    // console.log(`Creating group element for ${modelName} with ID: ${groupElementId}`);
    groupElement = document.createElement("div");
    groupElement.className = "model-group";
    groupElement.id = groupElementId;
    groupElement.style.display = "none"; // Ẩn ban đầu

    const titleElement = document.createElement("h3");
    // Sử dụng modelName lấy từ map, hoặc groupId nếu name không có
    titleElement.textContent = `${modelName || groupId} Results`;

    const containerElement = document.createElement("div");
    containerElement.className = "img_container";
    containerElement.id = `${groupId}-container`;

    groupElement.appendChild(titleElement);
    groupElement.appendChild(containerElement);

    // Thêm vào container chính
    modelResultsContainer.appendChild(groupElement);
  }
  return true; // Trả về true nếu group tồn tại hoặc được tạo thành công
};

const generateAiImages = async (prompt, style, quantity, selectedModels) => {
  try {
    generatedImages = {}; // Reset generated images object

    // Khởi tạo mảng rỗng cho các model được chọn
    selectedModels.forEach(modelId => {
       if (modelDataMap[modelId]) { // Chỉ khởi tạo cho model hợp lệ đã load
         generatedImages[modelId] = [];
       }
    });

    // Tạo ảnh tuần tự cho từng model (bạn có thể tối ưu chạy song song nếu muốn)
    for (const modelId of selectedModels) {
        // Bỏ qua nếu model không có trong dữ liệu đã load (phòng trường hợp lỗi)
        if (!modelDataMap[modelId]) {
            console.warn(`Model ${modelId} không có trong dữ liệu đã tải, bỏ qua tạo ảnh.`);
            continue;
        }

      for (let i = 0; i < quantity; i++) {
        const blob = await generateSingleImage(modelId, prompt, style, i); // Truyền i làm variation
        if (blob) {
          const url = URL.createObjectURL(blob);
           // Đảm bảo mảng tồn tại trước khi push
           if (!generatedImages[modelId]) {
               generatedImages[modelId] = [];
           }
          generatedImages[modelId].push({ url, blob });
          updateImageContainer(selectedModels); // Cập nhật UI sau mỗi ảnh

          const blobSize = blob.size / 1024;
          // Cần đảm bảo modelId tồn tại trong DB trước khi lưu lsử
          saveImageToHistory(prompt, style, url, blobSize, modelId);
        } else {
            // Có thể thêm xử lý nếu generateSingleImage trả về null (thất bại)
            console.warn(`Không thể tạo ảnh thứ ${i+1} cho model ${modelId}`);
        }
      }
    }
  } catch (error) {
    showAlert(`Có lỗi xảy ra khi tạo ảnh: ${error.message}`, "danger");
    console.error("Error during image generation process:", error);
  } finally {
    isImageGenerating = false;
    if(generateBtn){
        generateBtn.removeAttribute("disabled");
        generateBtn.innerText = "Generate";
    }
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

const handleImageGeneration = (e) => {
  e.preventDefault();
  // Kiểm tra xem modelData đã load chưa
  if (Object.keys(modelDataMap).length === 0 && generateBtn && generateBtn.disabled) {
       showAlert("Danh sách model chưa được tải xong. Vui lòng đợi hoặc thử tải lại trang.", "warning");
       return;
  }

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
        if(generateBtn){
            generateBtn.removeAttribute("disabled");
            generateBtn.innerText = "Generate";
        }
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

      // Lọc ra các model không hợp lệ (không có trong map đã load)
      const validSelectedModels = selectedModels.filter(modelId => {
          if (!modelDataMap[modelId]) {
              console.warn(`Model được chọn ${modelId} không hợp lệ hoặc chưa được tải. Bỏ qua.`);
              return false;
          }
          return true;
      });

      if (validSelectedModels.length === 0) {
          showAlert("Không có model hợp lệ nào được chọn hoặc danh sách model chưa tải xong.", "warning");
          return; // Dừng nếu không có model hợp lệ nào
      }

      if(generateBtn){
          generateBtn.setAttribute("disabled", true);
          generateBtn.innerText = "Generating";
      }
      isImageGenerating = true;

      // Ẩn container mặc định nếu có
      const defaultImages = document.querySelector("#default-images");
      if (defaultImages) {
        defaultImages.style.display = "none";
      }

      // Hiển thị loader cho các container tương ứng với mô hình được chọn
      validSelectedModels.forEach(modelId => {
        const modelInfo = modelDataMap[modelId];
        // Đảm bảo HTML group tồn tại TRƯỚC KHI tìm kiếm và hiển thị loader
        if (ensureModelGroupExists(modelInfo.group_id, modelInfo.name)) {
            const escapedGroupId = escapeCSSSelector(modelInfo.group_id);
            const group = document.querySelector(`#${escapedGroupId}-group`);
            if (group) {
              group.style.display = "flex"; // Hiển thị group
              const container = group.querySelector(`#${escapedGroupId}-container`);
              if (container) {
                container.innerHTML = '<div class="img_card loading"><img src="../images/loader.svg" alt="Loading"></div>'; // Hiển thị loader
              } else {
                console.warn(`Không tìm thấy container #${escapedGroupId}-container bên trong group #${escapedGroupId}-group`);
              }
            } else {
                 console.warn(`Không tìm thấy group #${escapedGroupId}-group mặc dù ensureModelGroupExists trả về true?`);
            }
        } else {
             console.error(`Không thể tạo hoặc tìm group cho ${modelId}`);
        }

      });

      // Gọi hàm tạo ảnh với danh sách model đã được kiểm tra hợp lệ
      generateAiImages(userPrompt, userStyle, userImgQuantity, validSelectedModels);
    });
  });
};

const updateImageContainer = (selectedModels) => {
  const defaultImages = document.querySelector("#default-images");
  // const modelResults = document.querySelector("#model-results"); // Đã có biến toàn cục modelResultsContainer

  // Ẩn container mặc định nếu có
  if (defaultImages) {
    defaultImages.style.display = "none";
  }

  // Ẩn tất cả các model-group hiện có và xóa nội dung cũ
  if (modelResultsContainer) {
      const allModelGroups = modelResultsContainer.querySelectorAll(".model-group");
      allModelGroups.forEach(group => {
        group.style.display = "none"; // Ẩn group đi
        const container = group.querySelector(".img_container");
        if (container) container.innerHTML = ""; // Xóa nội dung ảnh cũ
      });
  } else {
       console.error("#model-results container not found during update.");
       return; // Không thể tiếp tục nếu container chính không có
  }


  // Hiển thị và cập nhật các container cho các mô hình được chọn *và hợp lệ*
  selectedModels.forEach(modelId => {
     const modelInfo = modelDataMap[modelId];
     // Chỉ xử lý nếu model này có trong dữ liệu đã load
     if (modelInfo) {
         // Đảm bảo HTML group tồn tại trước khi hiển thị
         if (ensureModelGroupExists(modelInfo.group_id, modelInfo.name)) {
            const escapedGroupId = escapeCSSSelector(modelInfo.group_id);
            const group = document.querySelector(`#${escapedGroupId}-group`);

            if (group) {
                group.style.display = "flex"; // Hiển thị group này
                const container = group.querySelector(`#${escapedGroupId}-container`);
                if (container) {
                    container.innerHTML = ""; // Xóa loader hoặc ảnh cũ (nếu có)
                    // Chỉ thêm ảnh nếu có dữ liệu ảnh cho model này
                    if (generatedImages[modelId] && generatedImages[modelId].length > 0) {
                        generatedImages[modelId].forEach((imgObject, index) => {
                            const imgCard = createImageCard(imgObject.url, index);
                            container.appendChild(imgCard);
                        });
                    } else {
                        // Có thể hiển thị thông báo "Chưa có ảnh" nếu muốn
                        // container.innerHTML = "<p>Chưa có ảnh được tạo cho model này.</p>";
                    }
                } else {
                   console.warn(`Không tìm thấy container #${escapedGroupId}-container khi cập nhật ảnh.`);
                }
            } else {
                 console.warn(`Không tìm thấy group #${escapedGroupId}-group khi cập nhật ảnh.`);
            }
         } else {
              console.error(`Không thể tạo/tìm group cho ${modelId} khi cập nhật ảnh.`);
         }
     } else {
         console.warn(`Model ${modelId} không có trong modelDataMap khi cập nhật container.`);
     }
  });
};

if(generateForm){
    generateForm.addEventListener("submit", handleImageGeneration);
}


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

if(showDetailedPromptFormBtn){
    let modalInstance;
    showDetailedPromptFormBtn.addEventListener('click', () => {
      const modalElement = document.getElementById('detailedPromptModal');
      modalElement.inert = false;
      modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    });
}


const resetModal = () => {
  backgroundInput.value = "";
  characterInput.value = "";
  hairstyleInput.value = "";
  skinColorInput.value = "";
};

if(detailedPromptModal){
    detailedPromptModal.addEventListener('hidden.bs.modal', function (event) {
      resetModal();
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    });
}


if(generateFromDetailsBtn){
    generateFromDetailsBtn.addEventListener('click', () => {
      let detailedPrompt = "";
      if (backgroundInput.value) detailedPrompt += `Background: ${backgroundInput.value}, `;
      if (characterInput.value) detailedPrompt += `Character: ${characterInput.value}, `;
      if (hairstyleInput.value) detailedPrompt += `Hairstyle: ${hairstyleInput.value}, `;
      if (skinColorInput.value) detailedPrompt += `Skin Color: ${skinColorInput.value}, `;
      promptInput.value = detailedPrompt;
    });
}


// Đảm bảo các event listener khác (như confirmPremiumBtn) không gây xung đột
document.addEventListener("DOMContentLoaded", () => {
  // Vô hiệu hóa nút Generate ban đầu cho đến khi model được tải
  if(generateBtn) generateBtn.disabled = true;

  showDefaultImages();
  updateQuotaDisplay();
  fetchModels(); // Gọi hàm tải models khi DOM sẵn sàng

  // Các event listener khác có thể đặt ở đây
    const premiumBtn = document.getElementById("premiumBtn");
    if (premiumBtn) {
        premiumBtn.addEventListener("click", function() {
        console.log("premiumBtn clicked");
        // Các xử lý khác...
        });
    } else {
        // console.error("Không tìm thấy phần tử có id 'premiumBtn' trong DOMContentLoaded");
        // Gỡ bỏ lỗi này vì nó có thể không cần thiết nếu trang không có nút premium
    }
});
