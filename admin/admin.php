<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - AI Image Generator</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons CSS (Using cdnjs - Removed integrity/crossorigin) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css" />
    <!-- Optional: Add custom admin CSS if needed -->
    <link rel="stylesheet" href="../css/admin_style.css">
</head>
<body class="d-flex flex-column min-vh-100">
    <?php 
    // Start session if not already started
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    // Check if admin is logged in using the correct session variables
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        // Redirect to admin login page if not logged in or not admin
        header("Location: admin_login.php"); // Correct path within admin folder
        exit;
    }
    ?>

    <!-- Admin Specific Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark"> <!-- Use dark background for admin -->
        <div class="container-fluid">
            <a class="navbar-brand" href="admin.php">Admin Panel</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar"
                    aria-controls="adminNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="adminNavbar">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                    <li class="nav-item">
                        <!-- Display Admin Username (Assuming $_SESSION['username'] holds it) -->
                        <span class="navbar-text me-3">
                            Logged in as: <?php echo isset($_SESSION['username']) ? htmlspecialchars($_SESSION['username']) : 'Admin'; ?>
                        </span>
                    </li>
                    <li class="nav-item">
                        <a class="btn btn-outline-light btn-sm" href="admin_logout.php">
                           <i class="bi bi-box-arrow-right me-1"></i>Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- End Admin Specific Navbar -->

    <div class="container-fluid flex-grow-1"> 
        <div class="row h-100">
            <!-- Sidebar -->
            <nav id="adminSidebar" class="col-md-3 col-lg-2 d-md-block sidebar collapse border-end">
                <div class="position-sticky pt-3">
                    <ul class="nav nav-pills flex-column">
                        <li class="nav-item">
                            <a class="nav-link" href="#users">
                                <i class="bi bi-people-fill me-2"></i> Users
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#models">
                                <i class="bi bi-box-seam me-2"></i> Models
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#invoices">
                                <i class="bi bi-receipt me-2"></i> Invoices
                            </a>
                        </li>
                        <!-- Add more admin links here if needed -->
                    </ul>
                </div>
            </nav>

            <!-- Main content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-3">
                <h1 class="mb-4" id="content-title">Admin Panel</h1> <!-- Title for the main area -->

                <!-- Content Sections (Previously Tab Panes) -->
                <div id="users" class="admin-section">
                    <div class="card shadow-sm mb-4"> 
                        <div class="card-header bg-light d-flex justify-content-between align-items-center"> 
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addUserModal">
                                <i class="bi bi-plus-lg me-1"></i>Add User
                            </button>
                             <select id="userLimit" class="form-select form-select-sm d-inline-block w-auto">
                                <option value="5">5</option>
                                <option value="10" selected>10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div class="card-body p-3"> 
                            <div id="user-list" class="table-responsive">Loading users...</div>
                        </div>
                    </div>
                </div>

                <div id="models" class="admin-section d-none">
                     <div class="card shadow-sm mb-4"> 
                        <div class="card-header bg-light d-flex justify-content-between align-items-center"> 
                            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addModelModal">
                                <i class="bi bi-plus-lg me-1"></i>Add Model
                            </button>
                            <select id="modelLimit" class="form-select form-select-sm d-inline-block w-auto">
                                <option value="5">5</option>
                                <option value="10" selected>10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div class="card-body p-3"> 
                            <div id="model-list" class="table-responsive">Loading models...</div>
                        </div>
                    </div>
                </div>

                <div id="invoices" class="admin-section d-none">
                     <div class="card shadow-sm mb-4"> 
                        <div class="card-header bg-light d-flex justify-content-between align-items-center"> 
                             <select id="invoiceLimit" class="form-select form-select-sm d-inline-block w-auto" style="margin-left: auto;">
                                <option value="5">5</option>
                                <option value="10" selected>10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        <div class="card-body p-3"> 
                            <div id="invoice-list" class="table-responsive">Loading invoices...</div>
                        </div>
                    </div>
                </div>
                 <!-- End Content Sections -->

            </main>
        </div>
    </div>

    <!-- Modals -->
    <!-- Add User Modal -->
    <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addUserModalLabel">Add New User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Content loaded via AJAX -->
                </div>
            </div>
        </div>
    </div>

    <!-- Edit User Modal -->
    <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Content loaded via AJAX -->
                </div>
                <!-- Restored static modal-footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="saveEditUser">Save changes</button> 
                </div>
            </div>
        </div>
    </div>

     <!-- Add Model Modal -->
    <div class="modal fade" id="addModelModal" tabindex="-1" aria-labelledby="addModelModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addModelModalLabel">Add New Model</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- Content loaded via AJAX -->
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Model Modal -->
    <div class="modal fade" id="editModelModal" tabindex="-1" aria-labelledby="editModelModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModelModalLabel">Edit Model</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                     <!-- Content loaded via AJAX (paths in JS need checking) -->
                </div>
                 <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="saveEditModel">Save changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Confirmation Modal -->
    <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmationModalLabel">Confirm Action</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="confirmationModalBody">
                    Are you sure you want to proceed with this action?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmActionButton">Confirm</button> 
                </div>
            </div>
        </div>
    </div>

    <!-- Information Modal -->
    <div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header" id="infoModalHeader">
                    <h5 class="modal-title" id="infoModalLabel">Information</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="infoModalBody">
                    Operation details.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-3 border-top border-secondary flex-shrink-0"> <!-- Changed to bg-dark, text-white, border-secondary -->
      <div class="container">
        <p class="mb-0">© 2025 AI Image Generator</p> <!-- Removed text-muted, added mb-0 -->
        <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" class="link-light">Hugging Face</a> | <!-- Changed to link-light -->
        <a href="https://www.sgu.edu.vn/" target="_blank" rel="noopener noreferrer" class="link-light">Saigon University</a> <!-- Changed to link-light -->
      </div>
    </footer>

    <!-- Bootstrap JS Bundle (Keep at the end) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- jQuery (Keep at the end) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Admin Script (Path needs to be relative from admin/ to js/) -->
    <script src="../js/admin_script.js"></script> 
</body>
</html>
