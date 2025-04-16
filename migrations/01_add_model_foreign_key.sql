-- Step 1: Add deleted_at column to models table
ALTER TABLE models
ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL;

-- Step 2: Drop any existing foreign key constraints on the model column
SET @constraint_name = (
    SELECT CONSTRAINT_NAME 
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'image_history' 
    AND COLUMN_NAME = 'model'
    AND REFERENCED_TABLE_NAME IS NOT NULL
    LIMIT 1
);

SET @sql = IF(@constraint_name IS NOT NULL,
    CONCAT('ALTER TABLE image_history DROP FOREIGN KEY ', @constraint_name),
    'SELECT "No foreign key to drop"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 3: Rename model column to model_identifier_snapshot
ALTER TABLE image_history
CHANGE COLUMN model model_identifier_snapshot VARCHAR(255);

-- Step 4: Add model_id_fk column to image_history
ALTER TABLE image_history
ADD COLUMN model_id_fk INT;

-- Step 5: Update model_id_fk based on existing model_identifier_snapshot values
UPDATE image_history ih
JOIN models m ON ih.model_identifier_snapshot = m.model_id
SET ih.model_id_fk = m.id;

-- Step 6: Add foreign key constraint
ALTER TABLE image_history
ADD CONSTRAINT fk_image_history_model
FOREIGN KEY (model_id_fk) REFERENCES models(id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- Step 7: Add index on model_id_fk for better performance
ALTER TABLE image_history
ADD INDEX idx_model_id_fk (model_id_fk);

-- Step 8: Add index on deleted_at for better performance when filtering
ALTER TABLE models
ADD INDEX idx_deleted_at (deleted_at); 