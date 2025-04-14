<?php
ob_start(); // Bắt đầu bộ đệm đầu ra
session_start();
require_once '../src/db_connect.php';

// Kiểm tra quyền admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    // Có thể chuyển hướng hoặc hiển thị lỗi thay vì chỉ exit
    // header('Location: admin_login.php');
    die('Unauthorized access.'); // Đơn giản là dừng lại
}

// Đặt tên file và các header HTTP
$filename = "invoices_report_" . date('Y-m-d') . ".csv";
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

// Tạo output stream để ghi CSV
$output = fopen('php://output', 'w');

// Ghi dòng header của CSV (UTF-8 BOM để Excel đọc tiếng Việt tốt hơn nếu cần)
fputs($output, "\xEF\xBB\xBF"); // UTF-8 BOM
fputcsv($output, ['Invoice ID', 'Customer Name', 'Total Price', 'Created At']);

// Truy vấn dữ liệu invoices (lấy tất cả, không phân trang)
$sql = "SELECT
            i.invoice_id,
            COALESCE(u.username, 'N/A') as customer_name, -- Lấy username, nếu null thì ghi N/A
            i.total_price,
            i.created_at
        FROM invoice i
        LEFT JOIN users u ON i.customer_id = u.id
        ORDER BY i.created_at DESC"; // Sắp xếp theo ngày tạo mới nhất

$result = mysqli_query($conn, $sql);

if ($result) {
    // Lặp qua kết quả và ghi từng dòng vào CSV
    while ($row = mysqli_fetch_assoc($result)) {
        fputcsv($output, [
            $row['invoice_id'],
            $row['customer_name'],
            $row['total_price'], // Định dạng tiền tệ nếu cần
            $row['created_at'] // Định dạng ngày tháng nếu cần
        ]);
    }
} else {
    // Ghi lỗi vào file nếu truy vấn thất bại (chỉ là ví dụ, không nên output lỗi trực tiếp vào CSV)
    // fputcsv($output, ['Error fetching data: ' . mysqli_error($conn)]);
    error_log("Export Invoices Error: " . mysqli_error($conn)); // Ghi vào log lỗi PHP
}

// Đóng kết nối DB
mysqli_close($conn);

// Đóng output stream
fclose($output);
ob_end_flush(); // Gửi bộ đệm đầu ra (nội dung CSV)
exit; // Dừng script
?>