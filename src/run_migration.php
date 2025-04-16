<?php
require_once 'db_connect.php';

function executeMigration($conn, $sqlFile) {
    // Read SQL file
    $sql = file_get_contents($sqlFile);
    
    // Split into individual queries
    $queries = array_filter(array_map('trim', explode(';', $sql)));
    
    // Start transaction
    mysqli_begin_transaction($conn);
    
    try {
        foreach ($queries as $query) {
            if (empty($query)) continue;
            
            // Execute each query
            if (!mysqli_query($conn, $query)) {
                $error = mysqli_error($conn);
                $errorCode = mysqli_errno($conn);
                
                // Log the error
                error_log("Migration error: " . $error . " (Code: " . $errorCode . ")");
                error_log("Failed query: " . $query);
                
                throw new Exception("Error executing query: " . $error . "\nQuery: " . $query);
            }
            
            // Log successful query
            error_log("Successfully executed: " . substr($query, 0, 100) . "...");
        }
        
        // If we get here, commit the transaction
        mysqli_commit($conn);
        echo "Migration completed successfully!\n";
        
    } catch (Exception $e) {
        // If there's an error, rollback the transaction
        mysqli_rollback($conn);
        echo "Migration failed: " . $e->getMessage() . "\n";
        
        // Provide more detailed error information
        echo "\nTroubleshooting tips:\n";
        echo "1. Check if any foreign key constraints exist on the 'model' column\n";
        echo "2. Verify that the 'models' table exists and has the correct structure\n";
        echo "3. Ensure you have sufficient privileges to modify the tables\n";
        echo "4. Check if there are any existing indexes that might conflict\n";
    }
}

// Execute the migration
$migrationFile = __DIR__ . '/../migrations/01_add_model_foreign_key.sql';
if (file_exists($migrationFile)) {
    executeMigration($conn, $migrationFile);
} else {
    echo "Migration file not found: " . $migrationFile . "\n";
}

mysqli_close($conn);
?> 