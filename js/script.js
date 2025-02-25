// const generateForm = document.querySelector(".generate_form");
// const generateBtn = generateForm.querySelector(".generate_btn");
// const imageGallery = document.querySelector(".img_gallery");
// let isImageGenerating = false;

// const updateImageCard = (imgDataArray) => {
//   imgDataArray.forEach((imgObject, index) => {
//     const imgCard = imageGallery.querySelectorAll(".img_card")[index];
//     const imgElement = imgCard.querySelector("img");
//     const downloadBtn = imgCard.querySelector(".download_btn");
    
//     // Set the image source to the AI-generated image data
//     const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
//     imgElement.src = aiGeneratedImage;
    
//     // When the image is loaded, remove the loading class and set download attributes
//     imgElement.onload = () => {
//       imgCard.classList.remove("loading");
//       downloadBtn.setAttribute("href", aiGeneratedImage);
//       downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
//     }
//   });
// }

// // const generateAiImages = async (userPrompt, userImgQuantity) => {
// //   try {
// //     // Send a request to the OpenAI API to generate images based on user inputs
// //     const response = await fetch("https://api.openai.com/v1/images/generations", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         "Authorization": `Bearer ${OPENAI_API_KEY}`,
// //       },
// //       body: JSON.stringify({
// //         prompt: userPrompt,
// //         n: userImgQuantity,
// //         size: "1024x1024",
// //         response_format: "b64_json"
// //       }),
// //     });

// //     // Throw an error message if the API response is unsuccessful
// //     if(!response.ok) throw new Error("Failed to generate AI images. Make sure your API key is valid.");

// //     const { data } = await response.json(); // Get data from the response
// //     updateImageCard([...data]);
// //   } catch (error) {
// //     alert(error.message);
// //   } finally {
// //     generateBtn.removeAttribute("disabled");
// //     generateBtn.innerText = "Generate";
// //     isImageGenerating = false;
// //   }
// // }

// const generateAiImages = async (userPrompt, userImgQuantity) => {
//   try {
//     const HUGGINGFACE_API_TOKEN = ""; // Thay thế bằng token của bạn
//     const MODEL_ID = "stabilityai/stable-diffusion-3.5-large"; // Thay thế bằng model ID bạn chọn

//     const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
//       },
//       body: JSON.stringify({
//         inputs: userPrompt,
//         options: {
//           wait_for_model: true,  // Đảm bảo model được tải trước khi tạo ảnh
//           use_cache: false      // Tắt cache để đảm bảo ảnh mới
//         },
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`Failed to generate AI images: ${errorData.error}`);
//     }

//     // Hugging Face API trả về một blob (binary data) của ảnh
//     const imageBlob = await response.blob();
//     const imageURL = URL.createObjectURL(imageBlob); // Tạo URL từ blob

//     // Cập nhật image card với ảnh vừa tạo
//     const imgDataArray = [{ b64_json: await blobToBase64(imageBlob) }]; // Chuyển blob sang base64

//     // Tạo nhiều ảnh bằng cách gọi API nhiều lần (nếu userImgQuantity > 1)
//     if (userImgQuantity > 1) {
//         const additionalImages = [];
//         for (let i = 1; i < userImgQuantity; i++) {
//             const additionalResponse = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
//                 },
//                 body: JSON.stringify({
//                     inputs: userPrompt,
//                     options: {
//                         wait_for_model: true,
//                         use_cache: false
//                     },
//                 }),
//             });

//             if (!additionalResponse.ok) {
//                 const errorData = await additionalResponse.json();
//                 console.error(`Failed to generate additional image: ${errorData.error}`);
//                 continue; // Tiếp tục tạo các ảnh khác nếu một ảnh bị lỗi
//             }

//             const additionalImageBlob = await additionalResponse.blob();
//             additionalImages.push({ b64_json: await blobToBase64(additionalImageBlob) });
//         }
//         imgDataArray.push(...additionalImages); // Thêm các ảnh bổ sung vào mảng
//     }

//     updateImageCard(imgDataArray);

//   } catch (error) {
//     alert(error.message);
//   } finally {
//     generateBtn.removeAttribute("disabled");
//     generateBtn.innerText = "Generate";
//     isImageGenerating = false;
//   }
// };

// // Hàm chuyển đổi blob sang base64 (cần thiết để hiển thị ảnh)
// const blobToBase64 = (blob) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result.split(',')[1]); // Lấy phần data sau "data:image/png;base64,"
//     reader.onerror = reject;
//     reader.readAsDataURL(blob);
//   });
// };

// const handleImageGeneration = (e) => {
//   e.preventDefault();
//   if(isImageGenerating) return;

//   // Get user input and image quantity values
//   const userPrompt = e.srcElement[0].value;
//   const userImgQuantity = parseInt(e.srcElement[1].value);
  
//   // Disable the generate button, update its text, and set the flag
//   generateBtn.setAttribute("disabled", true);
//   generateBtn.innerText = "Generating";
//   isImageGenerating = true;
  
//   // Creating HTML markup for image cards with loading state
//   const imgCardMarkup = Array.from({ length: userImgQuantity }, () => 
//       `<div class="img_card loading">
//         <img src="images/loader.svg" alt="AI generated image">
//         <a class="download_btn" href="#">
//           <img src="images/download.svg" alt="download icon">
//         </a>
//       </div>`
//   ).join("");

//   imageGallery.innerHTML = imgCardMarkup;
//   generateAiImages(userPrompt, userImgQuantity);
// }

// generateForm.addEventListener("submit", handleImageGeneration);


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

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const HUGGINGFACE_API_TOKEN = ""; // Thay thế bằng token của bạn
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
                        inputs: userPrompt,
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

        // Chuyển đổi các blob hợp lệ sang base64
        const imgDataArray = await Promise.all(validImageBlobs.map(async (blob) => {
            return { b64_json: await blobToBase64(blob) };
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
        fileReader.onerror = function() {
          self.postMessage(null);
        };
        fileReader.readAsDataURL(event.data);
      };
    `], { type: 'text/javascript' })));

        worker.onmessage = function (event) {
            resolve(event.data);
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
    if (isImageGenerating) return;

    // Get user input and image quantity values
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = parseInt(e.srcElement[1].value);

    // Disable the generate button, update its text, and set the flag
    generateBtn.setAttribute("disabled", true);
    generateBtn.innerText = "Generating";
    isImageGenerating = true;

    // Lấy các thẻ img_card hiện có hoặc tạo mới nếu không đủ
    let imgCards = imageGallery.querySelectorAll(".img_card");
    if (imgCards.length < userImgQuantity) {
        const additionalCards = Array.from({ length: userImgQuantity - imgCards.length }, () =>
            `<div class="img_card loading">
            <img src="images/loader.svg" alt="AI generated image">
            <a class="download_btn" href="#">
              <img src="images/download.svg" alt="download icon">
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
        img.src = "images/loader.svg";
    });

    generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleImageGeneration);