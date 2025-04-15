$(document).ready(function () {
    // --- Modal Instances (khởi tạo một lần) ---
    const confirmationModalEl = document.getElementById('confirmationModal');
    const confirmationModal = confirmationModalEl ? new bootstrap.Modal(confirmationModalEl) : null;
    const infoModalEl = document.getElementById('infoModal');
    const infoModal = infoModalEl ? new bootstrap.Modal(infoModalEl) : null;

    // --- Helper Functions for Modals ---
    function showInfoModal(title, message, isSuccess = true) {
        if (!infoModal) return;
        $('#infoModalLabel').text(title);
        $('#infoModalBody').html(message);
        const header = $('#infoModalHeader');
        header.removeClass('bg-success bg-danger text-white').addClass(isSuccess ? 'bg-success text-white' : 'bg-danger text-white');
        infoModal.show();
    }

    function showConfirmationModal(title, message, confirmCallback) {
        if (!confirmationModal) return;
        $('#confirmationModalLabel').text(title);
        $('#confirmationModalBody').html(message);
        $('#confirmActionButton').off('click').one('click', function() {
            confirmationModal.hide();
            if (typeof confirmCallback === 'function') {
                confirmCallback();
            }
        });
        confirmationModal.show();
    }

    // --- Sidebar Navigation Logic ---
    function updateContent(hash) {
        hash = hash || location.hash || '#users';
        $('.admin-section').addClass('d-none');
        try {
            $(hash).removeClass('d-none');
        } catch (e) {
            console.error("Invalid hash selector:", hash);
            $('#users').removeClass('d-none');
            hash = '#users';
        }
        $('#adminSidebar .nav-link').removeClass('active');
        $('#adminSidebar .nav-link[href="' + hash + '"]').addClass('active');
        let title = 'Admin Panel';
        const activeLinkText = $('#adminSidebar .nav-link.active').text().trim();
        if (activeLinkText) {
            title = activeLinkText + ' Management';
        }
        $('#content-title').text(title);
    }

    updateContent();
    $(window).on('hashchange', function() {
        updateContent();
    });

    $('#adminSidebar .nav-link').on('click', function(e) {
        const targetHash = $(this).attr('href');
        if (location.hash !== targetHash) {
            location.hash = targetHash;
        } else {
            updateContent(targetHash);
        }
    });

    // Hàm load danh sách có phân trang
    function loadList({ url, target, entity, fields, modalId, page = 1, limit = 10 }) {
        const listContainer = $(target);
        listContainer.html('<div class="text-center p-3"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>');

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            data: { page: page, limit: limit },
            success: function (data) {
                if (data.success) {
                    let html = '<table class="table table-hover table-sm align-middle">';
                    const centeredColumns = ['role', 'is_premium', 'status'];
                    html += '<thead><tr>';
                    fields.forEach(f => {
                        const key = f.toLowerCase().replace(/\s+/g, '_');
                        const thClass = centeredColumns.includes(key) ? ' class="text-center"' : '';
                        html += `<th${thClass}>${f}</th>`;
                    });
                    html += `${entity !== 'invoice' ? '<th>Actions</th>' : ''}</tr></thead>`;
                    html += '<tbody>';
                    data[entity].forEach((item, index) => {
                        const rowNumber = (page - 1) * limit + index + 1;
                        html += '<tr>';
                        fields.forEach((field, fieldIndex) => {
                            let value;
                            let displayValue = '-';
                            const key = field.toLowerCase().replace(/\s+/g, '_');
                            let tdClass = '';

                            if (fieldIndex === 0) {
                                displayValue = rowNumber;
                            } else {
                                value = item[key] || null;
                                // Nếu là invoice và key customer_name, hiển thị thông báo khi giá trị là null
                                if (entity === 'invoice' && key === 'customer_name') {
                                    displayValue = (value !== null)
                                        ? escapeHtml(value)
                                        : '<span class="text-danger">This account has been deleted</span>';
                                } else if (entity === 'user') {
                                    if (key === 'is_premium') {
                                        displayValue = (value && value.toLowerCase() === 'yes') 
                                            ? '<span class="badge bg-success">Yes</span>' 
                                            : '<span class="badge bg-secondary">No</span>';
                                        tdClass = 'text-center';
                                    } else if (key === 'role') {
                                        displayValue = (value && value.toLowerCase() === 'admin') 
                                            ? '<span class="badge bg-primary">Admin</span>' 
                                            : '<span class="badge bg-secondary">Customer</span>';
                                        tdClass = 'text-center';
                                    } else {
                                        displayValue = value ? escapeHtml(value) : '-';
                                    }
                                } else if (entity === 'model') {
                                    if (key === 'status') {
                                        displayValue = (value && value.toLowerCase() === 'active') 
                                            ? '<span class="badge bg-success">Active</span>' 
                                            : '<span class="badge bg-warning">Inactive</span>';
                                        tdClass = 'text-center';
                                    } else {
                                        displayValue = value ? escapeHtml(value) : '-';
                                    }
                                } else {
                                    displayValue = value ? escapeHtml(value) : '-';
                                }
                            }

                            html += `<td${tdClass ? ' class="' + tdClass + '"' : ''}>${displayValue}</td>`;
                        });

                        if (entity !== 'invoice') {
                            const entityId = item.id;
                            html += `<td class="text-nowrap">
                                <button class="btn btn-sm btn-outline-warning edit-${entity} me-1" data-id="${entityId}" data-bs-toggle="modal" data-bs-target="#${modalId}" title="Edit">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-${entity}" data-id="${entityId}" title="Delete">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>`;
                        }
                        html += '</tr>';
                    });
                    html += '</tbody></table>';

                    if (data.total_pages && data.total_pages > 1) {
                        html += '<nav><ul class="pagination">';
                        if (data.page > 1) {
                            html += `<li class="page-item"><a class="page-link" href="#" data-page="${data.page - 1}">Previous</a></li>`;
                        } else {
                            html += `<li class="page-item disabled"><span class="page-link">Previous</span></li>`;
                        }
                        for (let i = 1; i <= data.total_pages; i++) {
                            if (i === data.page) {
                                html += `<li class="page-item active"><span class="page-link">${i}</span></li>`;
                            } else {
                                html += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
                            }
                        }
                        if (data.page < data.total_pages) {
                            html += `<li class="page-item"><a class="page-link" href="#" data-page="${data.page + 1}">Next</a></li>`;
                        } else {
                            html += `<li class="page-item disabled"><span class="page-link">Next</span></li>`;
                        }
                        html += '</ul></nav>';
                    }

                    $(target).html(html);

                    $(target).find('.pagination a.page-link').on('click', function(e){
                        e.preventDefault();
                        const newPage = $(this).data('page');
                        loadList({ url, target, entity, fields, modalId, page: newPage, limit: limit });
                    });

                    if (entity !== 'invoice') {
                        $(`.edit-${entity}`).on('click', function () {
                            const id = $(this).data('id');
                            $(`#${modalId}`).data(`${entity}-id`, id);
                            $.get(`../admin/edit_${entity}_form.php?id=${id}`, data => {
                                $(`#${modalId} .modal-body`).html(data);
                            });
                        });

                        $(`.delete-${entity}`).on('click', function () {
                            const id = $(this).data('id');
                            const entityName = entity.charAt(0).toUpperCase() + entity.slice(1);
                            showConfirmationModal(
                                `Confirm Deletion`, 
                                `Are you sure you want to delete this ${entityName}?`, 
                                function() {
                                    $.ajax({
                                        url: `../admin/delete_${entity}.php`,
                                        type: 'POST',
                                        data: { id },
                                        dataType: 'json',
                                        success: response => {
                                            showInfoModal(
                                                response.success ? 'Success' : 'Error',
                                                response.message || (response.success ? `${entityName} deleted successfully!` : `Failed to delete ${entityName}.`), 
                                                response.success
                                            );
                                            if (response.success) {
                                                loadList({ url, target, entity, fields, modalId, page: data.page, limit: limit });
                                            }
                                        },
                                        error: (xhr, status, error) => {
                                            // Improved error handling for delete
                                            let errorMsg = `Failed to delete ${entityName}. Unknown error occurred.`;
                                            if (xhr.responseText) {
                                                 // Attempt to show server message if available, but be cautious
                                                 // Avoid showing raw HTML/PHP errors directly
                                                 // We expect JSON, so if responseText is not JSON, it's likely an server error page/message
                                                // console.error("Server Response (non-JSON):", xhr.responseText.substring(0, 500)); // Log for debug
                                                errorMsg = `Failed to delete ${entityName}. Server responded unexpectedly. Please check server logs.`;
                                            } else if (error) {
                                                errorMsg = `Failed to delete ${entityName}. Client-side error: ${error}`; 
                                            }
                                            showInfoModal('Error', errorMsg, false);
                                        }
                                    });
                                }
                            );
                        });
                    }
                } else {
                    showInfoModal('Error Loading Data', data.message || `Failed to load ${entity} list.`, false);
                    $(target).html(`<p class="text-danger text-center">Error loading data. Please try again.</p>`);
                }
            },
            error: (xhr, status, error) => {
                // Improved error handling for loadList
                let errorMsg = `Failed to load ${entity}s. Please check connection or server status.`;
                 if (xhr.responseText) {
                     // console.error("Server Response (non-JSON):", xhr.responseText.substring(0, 500)); // Log for debug
                    errorMsg = `Failed to load ${entity}s. Server responded unexpectedly. Please check server logs.`;
                 } else if (error) {
                    errorMsg = `Failed to load ${entity}s. Client-side error: ${error}`;
                 }
                showInfoModal('Network Error', errorMsg, false);
                $(target).html(`<p class="text-danger text-center">Failed to load data.</p>`); 
            }
        });
    }

    // Hàm lưu chỉnh sửa cho User và Model
    function saveEdit({ modalId, entity, formId, url, reloadFn }) {
        const modalElement = $(`#${modalId}`);
        modalElement.find('.modal-footer .btn-primary').off('click').on('click', function () {
            const form = modalElement.find(`#${formId}`)[0];
            if (form && typeof form.checkValidity === 'function' && !form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const formData = $(`#${formId}`).serialize();
            const entityName = entity.charAt(0).toUpperCase() + entity.slice(1);

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                dataType: 'json',
                success: response => {
                    showInfoModal(
                        response.success ? 'Success' : 'Error',
                        response.message || (response.success ? `${entityName} updated successfully!` : `Failed to update ${entityName}.`),
                        response.success
                    );
                    if (response.success) {
                        const currentModal = bootstrap.Modal.getInstance(modalElement[0]);
                        if(currentModal) currentModal.hide();
                        reloadFn();
                    }
                },
                error: (xhr, status, error) => {
                    // Improved error handling for saveEdit
                    let errorMsg = `Failed to update ${entityName}. Unknown error occurred.`;
                    if (xhr.responseText) {
                        // console.error("Server Response (non-JSON):", xhr.responseText.substring(0, 500)); // Log for debug
                         errorMsg = `Failed to update ${entityName}. Server responded unexpectedly. Please check server logs.`;
                    } else if (error) {
                        errorMsg = `Failed to update ${entityName}. Client-side error: ${error}`;
                    }
                    showInfoModal('Error', errorMsg, false);
                }
            });
        });
    }

    // Cấu hình ban đầu cho danh sách
    let userConfig = {
        url: '../admin/get_users.php',
        target: '#user-list',
        entity: 'user',
        fields: ['ID', 'Username', 'Email', 'Created At', 'Role', 'Is Premium', 'Start Premium', 'End Premium'],
        modalId: 'editUserModal',
        page: 1,
        limit: parseInt($('#userLimit').val())
    };

    let modelConfig = {
        url: '../admin/get_models.php',
        target: '#model-list',
        entity: 'model',
        fields: ['ID', 'Model ID', 'Name', 'Description', 'Status'],
        modalId: 'editModelModal',
        page: 1,
        limit: parseInt($('#modelLimit').val())
    };

    let invoiceConfig = {
        url: '../admin/get_invoices.php',
        target: '#invoice-list',
        entity: 'invoice',
        // Thay đổi 'Customer Name' thành 'Customer Username' trong danh sách fields
        // Hoặc giữ nguyên nếu bạn đã điều chỉnh key trong get_invoices.php như gợi ý ở trên
        // Nếu bạn đã gán $row['customer_name'] = $row['customer_username']; trong PHP thì không cần sửa fields ở đây.
        fields: ['Invoice ID', 'Customer Name', 'Total Price', 'Created At'], // Giữ nguyên nếu đã map key trong PHP
        modalId: '',
        page: 1,
        limit: parseInt($('#invoiceLimit').val())
    };

    // Tải danh sách ban đầu
    loadList(userConfig);
    loadList(modelConfig);
    loadList(invoiceConfig);

    // Sự kiện thay đổi số mục hiển thị
    $('#userLimit').on('change', function() {
        userConfig.limit = parseInt($(this).val());
        userConfig.page = 1;
        loadList(userConfig);
    });

    $('#modelLimit').on('change', function() {
        modelConfig.limit = parseInt($(this).val());
        modelConfig.page = 1;
        loadList(modelConfig);
    });

    $('#invoiceLimit').on('change', function() {
        invoiceConfig.limit = parseInt($(this).val());
        invoiceConfig.page = 1;
        loadList(invoiceConfig);
    });

    // --- Export Invoices Button Click --- 
    $(document).on('click', '#exportInvoicesBtn', function() {
        // Đơn giản là chuyển hướng đến script xuất file
        window.location.href = 'export_invoices.php';
    });
    // --- End Export --- 

    // Modal thêm mới cho User và Model
    ['User', 'Model'].forEach(entity => {
        const modalId = `#add${entity}Modal`;
        $(modalId).on('show.bs.modal', function () {
            $(this).find('.modal-body').load(`../admin/add_${entity.toLowerCase()}_form.php`, function() {
                const addForm = $(`${modalId} form`);
                if (addForm.length) {
                    const addUrl = `../admin/add_${entity.toLowerCase()}.php`;
                    const reloadListConfig = (entity === 'User') ? userConfig : modelConfig;

                    addForm.off('submit').on('submit', function(e) {
                        e.preventDefault();
                        const formData = $(this).serialize();
                        const entityName = entity.charAt(0).toUpperCase() + entity.slice(1);

                        $.ajax({
                            url: addUrl,
                            type: 'POST',
                            data: formData,
                            dataType: 'json',
                            success: response => {
                                showInfoModal(
                                    response.success ? 'Success' : 'Error',
                                    response.message || (response.success ? `${entityName} added successfully!` : `Failed to add ${entityName}.`),
                                    response.success
                                );
                                if (response.success) {
                                    const currentModal = bootstrap.Modal.getInstance($(modalId)[0]);
                                    if(currentModal) currentModal.hide();
                                    loadList(reloadListConfig);
                                }
                            },
                            error: (xhr, status, error) => {
                                // Improved error handling for add form submit
                                let errorMsg = `Failed to add ${entityName}. Unknown error occurred.`;
                                if (xhr.responseText) {
                                     // console.error("Server Response (non-JSON):", xhr.responseText.substring(0, 500)); // Log for debug
                                     errorMsg = `Failed to add ${entityName}. Server responded unexpectedly. Please check server logs.`;
                                } else if (error) {
                                     errorMsg = `Failed to add ${entityName}. Client-side error: ${error}`;
                                }
                                showInfoModal('Error', errorMsg, false);
                            }
                        });
                    });
                }
            });
        });
    });

    // Gọi hàm saveEdit cho User và Model
    saveEdit({
        modalId: 'editUserModal',
        entity: 'user',
        formId: 'edit_user_form',
        url: '../admin/edit_user.php',
        reloadFn: () => loadList(userConfig)
    });

    saveEdit({
        modalId: 'editModelModal',
        entity: 'model',
        formId: 'edit_model_form',
        url: '../admin/edit_model.php',
        reloadFn: () => loadList(modelConfig)
    });

    // Toggle password
    $(document).on('click', '.togglePassword', function () {
        const input = $(this).prev('input');
        const icon = $(this).find('i');
        input.attr('type', input.attr('type') === 'password' ? 'text' : 'password');
        icon.toggleClass('bi-eye bi-eye-slash');
    });

    // Hàm escape HTML
    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        if (text == null) return '';
        text = String(text);
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
});
