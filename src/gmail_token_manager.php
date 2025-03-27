<?php
// project/src/gmail_token_manager.php

class GmailTokenManager {
    private $tokenFile = __DIR__ . '/gmail_tokens.json';
    private $clientId = '508561204784-51pehda0ihlu4a74lr8ed3f13k49t3i3.apps.googleusercontent.com';
    private $clientSecret = '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';
    private $redirectUri = 'http://localhost/project/src/oauth2callback.php';

    private function getTokens() {
        if (file_exists($this->tokenFile)) {
            return json_decode(file_get_contents($this->tokenFile), true);
        }
        return null;
    }

    private function saveTokens($tokens) {
        if (!file_put_contents($this->tokenFile, json_encode($tokens, JSON_PRETTY_PRINT))) {
            error_log("Không thể ghi file " . $this->tokenFile);
        }
    }

    public function getValidAccessToken() {
        $tokens = $this->getTokens();
        
        if (!$tokens || !isset($tokens['access_token'])) {
            return null;
        }

        $expiryTime = $tokens['created'] + $tokens['expires_in'];
        $currentTime = time();

        if ($currentTime < $expiryTime) {
            $remainingTime = $expiryTime - $currentTime;
            // Ghi log vào file thay vì echo trực tiếp
            error_log("Access token còn lại: " . $remainingTime . " giây");
            return $tokens['access_token'];
        }

        return $this->refreshAccessToken($tokens);
    }

    private function refreshAccessToken($tokens) {
        if (!isset($tokens['refresh_token'])) {
            return null;
        }

        $url = 'https://oauth2.googleapis.com/token';
        $data = [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'refresh_token' => $tokens['refresh_token'],
            'grant_type' => 'refresh_token'
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);

        $newTokens = json_decode($response, true);

        if (isset($newTokens['access_token'])) {
            $tokens['access_token'] = $newTokens['access_token'];
            $tokens['expires_in'] = $newTokens['expires_in'];
            $tokens['created'] = time();
            $this->saveTokens($tokens);
            error_log("Đã refresh access token mới. Thời gian sống: " . $newTokens['expires_in'] . " giây");
            return $newTokens['access_token'];
        }
        
        return null;
    }

    public function storeInitialTokens($code) {
        $url = 'https://oauth2.googleapis.com/token';
        $data = [
            'code' => $code,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'redirect_uri' => $this->redirectUri,
            'grant_type' => 'authorization_code'
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);

        $tokens = json_decode($response, true);

        if (isset($tokens['access_token'])) {
            $tokens['created'] = time();
            $this->saveTokens($tokens);
            return true;
        }
        
        return false;
    }

    public function saveTokenFromClient($accessToken, $expiresIn, $refreshToken = null) {
        $tokens = [
            'access_token' => $accessToken,
            'expires_in' => $expiresIn,
            'created' => time()
        ];
        if ($refreshToken) {
            $tokens['refresh_token'] = $refreshToken;
        }
        $this->saveTokens($tokens);
    }
}

// Xử lý yêu cầu
header('Content-Type: application/json'); // Đảm bảo phản hồi là JSON

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $tokenManager = new GmailTokenManager();
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['access_token'])) {
        $tokenManager->saveTokenFromClient(
            $input['access_token'],
            $input['expires_in'],
            $input['refresh_token'] ?? null
        );
        echo json_encode(['success' => true]);
        exit;
    }
    
    $token = $tokenManager->getValidAccessToken();
    echo json_encode($token ?: null);
    exit;
}

if (isset($_GET['code'])) {
    $tokenManager = new GmailTokenManager();
    $success = $tokenManager->storeInitialTokens($_GET['code']);
    
    if ($success) {
        header("Location: ../index.php?auth=success");
    } else {
        header("Location: ../index.php?auth=failed");
    }
    exit;
}

function getGmailAccessToken() {
    $tokenManager = new GmailTokenManager();
    return $tokenManager->getValidAccessToken();
}
?>