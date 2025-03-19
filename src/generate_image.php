<?php
header('Content-Type: application/json'); // Trả về JSON

// API Token của Hugging Face (lấy từ tài khoản của bạn)
define('HUGGINGFACE_API_TOKEN', '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');

// Nhận dữ liệu từ client (prompt, style, modelId, quantity)
$data = json_decode(file_get_contents('php://input'), true);
$prompt = isset($data['prompt']) ? $data['prompt'] : '';
$style = isset($data['style']) ? $data['style'] : '';
$modelId = isset($data['modelId']) ? $data['modelId'] : '';
$quantity = isset($data['quantity']) ? (int)$data['quantity'] : 1;

if (empty($prompt) || empty($modelId)) {
  echo json_encode(['success' => false, 'error' => 'Thiếu prompt hoặc modelId']);
  exit;
}

// Kết hợp prompt với style (nếu có)
$fullPrompt = $style ? "$prompt, $style style" : $prompt;

// Gọi API Hugging Face
$apiUrl = "https://api-inference.huggingface.co/models/$modelId";
$headers = [
  "Authorization: Bearer " . HUGGINGFACE_API_TOKEN,
  "Content-Type: application/json"
];

$payload = json_encode(['inputs' => $fullPrompt]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 && $response) {
  // API trả về dữ liệu nhị phân (ảnh)
  $base64Image = base64_encode($response);
  echo json_encode(['success' => true, 'image' => $base64Image]);
} else {
  echo json_encode(['success' => false, 'error' => 'Không thể tạo ảnh: ' . $response]);
}
exit;
?>