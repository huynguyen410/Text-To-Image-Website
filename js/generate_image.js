// Phần tạo ảnh
const generateForm = document.querySelector(".generate_form");
const generateBtn = document.querySelector(".generate_btn");
const imageGallery = document.querySelector(".img_gallery");
let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img_card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download_btn");

        // Sử dụng URL.createObjectURL thay vì base64
        const aiGeneratedImage = URL.createObjectURL(new Blob([new Uint8Array(atob(imgObject.b64_json).split("").map(char => char.charCodeAt(0)))], { type: 'image/jpeg' }));
        imgElement.src = aiGeneratedImage;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImage);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userStyle, userImgQuantity) => { //Thêm userStyle
    try {
        const HUGGINGFACE_API_TOKEN = "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"; // Thay thế bằng token của bạn
        const MODEL_ID = "stabilityai/stable-diffusion-3.5-large"; // Thay thế bằng model ID bạn chọn

        // Tạo các promise cho tất cả các ảnh (bao gồm cả ảnh đầu tiên)
        const imagePromises = [];
        for (let i = 0; i < userImgQuantity; i++) {
            imagePromises.push(
                fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
                    },
                    body: JSON.stringify({
                        inputs: `${userPrompt}, ${userStyle}`, // Kết hợp prompt và style
                        options: {
                            wait_for_model: true,
                            use_cache: false
                        },
                    }),
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(errorData => {
                                throw new Error(`Failed to generate image: ${errorData.error}`);
                            });
                        }
                        return response.blob();
                    })
                    .catch(error => {
                        console.error(error);
                        return null; // Trả về null cho ảnh bị lỗi
                    })
            );
        }

        // Chờ tất cả các promise hoàn thành
        const imageBlobs = await Promise.all(imagePromises);

        // Lọc bỏ các ảnh bị lỗi (có giá trị null)
        const validImageBlobs = imageBlobs.filter(blob => blob !== null);

        // Chuyển đổi các blob hợp lệ sang base64 và lưu vào lịch sử
        const imgDataArray = await Promise.all(validImageBlobs.map(async (blob) => {
            const b64_json = await blobToBase64(blob);
            // console.log("Data trước khi gửi:", b64_json); 
            saveImageToHistory(userPrompt, userStyle, b64_json, blob.size); // Pass blob size
            return { b64_json: b64_json };
        }));


        updateImageCard(imgDataArray);

    } catch (error) {
        alert(error.message);
    } finally {
        generateBtn.removeAttribute("disabled");
        generateBtn.innerText = "Generate";
        isImageGenerating = false;
    }
};

// Hàm chuyển đổi blob sang base64 (cần thiết để hiển thị ảnh)
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(URL.createObjectURL(new Blob([`
          self.onmessage = function(event) {
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
              self.postMessage(e.target.result.split(',')[1]);
            };
            fileReader.onerror = function(error) { // Thêm xử lý lỗi
              self.postMessage(null);
            };
            fileReader.readAsDataURL(event.data);
          };
        `], { type: 'text/javascript' })));

        worker.onmessage = function (event) {
            const base64String = event.data;
            // console.log("Base64 String:", base64String); 
            resolve(base64String);
            worker.terminate(); // Giải phóng worker sau khi sử dụng
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
   
    // Kiểm tra trạng thái đăng nhập
    getUserInfo().then(userInfo => {
        if (!userInfo.success) {
            alert("You must be logged in to generate images.");
            return; // Không tạo ảnh nếu chưa đăng nhập
        }

     if (isImageGenerating) return;
    // Get user input and image quantity values
    const userPrompt = document.querySelector(".prompt_input").value; // Sửa đổi cách lấy prompt
    const userStyle = document.querySelector(".style_select").value; // Lấy style từ select
    const userImgQuantity = parseInt(document.querySelector(".img_quantity").value); // Lấy số lượng ảnh từ select

    // Disable the generate button, update its text, and set the flag
    generateBtn.setAttribute("disabled", true);
    generateBtn.innerText = "Generating";
    isImageGenerating = true;

    // Lấy các thẻ img_card hiện có hoặc tạo mới nếu không đủ
    let imgCards = imageGallery.querySelectorAll(".img_card");
    if (imgCards.length < userImgQuantity) {
        const additionalCards = Array.from({ length: userImgQuantity - imgCards.length }, () =>
            `<div class="img_card loading">
            <img src="../images/loader.svg" alt="AI generated image">
            <a class="download_btn" href="#">
              <img src="../images/download.svg" alt="download icon">
            </a>
          </div>`
        ).join("");
        imageGallery.innerHTML += additionalCards;
        imgCards = imageGallery.querySelectorAll(".img_card");
    } else if (imgCards.length > userImgQuantity) {
        // Xóa các thẻ thừa
        for (let i = userImgQuantity; i < imgCards.length; i++) {
            imgCards[i].remove();
        }
        imgCards = imageGallery.querySelectorAll(".img_card");
    }

    // Đặt trạng thái loading cho tất cả các thẻ
    imgCards.forEach(card => {
        card.classList.add("loading");
        const img = card.querySelector("img");
        img.src = "../images/loader.svg"; //Sửa lại đường dẫn
    });

    generateAiImages(userPrompt, userStyle, userImgQuantity); //Gọi hàm tạo ảnh
});
}

generateForm.addEventListener("submit", handleImageGeneration);

const saveImageToHistory = async (prompt, style, image_data, blobSize) => { // Get blob size
    try {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('style', style);
        formData.append('image_data', image_data);
        formData.append('blob_size', blobSize); // Append blob size

        const response = await fetch("save_image_history.php", {
            method: "POST",
            body: formData, // Don't set Content-Type
        });

        const data = await response.json();
        if (!data.success) {
            console.error("Failed to save image to history:", data.message);
        }
    } catch (error) {
        console.error("Error saving image to history:", error);
    }
};