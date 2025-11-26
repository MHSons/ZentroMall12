// File: admin/dashboard.php
// Main administrative control panel.

session_start();

// 1. Check if the admin is logged in, otherwise redirect to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.html");
    exit;
}

include('../db_connect.php'); // For database access

// --- Fetch Dashboard Summary Data ---
$total_products = $conn->query("SELECT COUNT(*) FROM products")->fetch_row()[0];
$total_orders = $conn->query("SELECT COUNT(*) FROM orders")->fetch_row()[0];
$total_revenue = $conn->query("SELECT SUM(total_amount) FROM orders WHERE status='Completed'")->fetch_row()[0];

?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - MAH Store</title>
    <link rel="stylesheet" href="admin.css"> <!-- Admin-specific CSS -->
</head>
<body>

    <div id="admin-sidebar" dir="rtl">
        <h2 class="logo-text">MAH Admin</h2>
        <nav>
            <ul>
                <li class="active"><a href="dashboard.php">Dashboard</a></li>
                <li><a href="orders.php">Manage Orders</a></li>
                <li><a href="products.php">Manage Products</a></li>
                <li><a href="users.php">Manage Users</a></li>
                <li><a href="logout.php">Logout</a></li>
            </ul>
        </nav>
    </div>

    <div id="admin-main-content">
        <h1>Welcome, Admin <?php echo htmlspecialchars($_SESSION["username"]); ?>!</h1>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Products</h3>
                <p class="stat-number"><?php echo $total_products; ?></p>
            </div>
            <div class="stat-card">
                <h3>Total Orders</h3>
                <p class="stat-number"><?php echo $total_orders; ?></p>
            </div>
            <div class="stat-card revenue-card">
                <h3>Total Revenue</h3>
                <p class="stat-number">PKR <?php echo number_format($total_revenue ?? 0); ?></p>
            </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <a href="orders.php?status=Pending" class="action-btn-admin">View New Orders</a>
            <a href="products.php?action=add" class="action-btn-admin">Add New Product</a>
        </div>
        
        <!-- Latest Orders (Example) -->
        <section class="latest-orders">
            <h2>Latest Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    // Fetch top 5 latest orders
                    $latest_orders_sql = "SELECT id, total_amount, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5";
                    $latest_orders_result = $conn->query($latest_orders_sql);
                    
                    if ($latest_orders_result->num_rows > 0) {
                        while($row = $latest_orders_result->fetch_assoc()) {
                            echo "<tr>";
                            echo "<td><a href='order_view.php?id=" . $row['id'] . "'>" . $row['id'] . "</a></td>";
                            echo "<td>PKR " . number_format($row['total_amount']) . "</td>";
                            echo "<td>" . $row['status'] . "</td>";
                            echo "<td>" . $row['created_at'] . "</td>";
                            echo "</tr>";
                        }
                    } else {
                        echo "<tr><td colspan='4'>No orders found.</td></tr>";
                    }
                    $conn->close();
                    ?>
                </tbody>
            </table>
        </section>
        
    </div>
</body>
</html>
