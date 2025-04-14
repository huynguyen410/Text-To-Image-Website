<?php
// project/src/gmail_token_manager.php

// Bao gồm file kết nối DB (đảm bảo đường dẫn đúng)
require_once __DIR__ . '/db_connect.php'; // Giả sử db_connect.php cùng thư mục

class GmailTokenManager {
    // Bỏ thuộc tính $tokenFile
    // private $tokenFile = __DIR__ . '/gmail_tokens.json';

    private $conn; // Thêm thuộc tính để giữ kết nối DB
    private $clientId = '537769433903-t7s4knrmcd8ituj7pqr4hhul4mj53tuk.apps.googleusercontent.com';
    private $clientSecret = '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'; // **GIỮ BÍ MẬT TUYỆT ĐỐI**
    private $redirectUri = 'http://localhost/Text-To-Image-Website/src/oauth2callback.php'; // Đảm bảo URI này được đăng ký trong Google Cloud Console

    // Thêm constructor để nhận kết nối DB
    public function __construct($db_connection) {
        $this->conn = $db_connection;
        if (!$this->conn) {
            error_log("GmailTokenManager: Không có kết nối database.");
            throw new Exception("Database connection is required for GmailTokenManager.");
        }
    }

    // Lấy refresh token từ DB
    private function getRefreshTokenFromDb() {
        $sql = "SELECT refresh_token FROM gmail_credentials WHERE credential_key = 'main_refresh_token' LIMIT 1";
        $result = mysqli_query($this->conn, $sql);
        if ($row = mysqli_fetch_assoc($result)) {
            // *** TODO: Thêm giải mã ở đây nếu bạn đã mã hóa token ***
            return $row['refresh_token'];
        }
        return null;
    }

    // Lưu refresh token vào DB
    private function saveRefreshTokenToDb($refreshToken) {
        // *** TODO: Thêm mã hóa ở đây trước khi lưu ***
        $sql = "UPDATE gmail_credentials SET refresh_token = ? WHERE credential_key = 'main_refresh_token'";
        $stmt = mysqli_prepare($this->conn, $sql);
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "s", $refreshToken);
            $success = mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            if (!$success) {
                error_log("Không thể lưu refresh token vào DB: " . mysqli_error($this->conn));
            }
            return $success;
        } else {
            error_log("Lỗi chuẩn bị câu lệnh lưu refresh token: " . mysqli_error($this->conn));
            return false;
        }
    }

    // Hàm này giờ chỉ cần refresh token để hoạt động
    public function getValidAccessToken() {
        $refreshToken = $this->getRefreshTokenFromDb();

        if (!$refreshToken) {
             error_log("Không tìm thấy refresh token trong DB.");
             // Cần hướng dẫn người dùng/admin chạy reset_gmail_auth.php
             return null;
        }

        // Luôn cố gắng refresh để lấy access token mới nhất
        // (Bạn có thể tối ưu bằng cách lưu access token và thời gian hết hạn vào DB
        // và chỉ refresh khi sắp hết hạn, nhưng cách này đơn giản hơn)
        return $this->refreshAccessTokenUsingToken($refreshToken);
    }

    // Đổi tên hàm refreshAccessToken để nhận refresh token làm tham số
    private function refreshAccessTokenUsingToken($refreshToken) {
        if (!$refreshToken) {
            error_log("Không có refresh token được cung cấp để làm mới.");
            return null;
        }

        $url = 'https://oauth2.googleapis.com/token';
        $data = [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'refresh_token' => $refreshToken,
            'grant_type' => 'refresh_token'
        ];

        // Phần cURL giữ nguyên...
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // Thêm timeout để tránh treo nếu Google không phản hồi
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        // Cân nhắc thêm xử lý lỗi proxy nếu cần
        // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Chỉ dùng khi debug SSL, không nên dùng trong production

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
             error_log("Lỗi cURL khi refresh token: " . $curlError);
             return null;
        }

        if ($httpCode !== 200) {
            error_log("Lỗi khi refresh token. HTTP Code: " . $httpCode . ", Response: " . $response);
            // Nếu lỗi là invalid_grant, có thể refresh token đã bị thu hồi
            if (strpos($response, 'invalid_grant') !== false) {
                error_log("Refresh token có thể đã bị thu hồi hoặc hết hạn. Cần xác thực lại.");
                // Xóa refresh token khỏi DB để buộc xác thực lại
                $this->saveRefreshTokenToDb(null);
            }
            return null;
        }

        $newTokens = json_decode($response, true);

        if (isset($newTokens['access_token'])) {
            // Không cần lưu lại access token ở đây nữa (trừ khi bạn muốn tối ưu)
            // Nếu Google trả về refresh token mới (hiếm khi xảy ra với grant_type=refresh_token),
            // thì cập nhật lại vào DB.
             if (isset($newTokens['refresh_token']) && $newTokens['refresh_token'] !== $refreshToken) {
                 error_log("Nhận được refresh token mới từ Google, đang cập nhật DB.");
                 $this->saveRefreshTokenToDb($newTokens['refresh_token']);
             }
            error_log("Đã refresh access token mới thành công. Thời gian sống: " . ($newTokens['expires_in'] ?? 'N/A') . " giây");
            return $newTokens['access_token'];
        }

        error_log("Phản hồi refresh token không chứa access_token mới.");
        return null;
    }

    // Lưu token ban đầu (đặc biệt là refresh token) vào DB sau khi callback
    public function storeInitialTokens($code) {
        $url = 'https://oauth2.googleapis.com/token';
        $data = [
            'code' => $code,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'redirect_uri' => $this->redirectUri,
            'grant_type' => 'authorization_code'
        ];

        // Phần cURL giữ nguyên...
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

         if ($curlError) {
             error_log("Lỗi cURL khi lấy token ban đầu: " . $curlError);
             return false;
         }

        if ($httpCode !== 200) {
            error_log("Lỗi khi lấy token ban đầu. HTTP Code: " . $httpCode . ", Response: " . $response);
            return false;
        }

        $tokens = json_decode($response, true);

        // **QUAN TRỌNG:** Luôn yêu cầu 'offline' access để nhận refresh token
        if (isset($tokens['refresh_token'])) {
            // Lưu refresh token vào DB
            $success = $this->saveRefreshTokenToDb($tokens['refresh_token']);
            if ($success) {
                error_log("Đã lưu refresh token ban đầu vào DB thành công.");
                return true;
            } else {
                error_log("Lỗi khi lưu refresh token ban đầu vào DB.");
                return false;
            }
        } else {
            error_log("Không nhận được refresh token trong phản hồi từ Google. Đảm bảo 'access_type=offline' và 'prompt=consent' được dùng trong Auth URL.");
            // Phân tích thêm $tokens để xem lỗi là gì nếu có
             error_log("Tokens received: " . print_r($tokens, true));
            return false;
        }
    }

    // Hàm này không nên dùng để lưu refresh token từ client nữa
    public function saveTokenFromClient($accessToken, $expiresIn, $refreshToken = null) {
         if ($refreshToken) {
              error_log("CẢNH BÁO: Client đang cố gắng gửi refresh token. Bỏ qua để bảo mật.");
              // Không lưu $refreshToken từ client vào DB trung tâm
         }
         // Bạn có thể chọn lưu access token và expires_in nếu muốn tối ưu,
         // nhưng hiện tại chúng ta đang lấy access token mới mỗi lần gọi getValidAccessToken()
         error_log("Đã nhận token từ client (chỉ ghi log, không lưu vào DB)");
         return true; // Trả về true để client không báo lỗi
    }

    // Hàm getAuthUrl giữ nguyên
    public function getAuthUrl() {
        $params = [
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code',
            'scope' => 'https://www.googleapis.com/auth/gmail.readonly',
            'access_type' => 'offline', // **QUAN TRỌNG** để nhận refresh token
            'prompt' => 'consent'      // **QUAN TRỌNG** để đảm bảo refresh token luôn được trả về (đặc biệt lần đầu hoặc khi scope thay đổi)
        ];
        return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
    }
}

// === Phần xử lý yêu cầu ===
header('Content-Type: application/json');

// Tạo instance của Token Manager, truyền kết nối DB vào
// Biến $conn được giả định là đã được tạo từ db_connect.php
$tokenManager = new GmailTokenManager($conn); // $conn từ require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    // Nếu client gửi token (thường là sau khi client tự lấy token)
    if (isset($input['access_token'])) {
        // Gọi hàm xử lý token từ client (đã được sửa đổi để không lưu refresh token)
        $tokenManager->saveTokenFromClient(
            $input['access_token'],
            $input['expires_in'] ?? 3600, // Cung cấp giá trị mặc định
            $input['refresh_token'] ?? null
        );
        // Chỉ trả về success, không trả về token nào từ đây
        echo json_encode(['success' => true]);
        exit;
    }

    // Nếu client chỉ yêu cầu access token (trường hợp thông thường)
    $accessToken = $tokenManager->getValidAccessToken();
    // Trả về access token hoặc null nếu không lấy được
    echo json_encode($accessToken ?: null); // Trả về null nếu không lấy được token
    exit;
}

// Xử lý callback từ Google sau khi người dùng đồng ý cấp quyền
if (isset($_GET['code'])) {
    $success = $tokenManager->storeInitialTokens($_GET['code']);

    // Chuyển hướng người dùng về trang chính với thông báo
    // (Đảm bảo đường dẫn ../index.php là chính xác)
    if ($success) {
        header("Location: ../index.php?auth=success_db"); // Thay đổi param để biết là lưu vào DB
    } else {
        header("Location: ../index.php?auth=failed_db");
    }
    exit;
}

// Hàm helper (nếu cần gọi từ nơi khác, nhưng thường không cần thiết nữa)
// function getGmailAccessToken($db_conn) {
//     $tokenManager = new GmailTokenManager($db_conn);
//     return $tokenManager->getValidAccessToken();
// }

// Đóng kết nối DB nếu nó được mở trong file này (thường db_connect.php tự quản lý)
// mysqli_close($conn); // Chỉ đóng nếu bạn mở nó ở đây
?>