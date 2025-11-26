<?php
/* db_connect.php
   Example mysqli connection helper. Put actual credentials in server environment or a protected config file.
   NOTE: This file is a helper template. Don't commit real credentials to version control.
*/

$DB_HOST = 'localhost';
$DB_USER = 'dbuser';
$DB_PASS = 'dbpass';
$DB_NAME = 'ecomdb';
$DB_PORT = 3306;

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);
if ($mysqli->connect_errno) {
    error_log("MySQL Connection failed: " . $mysqli->connect_error);
    http_response_code(500);
    echo json_encode(['error' => 'Database connection error']);
    exit;
}
$mysqli->set_charset("utf8mb4");

/* Example usage:
   $stmt = $mysqli->prepare("SELECT id, name FROM products WHERE id = ?");
   $stmt->bind_param('i', $id);
   $stmt->execute();
   $res = $stmt->get_result();
*/
?>
