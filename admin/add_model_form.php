<form id="add_model_form">
    <div class="mb-3">
        <label for="model_id" class="form-label">Model ID</label>
        <input type="text" class="form-control" id="model_id" name="model_id" required>
    </div>
    <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" name="name" required>
    </div>
    <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea class="form-control" id="description" name="description"></textarea>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" class="btn btn-primary">Add Model</button>
    </div>
</form>