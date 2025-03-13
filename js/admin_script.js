$(document).ready(function () {
    // Hàm chung để tải danh sách
    function loadList({ url, target, entity, fields, modalId }) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    let html = '<table class="table">';
                    html += `<thead><tr>${fields.map(f => `<th>${f}</th>`).join('')}<th>Actions</th></tr></thead>`;
                    html += '<tbody>';
                    data[entity].forEach(item => {
                        html += '<tr>';
                        fields.forEach(field => {
                            html += `<td>${$('<div/>').text(item[field.toLowerCase().replace(' ', '_')]).html()}</td>`;
                        });
                        html += `<td>
                            <button class="btn btn-sm btn-warning edit-${entity}" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#${modalId}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-${entity}" data-id="${item.id}">Delete</button>
                        </td>`;
                        html += '</tr>';
                    });
                    html += '</tbody></table>';
                    $(target).html(html);

                    // Sự kiện chỉnh sửa
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
                                    if (response.success) loadList({ url, target, entity, fields, modalId });
                                },
                                error: (xhr, status, error) => alert(`Failed to delete ${entity}: ${error}`)
                            });
                        }
                    });
                } else {
                    $(target).html(`<p class="text-danger">${data.message}</p>`);
                }
            },
            error: (xhr, status, error) => $(target).html(`<p class="text-danger">Failed to load ${entity}s. Status: ${status}, Error: ${error}</p>`)
        });
    }

    // Hàm lưu chỉnh sửa
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

    // Cấu hình danh sách
    const userConfig = {
        url: '../admin/get_users.php',
        target: '#user-list',
        entity: 'user',
        fields: ['ID', 'Username', 'Email', 'Created At'],
        modalId: 'editUserModal'
    };

    const modelConfig = {
        url: '../admin/get_models.php',
        target: '#model-list',
        entity: 'model',
        fields: ['ID', 'Model ID', 'Name', 'Description', 'Status'],
        modalId: 'editModelModal'
    };

    // Tải danh sách ban đầu
    loadList(userConfig);
    loadList(modelConfig);

    // Modal thêm mới
    ['User', 'Model'].forEach(entity => {
        $(`#add${entity}Modal`).on('show.bs.modal', function () {
            $(this).find('.modal-body').load(`../admin/add_${entity.toLowerCase()}_form.php`);
        });
    });

    // Lưu chỉnh sửa
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
    $('.togglePassword').on('click', function () {
        const input = $(this).prev('input');
        const icon = $(this).find('i');
        input.attr('type', input.attr('type') === 'password' ? 'text' : 'password');
        icon.toggleClass('bi-eye bi-eye-slash');
    });
});