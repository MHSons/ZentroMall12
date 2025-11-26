// File: admin/products.php
// Allows admin to manage (Add, Edit, Delete) products.

session_start();
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.html");
    exit;
}

include('../db_connect.php'); 
$message = "";

// --- Handle Form Submissions (Add/Edit/Delete) ---
if($_SERVER["REQUEST_METHOD"] == "POST"){
    
    // Simple way to route different actions based on a hidden field
    if(isset($_POST['action']) && $_POST['action'] == 'add_product'){
        $name = $conn->real_escape_string($_POST['name']);
        $price = (float)$_POST['price'];
        $category = $conn->real_escape_string($_POST['category']);
        // Image handling logic would be much more complex here (uploads, renaming, etc.)
        $image_url = $conn->real_escape_string($_POST['image_url']); 
        $stock = (int)$_POST['stock'];
        
        $sql = "INSERT INTO products (name, price, category, image_url, stock_quantity) 
                VALUES ('$name', $price, '$category', '$image_url', $stock)";
        
        if($conn->query($sql)){
            $message = "<div class='success'>Product added successfully!</div>";
        } else {
            $message = "<div class='error'>Error adding product: " . $conn->error . "</div>";
        }
    }
    // ... ADD more logic for 'edit_product' and 'delete_product' ...
}

// Fetch all products for display
$products_result = $conn->query("SELECT * FROM products ORDER BY id DESC");
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <title>Manage Products - MAH Admin</title>
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <?php include('sidebar.php'); // Sidebar is separated for easy inclusion ?> 

    <div id="admin-main-content">
        <h1>Product Management</h1>
        <?php echo $message; ?>

        <!-- PRODUCT ADD FORM -->
        <section class="admin-form-section">
            <h3>Add New Product</h3>
            <form action="products.php" method="POST" class="simple-form">
                <input type="hidden" name="action" value="add_product">
                
                <div class="form-group-admin">
                    <label>Product Name:</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group-admin">
                    <label>Price (PKR):</label>
                    <input type="number" name="price" min="1" step="0.01" required>
                </div>
                <!-- ... other fields ... -->
                <div class="form-group-admin">
                    <label>Category:</label>
                    <input type="text" name="category" required>
                </div>
                 <div class="form-group-admin">
                    <label>Image URL:</label>
                    <input type="text" name="image_url" placeholder="e.g. placeholder-prod1.jpg">
                </div>
                <div class="form-group-admin">
                    <label>Stock Quantity:</label>
                    <input type="number" name="stock" min="0" required>
                </div>
                
                <button type="submit" class="submit-btn-admin primary-btn-admin">Add Product</button>
            </form>
        </section>

        <!-- PRODUCT LIST TABLE -->
        <section class="admin-table-section">
            <h3>Existing Products</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($row = $products_result->fetch_assoc()): ?>
                    <tr>
                        <td><?= $row['id'] ?></td>
                        <td><?= htmlspecialchars($row['name']) ?></td>
                        <td><?= number_format($row['price']) ?></td>
                        <td><?= $row['category'] ?></td>
                        <td><?= $row['stock_quantity'] ?></td>
                        <td>
                            <a href="product_edit.php?id=<?= $row['id'] ?>" class="action-btn-admin">Edit</a>
                            <a href="?action=delete&id=<?= $row['id'] ?>" class="action-btn-admin delete-btn">Delete</a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </section>
        
    </div>
</body>
</html>
<?php $conn->close(); ?>
