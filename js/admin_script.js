$(document).ready(function () {
    // Hàm chung để tải danh sách với phân trang và limit có thể thay đổi
    function loadList({ url, target, entity, fields, modalId, page = 1, limit = 10 }) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            data: { page: page, limit: limit }, // gửi cả page và limit
            success: function (data) {
                if (data.success) {
                    let html = '<table class="table">';
                    html += `<thead><tr>${fields.map(f => `<th>${f}</th>`).join('')}${entity !== 'invoice' ? '<th>Actions</th>' : ''}</tr></thead>`;
                    html += '<tbody>';
                    data[entity].forEach(item => {
                        html += '<tr>';
                        fields.forEach(field => {
                            let value;
                            // Nếu entity là user, kiểm tra các cột premium
                            if (entity === 'user') {
                                if (field === 'Is Premium') {
                                    value = item.isPremium;
                                    value = value && value.toLowerCase() === 'yes' ? 'Yes' : 'No';
                                } else if (field === 'Start Premium') {
                                    value = item.startPremium || '-';
                                } else if (field === 'End Premium') {
                                    value = item.endPremium || '-';
                                } else {
                                    value = item[field.toLowerCase().replace(' ', '_')] || '-';
                                }
                            } else {
                                // Với các entity khác (model, invoice) giả định key đặt tên theo định dạng chữ thường và dấu gạch dưới
                                value = item[field.toLowerCase().replace(' ', '_')] || '-';
                            }
                            html += `<td>${$('<div/>').text(value).html()}</td>`;
                        });
                        
                        // Chỉ render cột Actions nếu entity không phải invoice
                        if (entity !== 'invoice') {
                            html += `<td>
                                <button class="btn btn-sm btn-warning edit-${entity}" data-id="${item.id || item.invoice_id}" data-bs-toggle="modal" data-bs-target="#${modalId}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-${entity}" data-id="${item.id || item.invoice_id}">Delete</button>
                            </td>`;
                        }
                        html += '</tr>';
                    });
                    html += '</tbody></table>';

                    // Thêm phân trang nếu có nhiều hơn 1 trang
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

                    // Đăng ký sự kiện cho các nút phân trang
                    $(target).find('.pagination a.page-link').on('click', function(e){
                        e.preventDefault();
                        const newPage = $(this).data('page');
                        loadList({ url, target, entity, fields, modalId, page: newPage, limit: limit });
                    });

                    // Sự kiện chỉnh sửa (chỉ áp dụng cho user và model)
                    if (entity !== 'invoice') {
                        $(`.edit-${entity}`).on('click', function () {
                            const id = $(this).data('id');
                            $(`#${modalId}`).data(`${entity}-id`, id);
                            $.get(`../admin/edit_${entity}_form.php?id=${id}`, data => {
                                $(`#${modalId} .modal-body`).html(data);
                            });
                        });

                        // Sự kiện xóa
                        $(`.delete-${entity}`).on('click', function () {
                            const id = $(this).data('id');
                            if (confirm(`Are you sure you want to delete this ${entity}?`)) {
                                $.ajax({
                                    url: `../admin/delete_${entity}.php`,
                                    type: 'POST',
                                    data: { id },
                                    dataType: 'json',
                                    success: response => {
                                        alert(response.success ? `${entity.charAt(0).toUpperCase() + entity.slice(1)} deleted successfully!` : `Failed to delete ${entity}: ${response.message}`);
                                        if (response.success) loadList({ url, target, entity, fields, modalId, page: page, limit: limit });
                                    },
                                    error: (xhr, status, error) => alert(`Failed to delete ${entity}: ${error}`)
                                });
                            }
                        });
                    }
                } else {
                    $(target).html(`<p class="text-danger">${data.message}</p>`);
                }
            },
            error: (xhr, status, error) => $(target).html(`<p class="text-danger">Failed to load ${entity}s. Status: ${status}, Error: ${error}</p>`)
        });
    }

    // Hàm lưu chỉnh sửa (không thay đổi cho user và model)
    function saveEdit({ modalId, entity, formId, url, reloadFn }) {
        $(`#saveEdit${entity.charAt(0).toUpperCase() + entity.slice(1)}`).on('click', function () {
            const modal = $(`#${modalId}`);
            const formData = $(`#${formId}`).serialize();
            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                dataType: 'json',
                success: response => {
                    alert(response.success ? `${entity.charAt(0).toUpperCase() + entity.slice(1)} updated successfully!` : `Failed to update ${entity}: ${response.message}`);
                    if (response.success) {
                        modal.modal('hide');
                        reloadFn();
                    }
                },
                error: (xhr, status, error) => alert(`Failed to update ${entity}: ${error}`)
            });
        });
    }

    // Cấu hình ban đầu cho danh sách (lấy limit từ dropdown)
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
        fields: ['Invoice ID', 'Customer Name', 'Total Price', 'Created At'],
        // Không cần modal cho invoice vì không có chức năng edit
        modalId: '',
        page: 1,
        limit: parseInt($('#invoiceLimit').val())
    };

    // Tải danh sách ban đầu cho các entity
    loadList(userConfig);
    loadList(modelConfig);
    loadList(invoiceConfig);

    // Sự kiện khi thay đổi số mục hiển thị trong dropdown
    $('#userLimit').on('change', function() {
        userConfig.limit = parseInt($(this).val());
        userConfig.page = 1; // reset về trang đầu tiên
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

    // Modal thêm mới cho các entity (Invoice không cần edit nên chỉ load modal add nếu cần)
    ['User', 'Model', 'Invoice'].forEach(entity => {
        $(`#add${entity}Modal`).on('show.bs.modal', function () {
            $(this).find('.modal-body').load(`../admin/add_${entity.toLowerCase()}_form.php`);
        });
    });

    // Lưu chỉnh sửa cho user và model (không có cho invoice)
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

    // Toggle password (nếu có)
    $('.togglePassword').on('click', function () {
        const input = $(this).prev('input');
        const icon = $(this).find('i');
        input.attr('type', input.attr('type') === 'password' ? 'text' : 'password');
        icon.toggleClass('bi-eye bi-eye-slash');
    });
});
