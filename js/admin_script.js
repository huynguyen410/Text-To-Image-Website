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
        $('#infoModalBody').html(message); // Use html() to render potential HTML in message
        const header = $('#infoModalHeader');
        header.removeClass('bg-success bg-danger text-white').addClass(isSuccess ? 'bg-success text-white' : 'bg-danger text-white');
        infoModal.show();
    }

    function showConfirmationModal(title, message, confirmCallback) {
        if (!confirmationModal) return;
        $('#confirmationModalLabel').text(title);
        $('#confirmationModalBody').html(message); // Use html() here too
        // Ensure previous click handlers are removed before attaching a new one
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
        // Default to #users if hash is empty or invalid
        hash = hash || location.hash || '#users';
        // Hide all sections first
        $('.admin-section').addClass('d-none');
        try {
            // Show the target section
            $(hash).removeClass('d-none');
        } catch (e) {
            // Fallback if hash is invalid (e.g., contains invalid characters)
            console.error("Invalid hash selector:", hash, e);
            $('#users').removeClass('d-none'); // Default to users section
            hash = '#users'; // Correct the hash for highlighting
            location.hash = hash; // Optionally update URL hash to valid default
        }
        // Update sidebar link highlighting
        $('#adminSidebar .nav-link').removeClass('active');
        // Use attribute selector for safety, especially if hash could contain special chars
        $('#adminSidebar .nav-link[href="' + hash + '"]').addClass('active');

        // Update main content title based on active link
        let title = 'Admin Panel'; // Default title
        const activeLinkText = $('#adminSidebar .nav-link.active').text().trim();
        if (activeLinkText) {
            title = activeLinkText + ' Management';
        }
        $('#content-title').text(title);
    }

    // Initial content load based on URL hash or default
    updateContent();

    // Handle hash changes (e.g., browser back/forward buttons)
    $(window).on('hashchange', function() {
        updateContent();
    });

    // Handle sidebar link clicks
    $('#adminSidebar .nav-link').on('click', function(e) {
        // No need for preventDefault() if we let hashchange handle it
        const targetHash = $(this).attr('href');
        // Only explicitly call updateContent if hash isn't changing (e.g., clicking active link)
        if (location.hash === targetHash) {
             e.preventDefault(); // Prevent page jump if already on the section
            updateContent(targetHash);
        }
         // Otherwise, let the browser handle the hash change and trigger the 'hashchange' event
    });

    // Hàm load danh sách có phân trang
    function loadList({ url, target, entity, fields, modalId, page = 1, limit = 10, sort = 'id', order = 'asc' }) {
        const listContainer = $(target);
        // Show loading spinner
        listContainer.html('<div class="d-flex justify-content-center align-items-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>');

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            data: { 
                page: page, 
                limit: limit,
                sort: sort,
                order: order
            },
            success: function (data) {
                if (data.success) {
                    let html = '<table class="table table-hover table-sm align-middle table-striped">'; // Added table-striped
                    const centeredColumns = ['role', 'is_premium', 'status']; // Columns to center align
                    html += '<thead class="table-light"><tr>'; // Added thead style
                    fields.forEach(f => {
                        const key = f.toLowerCase().replace(/\s+/g, '_');
                        const thClass = centeredColumns.includes(key) ? ' class="text-center"' : '';
                        // Add scope="col" for accessibility
                        html += `<th scope="col"${thClass}>${escapeHtml(f)}</th>`;
                    });
                    // Add Actions header only if not invoice
                    html += `${entity !== 'invoice' ? '<th scope="col">Actions</th>' : ''}</tr></thead>`;
                    html += '<tbody>';

                    if (data[entity] && data[entity].length > 0) {
                         data[entity].forEach((item) => { // No need for index if not using row number
                            html += '<tr>';
                            fields.forEach((field) => { // No need for fieldIndex
                                const key = field.toLowerCase().replace(/\s+/g, '_');
                                // Use item[key] directly, handle potential null/undefined
                                let value = (item[key] !== null && item[key] !== undefined) ? item[key] : null;
                                let displayValue = '-'; // Default display value
                                let tdClass = '';

                                // Apply specific formatting based on entity and key
                                if (entity === 'invoice') {
                                    if (key === 'customer_name') { // Assuming PHP returns 'customer_name' key
                                        displayValue = (value !== null && value !== '')
                                            ? escapeHtml(value)
                                             // More descriptive message for unavailable username
                                            : '<span class="text-muted fst-italic">Username not available</span>';
                                    } else if (key === 'total_price' && value !== null) {
                                        // Format price as currency (example: Vietnamese Dong)
                                         displayValue = parseFloat(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                                    } else {
                                        displayValue = value !== null ? escapeHtml(value) : '-';
                                    }
                                } else if (entity === 'user') {
                                    if (key === 'is_premium') {
                                        displayValue = (value && String(value).toLowerCase() === 'yes') // Ensure comparison is safe
                                            ? '<span class="badge bg-success">Yes</span>'
                                            : '<span class="badge bg-secondary">No</span>';
                                        tdClass = 'text-center';
                                    } else if (key === 'role') {
                                        displayValue = (value && String(value).toLowerCase() === 'admin')
                                            ? '<span class="badge bg-info text-dark">Admin</span>' // Different color for admin
                                            : '<span class="badge bg-light text-dark">Customer</span>'; // Different color for customer
                                        tdClass = 'text-center';
                                    } else if (key === 'created_at' || key === 'start_premium' || key === 'end_premium') {
                                         // Format dates if they are valid
                                         displayValue = (value && value !== '0000-00-00' && value !== '0000-00-00 00:00:00')
                                            ? new Date(value).toLocaleDateString('en-CA') // YYYY-MM-DD format
                                            : '-';
                                    } else {
                                        displayValue = value !== null ? escapeHtml(value) : '-'; // Display actual ID here
                                    }
                                } else if (entity === 'model') {
                                    if (key === 'status') {
                                        displayValue = (value && String(value).toLowerCase() === 'active')
                                            ? '<span class="badge bg-success">Active</span>'
                                            : '<span class="badge bg-warning text-dark">Inactive</span>';
                                        tdClass = 'text-center';
                                    } else {
                                        displayValue = value !== null ? escapeHtml(value) : '-'; // Display actual ID here
                                    }
                                } else {
                                    // Default case for other entities or unformatted fields
                                    displayValue = value !== null ? escapeHtml(value) : '-';
                                }

                                html += `<td${tdClass ? ' class="' + tdClass + '"' : ''}>${displayValue}</td>`;
                            });


                            // Add Edit/Delete buttons if not invoice
                            if (entity !== 'invoice') {
                                // Use the actual ID from the item data
                                const entityId = item.id;
                                html += `<td class="text-nowrap">
                                    <button class="btn btn-sm btn-outline-primary edit-${entity} me-1" data-id="${entityId}" data-bs-toggle="modal" data-bs-target="#${modalId}" title="Edit ${entity}">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger delete-${entity}" data-id="${entityId}" title="Delete ${entity}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>`;
                            }
                            html += '</tr>';
                        });
                    } else {
                         // Display a message if no data found
                         const colspan = fields.length + (entity !== 'invoice' ? 1 : 0);
                         html += `<tr><td colspan="${colspan}" class="text-center text-muted p-3">No ${entity}s found.</td></tr>`;
                    }

                    html += '</tbody></table>';

                    // Pagination logic (only if total_pages > 1)
                    if (data.total_pages && data.total_pages > 1) {
                        html += '<nav aria-label="Page navigation"><ul class="pagination justify-content-center">'; // Centered pagination

                        // Previous button
                        html += `<li class="page-item ${data.page <= 1 ? 'disabled' : ''}">
                                     <a class="page-link" href="#" data-page="${data.page - 1}" aria-label="Previous">
                                         <span aria-hidden="true">&laquo;</span>
                                     </a>
                                 </li>`;

                        // Page numbers (implement logic for ellipsis if many pages)
                        // Basic version: show all pages
                        for (let i = 1; i <= data.total_pages; i++) {
                            html += `<li class="page-item ${i === data.page ? 'active' : ''}">
                                         <a class="page-link" href="#" data-page="${i}">${i}</a>
                                     </li>`;
                        }

                        // Next button
                        html += `<li class="page-item ${data.page >= data.total_pages ? 'disabled' : ''}">
                                     <a class="page-link" href="#" data-page="${data.page + 1}" aria-label="Next">
                                         <span aria-hidden="true">&raquo;</span>
                                     </a>
                                 </li>`;
                        html += '</ul></nav>';
                    }

                    // Update the list container with the generated HTML
                    listContainer.html(html);

                    // Re-attach pagination click handlers
                    listContainer.find('.pagination a.page-link').on('click', function(e){
                        e.preventDefault();
                        const newPage = $(this).data('page');
                        if (newPage && newPage !== data.page) { // Only load if page is valid and different
                            loadList({ url, target, entity, fields, modalId, page: newPage, limit: limit, sort: sort, order: order });
                        }
                    });

                    // Re-attach edit/delete click handlers if applicable
                    if (entity !== 'invoice') {
                        listContainer.find(`.edit-${entity}`).on('click', function () {
                            const id = $(this).data('id');
                            const editModalTarget = $(`#${modalId}`);
                             // Store the ID in the modal's data attribute for later retrieval
                            editModalTarget.data(`${entity}-id`, id);
                            // Load the edit form into the modal body
                            editModalTarget.find('.modal-body').load(`../admin/edit_${entity}_form.php?id=${id}`, function(response, status, xhr) {
                                 if (status == "error") {
                                     console.error("Error loading edit form:", xhr.status, xhr.statusText);
                                     editModalTarget.find('.modal-body').html('<p class="text-danger">Could not load the edit form. Please try again.</p>');
                                 }
                            });
                        });

                        listContainer.find(`.delete-${entity}`).on('click', function () {
                            const id = $(this).data('id');
                            const entityName = entity.charAt(0).toUpperCase() + entity.slice(1);
                            // Use the confirmation modal helper
                            showConfirmationModal(
                                `Confirm ${entityName} Deactivation`, // Updated title for soft delete
                                `Are you sure you want to deactivate this ${entityName}? This action is reversible if needed.`, // Updated message
                                function() { // Callback function on confirmation
                                    $.ajax({
                                        url: `../admin/delete_${entity}.php`, // Assumes delete_user.php handles soft delete now
                                        type: 'POST',
                                        data: { id: id },
                                        dataType: 'json',
                                        success: response => {
                                            showInfoModal(
                                                response.success ? 'Success' : 'Error',
                                                response.message || (response.success ? `${entityName} deactivated successfully!` : `Failed to deactivate ${entityName}.`),
                                                response.success
                                            );
                                            if (response.success) {
                                                // Reload the list on the current page after successful deactivation
                                                loadList({ url, target, entity, fields, modalId, page: data.page, limit: limit, sort: sort, order: order });
                                            }
                                        },
                                        error: (xhr, status, error) => {
                                            console.error("Delete Error:", status, error, xhr.responseText);
                                            let errorMsg = `Failed to deactivate ${entityName}. An unknown error occurred.`;
                                            if (xhr.responseText) {
                                                try {
                                                    // Try parsing responseText as JSON for detailed error message
                                                    const errData = JSON.parse(xhr.responseText);
                                                    if(errData.message) errorMsg = errData.message;
                                                } catch(e) {
                                                     errorMsg = `Failed to deactivate ${entityName}. Server responded unexpectedly.`;
                                                     console.error("Non-JSON server response:", xhr.responseText); // Log for debugging
                                                }
                                            }
                                            showInfoModal('Error', errorMsg, false);
                                        }
                                    });
                                }
                            );
                        });
                    }

                } else {
                    // Handle case where data.success is false
                    showInfoModal('Error Loading Data', data.message || `Failed to load ${entity} list.`, false);
                    listContainer.html(`<div class="alert alert-warning text-center m-3">Could not load ${entity} data. ${escapeHtml(data.message || '')}</div>`);
                }
            },
            error: (xhr, status, error) => {
                 // Handle AJAX request errors (network issues, server errors)
                console.error("AJAX Error:", status, error, xhr.responseText);
                showInfoModal('Network Error', `Failed to load ${entity}s. Please check your connection or the server status.`, false);
                listContainer.html(`<div class="alert alert-danger text-center m-3">Failed to load data due to a network or server error.</div>`);
            }
        });
    } // --- End loadList function ---

    // Hàm lưu chỉnh sửa cho User và Model
    function saveEdit({ modalId, entity, formId, url, reloadFn }) {
        const modalElement = $(`#${modalId}`);
        // Attach event handler to the static Save button in the modal footer
        modalElement.find('.modal-footer .btn-primary').off('click').on('click', function () {
             // Find the form within the modal body
            const form = modalElement.find(`.modal-body #${formId}`)[0]; // More specific selector

            // Basic HTML5 form validation
            if (form && typeof form.checkValidity === 'function' && !form.checkValidity()) {
                form.reportValidity(); // Display browser validation messages
                return;
            }

            // Serialize form data
            const formData = $(form).serialize(); // Use the found form element
            const entityName = entity.charAt(0).toUpperCase() + entity.slice(1);

            // Disable button to prevent multiple clicks
            const saveButton = $(this);
            saveButton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...');


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
                        // Hide the modal on success
                        const currentModalInstance = bootstrap.Modal.getInstance(modalElement[0]);
                        if(currentModalInstance) currentModalInstance.hide();
                         // Reload the list to show changes
                        reloadFn();
                    }
                },
                error: (xhr, status, error) => {
                    console.error("Save Error:", status, error, xhr.responseText);
                    let errorMsg = `Failed to update ${entityName}. An unknown error occurred.`;
                     if (xhr.responseText) {
                         try {
                             const errData = JSON.parse(xhr.responseText);
                             if(errData.message) errorMsg = errData.message;
                         } catch(e) {
                              errorMsg = `Failed to update ${entityName}. Server responded unexpectedly.`;
                              console.error("Non-JSON server response:", xhr.responseText);
                         }
                     }
                    showInfoModal('Error', errorMsg, false);
                },
                complete: () => {
                     // Re-enable button and restore text
                    saveButton.prop('disabled', false).html('Save changes');
                }
            });
        });
    } // --- End saveEdit function ---

    // Cấu hình ban đầu cho danh sách
    let userConfig = {
        url: '../admin/get_users.php',
        target: '#user-list',
        entity: 'user',
        // Corrected field names to match typical database columns if needed
        fields: ['ID', 'Username', 'Email', 'Created At', 'Role', 'Is Premium', 'Start Premium', 'End Premium'],
        modalId: 'editUserModal',
        page: 1,
        limit: parseInt($('#userLimit').val()) || 10 // Default limit
    };

    let modelConfig = {
        url: '../admin/get_models.php',
        target: '#model-list',
        entity: 'model',
        fields: ['ID', 'Model ID', 'Name', 'Description', 'Status'],
        modalId: 'editModelModal',
        page: 1,
        limit: parseInt($('#modelLimit').val()) || 10,
        sort: 'id',
        order: 'asc'
    };

    let invoiceConfig = {
        url: '../admin/get_invoices.php',
        target: '#invoice-list',
        entity: 'invoice',
        fields: ['Invoice ID', 'Customer Name', 'Total Price', 'Created At'],
        modalId: '',
        page: 1,
        limit: parseInt($('#invoiceLimit').val()) || 10,
        sort: 'id',
        order: 'asc'
    };

    // Tải danh sách ban đầu
    loadList(userConfig);
    loadList(modelConfig);
    loadList(invoiceConfig);

    // Sự kiện thay đổi số mục hiển thị (Limit dropdowns)
    $('#userLimit, #modelLimit, #invoiceLimit').on('change', function() {
        const selectId = $(this).attr('id');
        const newLimit = parseInt($(this).val()) || 10;
        let configToUpdate;

        if (selectId === 'userLimit') configToUpdate = userConfig;
        else if (selectId === 'modelLimit') configToUpdate = modelConfig;
        else if (selectId === 'invoiceLimit') configToUpdate = invoiceConfig;

        if (configToUpdate) {
            configToUpdate.limit = newLimit;
            configToUpdate.page = 1; // Reset to page 1 when limit changes
            loadList(configToUpdate);
        }
    });

    // --- Export Invoices Button Click ---
    // Use event delegation for dynamically added elements if needed, but button seems static
    $('#exportInvoicesBtn').on('click', function() {
        // Simple redirect to the export script
        window.location.href = 'export_invoices.php';
    });
    // --- End Export ---

    // Modal thêm mới cho User và Model
    ['User', 'Model'].forEach(entity => {
        const entityLower = entity.toLowerCase();
        const modalId = `#add${entity}Modal`; // e.g., #addUserModal
        const addFormUrl = `../admin/add_${entityLower}_form.php`;
        const addSubmitUrl = `../admin/add_${entityLower}.php`;
        const reloadListConfig = (entity === 'User') ? userConfig : modelConfig;

        $(modalId).on('show.bs.modal', function () {
            // Load the add form into the modal body
            $(this).find('.modal-body').load(addFormUrl, function(response, status, xhr) {
                if (status == "error") {
                    console.error(`Error loading add ${entity} form:`, xhr.status, xhr.statusText);
                    $(this).html(`<p class="text-danger">Could not load the add ${entity} form. Please try again.</p>`);
                    return; // Stop if form didn't load
                }

                // Form loaded successfully, attach submit handler
                const addForm = $(`${modalId} form`); // Find the form *inside* the loaded content
                if (addForm.length) {
                    addForm.off('submit').on('submit', function(e) {
                        e.preventDefault();

                        // HTML5 validation check
                        if (typeof this.checkValidity === 'function' && !this.checkValidity()) {
                             this.reportValidity();
                             return;
                        }

                        const formData = $(this).serialize();
                        const entityName = entity; // Already capitalized

                         // Find and disable submit button within the form
                        const submitButton = $(this).find('button[type="submit"]');
                        submitButton.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...');


                        $.ajax({
                            url: addSubmitUrl,
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
                                    // Hide the modal on success
                                    const currentModalInstance = bootstrap.Modal.getInstance($(modalId)[0]);
                                    if(currentModalInstance) currentModalInstance.hide();
                                    // Reload the list to show the new item
                                    loadList(reloadListConfig);
                                }
                            },
                            error: (xhr, status, error) => {
                                console.error("Add Error:", status, error, xhr.responseText);
                                let errorMsg = `Failed to add ${entityName}. An unknown error occurred.`;
                                if (xhr.responseText) {
                                     try {
                                         const errData = JSON.parse(xhr.responseText);
                                         if(errData.message) errorMsg = errData.message;
                                     } catch(e) {
                                          errorMsg = `Failed to add ${entityName}. Server responded unexpectedly.`;
                                           console.error("Non-JSON server response:", xhr.responseText);
                                     }
                                 }
                                showInfoModal('Error', errorMsg, false);
                            },
                            complete: () => {
                                 // Re-enable button and restore text
                                submitButton.prop('disabled', false).html('Add ' + entityName); // Adjust text as needed
                            }
                        });
                    });
                } else {
                    console.error(`Could not find form within loaded content for ${modalId}`);
                     $(this).html(`<p class="text-danger">Error: Form structure not found in loaded content.</p>`);
                }
            });
        });

         // Clear modal body when hidden to ensure fresh form load next time
        $(modalId).on('hidden.bs.modal', function () {
            $(this).find('.modal-body').html('');
        });
    });

    // Gọi hàm saveEdit cho User và Model (initial setup for edit modals)
    saveEdit({
        modalId: 'editUserModal',
        entity: 'user',
        formId: 'edit_user_form', // Make sure this ID matches the form in edit_user_form.php
        url: '../admin/edit_user.php',
        reloadFn: () => loadList(userConfig) // Reload user list on success
    });

    saveEdit({
        modalId: 'editModelModal',
        entity: 'model',
        formId: 'edit_model_form', // Make sure this ID matches the form in edit_model_form.php
        url: '../admin/edit_model.php',
        reloadFn: () => loadList(modelConfig) // Reload model list on success
    });

     // Clear edit modal body when hidden
    $('#editUserModal, #editModelModal').on('hidden.bs.modal', function () {
        $(this).find('.modal-body').html('');
    });


    // Toggle password visibility (using event delegation for dynamically loaded forms)
    $(document).on('click', '.togglePassword', function () {
        const input = $(this).closest('.input-group').find('input'); // Find input within the same group
        const icon = $(this).find('i');
        if (input.length) {
            const currentType = input.attr('type');
            input.attr('type', currentType === 'password' ? 'text' : 'password');
            icon.toggleClass('bi-eye bi-eye-slash');
        }
    });

    // Hàm escape HTML - robust version
    function escapeHtml(text) {
        if (text === null || typeof text === 'undefined') {
            return ''; // Return empty string for null or undefined
        }
        // Ensure text is a string before replacing
        const str = String(text);
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;' // Or &apos;
        };
        return str.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Config for deleted models
    const deletedModelConfig = {
        url: '../admin/get_deleted_models.php',
        target: '#deleted-model-list',
        entity: 'model',
        fields: ['ID', 'Model ID', 'Name', 'Description', 'Status', 'Deleted At'],
        modalId: 'editModelModal'
    };

    // Toggle between active and deleted models
    let showingDeletedModels = false;
    $('#toggleDeletedModels').on('click', function() {
        showingDeletedModels = !showingDeletedModels;
        const $btn = $(this);
        const $modelList = $('#model-list');
        const $deletedModelList = $('#deleted-model-list');
        
        if (showingDeletedModels) {
            $btn.html('<i class="bi bi-list me-1"></i>Show Active Models');
            $modelList.addClass('d-none');
            $deletedModelList.removeClass('d-none');
            loadListWithRestore(deletedModelConfig);
        } else {
            $btn.html('<i class="bi bi-archive me-1"></i>Show Deleted Models');
            $modelList.removeClass('d-none');
            $deletedModelList.addClass('d-none');
            loadList(modelConfig);
        }
    });

    // Separate function for loading deleted models with restore button
    function loadListWithRestore(config) {
        const listContainer = $(config.target);
        listContainer.html('<div class="d-flex justify-content-center align-items-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>');

        $.ajax({
            url: config.url,
            type: 'GET',
            data: {
                page: config.page || 1,
                limit: config.limit || 10
            },
            success: function(data) {
                if (data.success) {
                    let html = `<table class="table table-hover">
                        <thead>
                            <tr>
                                ${config.fields.map(field => `<th>${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}</th>`).join('')}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>`;

                    if (data[config.entity] && data[config.entity].length > 0) {
                        data[config.entity].forEach((item) => {
                            html += '<tr>';
                            config.fields.forEach((field) => {
                                let value = item[field.toLowerCase().replace(/\s+/g, '_')];
                                let displayValue = value;
                                let tdClass = '';

                                if (field === 'Status') {
                                    displayValue = (value && String(value).toLowerCase() === 'active')
                                        ? '<span class="badge bg-success">Active</span>'
                                        : '<span class="badge bg-warning text-dark">Inactive</span>';
                                    tdClass = 'text-center';
                                } else if (field === 'Deleted At') {
                                    displayValue = value ? new Date(value).toLocaleString() : '-';
                                } else {
                                    displayValue = value !== null ? escapeHtml(value) : '-';
                                }

                                html += `<td${tdClass ? ' class="' + tdClass + '"' : ''}>${displayValue}</td>`;
                            });

                            html += `<td>
                                <button class="btn btn-sm btn-success restore-model" data-id="${item.id}" title="Restore model">
                                    <i class="bi bi-arrow-counterclockwise"></i> Restore
                                </button>
                            </td>`;
                            html += '</tr>';
                        });
                    } else {
                        const colspan = config.fields.length + 1;
                        html += `<tr><td colspan="${colspan}" class="text-center text-muted p-3">No deleted models found.</td></tr>`;
                    }

                    html += '</tbody></table>';

                    // Add pagination if needed
                    if (data.total_pages > 1) {
                        html += generatePagination(data.page, data.total_pages);
                    }

                    listContainer.html(html);

                    // Add event handlers for pagination
                    listContainer.find('.page-link').on('click', function(e) {
                        e.preventDefault();
                        const page = $(this).data('page');
                        if (page) {
                            loadListWithRestore({ ...config, page: page });
                        }
                    });

                    // Add restore functionality
                    listContainer.find('.restore-model').on('click', function() {
                        const id = $(this).data('id');
                        showConfirmationModal(
                            'Confirm Model Restoration',
                            'Are you sure you want to restore this model?',
                            function() {
                                $.ajax({
                                    url: '../admin/restore_model.php',
                                    type: 'POST',
                                    data: { id: id },
                                    dataType: 'json',
                                    success: function(response) {
                                        showInfoModal(
                                            response.success ? 'Success' : 'Error',
                                            response.message,
                                            response.success
                                        );
                                        if (response.success) {
                                            // Reload both lists after successful restoration
                                            setTimeout(() => {
                                                loadListWithRestore(config);
                                                loadList(modelConfig);
                                            }, 500);
                                        }
                                    },
                                    error: function(xhr, status, error) {
                                        console.error("Restore Error:", status, error);
                                        let errorMsg = 'Failed to restore model';
                                        if (xhr.responseText) {
                                            try {
                                                const response = JSON.parse(xhr.responseText);
                                                if (response.message) {
                                                    errorMsg = response.message;
                                                }
                                            } catch (e) {
                                                console.error("Error parsing response:", e);
                                            }
                                        }
                                        showInfoModal('Error', errorMsg, false);
                                    }
                                });
                            }
                        );
                    });
                } else {
                    showInfoModal('Error Loading Data', data.message || 'Failed to load deleted models list.', false);
                    listContainer.html(`<div class="alert alert-warning text-center m-3">Could not load deleted models. ${escapeHtml(data.message || '')}</div>`);
                }
            },
            error: function() {
                listContainer.html('<div class="alert alert-danger text-center m-3">Failed to load deleted models due to a network or server error.</div>');
            }
        });
    }
});