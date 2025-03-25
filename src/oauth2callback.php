<?php
  header("Cross-Origin-Opener-Policy: same-origin-allow-popups");
  // Nếu cần, bạn cũng có thể thêm header COEP (Cross-Origin-Embedder-Policy)
  // header("Cross-Origin-Embedder-Policy: require-corp");
  header("Location: index.php");
  exit;
?>