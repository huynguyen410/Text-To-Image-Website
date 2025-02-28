const generateForm = document.querySelector(".generate_form");
const generateBtn = document.querySelector(".generate_btn");
let isImageGenerating = false;

// Store generated images by model
let generatedImages = {
    "stabilityai/stable-diffusion-3.5-large": [],
    "black-forest-labs/FLUX.1-dev": [],
    "strangerzonehf/Flux-Midjourney-Mix2-LoRA": []
};

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

    // Ẩn ảnh mặc định (đã ẩn từ handleImageGeneration, nhưng để chắc chắn)
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

// Hàm tạo img_card để tái sử dụng
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

    imgCard.appendChild(imgElement);
    imgCard.appendChild(downloadBtn);
    return imgCard;
};

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

        const userPrompt = document.querySelector(".prompt_input").value;
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

        // Hiển thị loading chỉ cho các mô hình được chọn và bật nhóm mô hình tương ứng
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

// Gọi hàm hiển thị ảnh mặc định khi tải trang
document.addEventListener("DOMContentLoaded", showDefaultImages);
