<?php
header('Content-Type: application/json');

// Đường dẫn đến file JSON chứa token
$tokenFile = __DIR__ . '/gmail_tokens.json';

if (file_exists($tokenFile)) {
    $tokens = json_decode(file_get_contents($tokenFile), true);
    if ($tokens) {
        echo json_encode([
            'success' => true,
            'tokens' => [
                'access_token' => isset($tokens['access_token']) ? substr($tokens['access_token'], 0, 20) . '...' : 'Not found',
                'refresh_token' => isset($tokens['refresh_token']) ? $tokens['refresh_token'] : 'Not found',
                'expires_in' => isset($tokens['expires_in']) ? $tokens['expires_in'] : 'Not found',
                'created' => isset($tokens['created']) ? date('Y-m-d H:i:s', $tokens['created']) : 'Not found'
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON format in token file'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Token file not found'
    ]);
}
?> 