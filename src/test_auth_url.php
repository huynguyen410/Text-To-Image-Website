<?php
$clientId = '537769433903-t7s4knrmcd8ituj7pqr4hhul4mj53tuk.apps.googleusercontent.com';
$redirectUri = 'http://localhost/Text-To-Image-Website/src/oauth2callback.php'; // Phải khớp 100% với GCloud Console
$scope = 'https://www.googleapis.com/auth/gmail.readonly';

$params = [
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code', // Tham số quan trọng
    'scope' => $scope,
    'access_type' => 'offline',
    'prompt' => 'consent'
];
$authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);

echo "Minimal Auth URL Test:<br>";
// Xuất link với htmlspecialchars (chuẩn)
echo "<a href='" . htmlspecialchars($authUrl) . "'>Minimal Test Link (Encoded)</a><br><br>";
// Xuất link không có htmlspecialchars (chỉ để debug, xem URL gốc)
echo "Raw URL (for debugging):<br><textarea rows='5' cols='80'>" . $authUrl . "</textarea>";
?>