// File: admin/orders.php
// Allows admin to view and update order statuses.

session_start();
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.html");
    exit;
}

include('../db_connect.php'); 
$message = "";

// --- Handle Order Status Update ---
if(isset($_POST['update_status'])){
    $order_id = (int)$_POST['order_id'];
    $new_status = $conn->real_escape_string($_POST['new_status']);
    
    $sql = "UPDATE orders SET status = '$new_status' WHERE id = $order_id";
    if($conn->query($sql)){
        $message = "<div class='success'>Order #$order_id status updated to $new_status.</div>";
    } else {
        $message = "<div class='error'>Error updating status: " . $conn->error . "</div>";
    }
}

// Fetch all orders
$orders_result = $conn->query("SELECT * FROM orders ORDER BY created_at DESC");
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <title>Manage Orders - MAH Admin</title>
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <?php include('sidebar.php'); ?> 

    <div id="admin-main-content">
        <h1>Order Management</h1>
        <?php echo $message; ?>

        <section class="admin-table-section">
            <h3>All Customer Orders</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer Email</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Order Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($row = $orders_result->fetch_assoc()): ?>
                    <tr>
                        <td><?= $row['id'] ?></td>
                        <td><?= htmlspecialchars($row['customer_email']) ?></td>
                        <td>PKR <?= number_format($row['total_amount']) ?></td>
                        <td>
                            <!-- Status Update Form in table -->
                            <form action="orders.php" method="POST" style="display:inline-flex; align-items:center;">
                                <input type="hidden" name="order_id" value="<?= $row['id'] ?>">
                                <select name="new_status" class="status-select">
                                    <option value="Pending" <?= $row['status'] == 'Pending' ? 'selected' : '' ?>>Pending</option>
                                    <option value="Processing" <?= $row['status'] == 'Processing' ? 'selected' : '' ?>>Processing</option>
                                    <option value="Shipped" <?= $row['status'] == 'Shipped' ? 'selected' : '' ?>>Shipped</option>
                                    <option value="Completed" <?= $row['status'] == 'Completed' ? 'selected' : '' ?>>Completed</option>
                                    <option value="Cancelled" <?= $row['status'] == 'Cancelled' ? 'selected' : '' ?>>Cancelled</option>
                                </select>
                                <button type="submit" name="update_status" class="action-btn-admin small">Update</button>
                            </form>
                        </td>
                        <td><?= date('Y-m-d', strtotime($row['created_at'])) ?></td>
                        <td><a href="order_view.php?id=<?= $row['id'] ?>" class="action-btn-admin view-btn">View Details</a></td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </section>
        
    </div>
</body>
</html>
<?php $conn->close(); ?>
