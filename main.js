// 'MAH Store' - Main E-commerce Frontend Script

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initial Product Data (Will be replaced by API call later)
    // For now, let's use dummy data to show functionality
    const dummyProducts = [
        { id: 1, name: "Premium Leather Wallet", price: 49.99, image: "product1.png" },
        { id: 2, name: "Noise Cancelling Headphones", price: 199.99, image: "product2.png" },
        { id: 3, name: "Smart Watch Elite", price: 129.50, image: "product3.png" },
        { id: 4, name: "Ergonomic Office Chair", price: 349.00, image: "product4.png" },
    ];

    const productListEl = document.getElementById('product-list');
    let cart = []; // Global cart state

    // --- 2. Core Function: Display Products on Home Screen ---
    const renderProducts = (products) => {
        if (!productListEl) return;

        productListEl.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <!-- In a real site, use product.image path -->
                <img src="https://via.placeholder.com/280x250?text=MAH_Item_${product.id}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">PKR ${product.price.toFixed(2)}</p>
                    <button class="btn-primary add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <a href="#" class="btn-secondary">View Details</a>
                </div>
            </div>
        `).join('');

        // Attach event listeners for Add to Cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });
    };
    
    // --- 3. Core Function: Handle Add to Cart ---
    const handleAddToCart = (e) => {
        const productId = parseInt(e.currentTarget.getAttribute('data-id'));
        const product = dummyProducts.find(p => p.id === productId);

        if (product) {
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            updateCartCount();
            alert(`${product.name} added to cart! Total items: ${cart.length}`);
        }
    };
    
    // --- 4. Core Function: Update Cart Count in Header ---
    const updateCartCount = () => {
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountEl.textContent = totalItems;
        }
    };
    
    // --- 5. Initial Load & Setup ---
    renderProducts(dummyProducts);
    updateCartCount();
    
    // Note: For advanced auto work, we would use 'fetch()' here to connect to our Node.js API.
    // fetch('/api/products').then(res => res.json()).then(data => renderProducts(data)).catch(console.error);

});
