/* File: cart_checkout.js */

// A simple placeholder array for product information (in a real app, this would come from a server)
const DUMMY_PRODUCTS = [
    { id: 'P101', name: 'Premium Laptop', price: 250000, img: 'placeholder-prod1.jpg' },
    { id: 'P102', name: 'Fashion Watch', price: 15000, img: 'placeholder-prod2.jpg' },
    { id: 'P103', name: 'Wireless Headphones', price: 8500, img: 'placeholder-prod3.jpg' }
    // Add more dummy products for testing:
];

const SHIPPING_COST = 500; // PKR

document.addEventListener('DOMContentLoaded', () => {
    // Re-use logic from main.js to get cart status
    let cartItems = JSON.parse(localStorage.getItem('mahStoreCart')) || [];

    // Function to calculate and update totals
    function renderAndCalculateCart() {
        const cartListWrapper = document.getElementById('cart-table-wrapper');
        const emptyMessage = document.getElementById('empty-cart-message');
        const summarySection = document.getElementById('cart-summary');
        
        if (cartItems.length === 0) {
            if (emptyMessage) emptyMessage.classList.remove('hidden');
            if (cartListWrapper) cartListWrapper.classList.add('hidden');
            if (summarySection) summarySection.classList.add('hidden');
            return;
        }

        if (emptyMessage) emptyMessage.classList.add('hidden');
        if (cartListWrapper) cartListWrapper.classList.remove('hidden');
        if (summarySection) summarySection.classList.remove('hidden');
        
        // Build the HTML table
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th colspan="2">مصنوعہ (Product)</th>
                        <th>قیمت (Price)</th>
                        <th>مقدار (Quantity)</th>
                        <th>کل رقم (Total)</th>
                        <th>حذف کریں (Remove)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let subTotal = 0;
        
        cartItems.forEach(item => {
            const product = DUMMY_PRODUCTS.find(p => p.id === item.id);
            if (!product) return; // Skip if product data is missing
            
            const itemTotal = product.price * item.quantity;
            subTotal += itemTotal;

            tableHTML += `
                <tr data-product-id="${item.id}">
                    <td class="item-details" colspan="2">
                        <img src="${product.img}" alt="${product.name}">
                        <span>${product.name}</span>
                    </td>
                    <td>PKR ${product.price.toLocaleString()}</td>
                    <td class="quantity-control">
                        <input type="number" min="1" value="${item.quantity}" data-item-id="${item.id}" class="quantity-input">
                    </td>
                    <td>PKR ${itemTotal.toLocaleString()}</td>
                    <td><button class="remove-btn" data-item-id="${item.id}">✖</button></td>
                </tr>
            `;
        });
        
        tableHTML += `</tbody></table>`;
        
        if (cartListWrapper) {
             cartListWrapper.innerHTML = tableHTML;
        }

        // Update Summary
        const grandTotal = subTotal + SHIPPING_COST;
        
        if (document.getElementById('sub-total')) {
            document.getElementById('sub-total').textContent = `PKR ${subTotal.toLocaleString()}`;
            document.getElementById('shipping-cost').textContent = `PKR ${SHIPPING_COST.toLocaleString()}`;
            document.getElementById('grand-total').textContent = `PKR ${grandTotal.toLocaleString()}`;
        }

        // Also update Checkout Summary if it exists (for checkout.html)
        if (document.getElementById('final-checkout-total')) {
            document.getElementById('final-checkout-total').textContent = `PKR ${grandTotal.toLocaleString()}`;
            // Render the small item list on checkout page
            const checkoutItemsList = document.getElementById('checkout-items-list');
            if (checkoutItemsList) {
                let listHTML = '<ul>';
                cartItems.forEach(item => {
                    const product = DUMMY_PRODUCTS.find(p => p.id === item.id);
                    if (product) {
                        listHTML += `<li>${product.name} (x${item.quantity}) - PKR ${(product.price * item.quantity).toLocaleString()}</li>`;
                    }
                });
                listHTML += `<li>ڈیلیوری: PKR ${SHIPPING_COST.toLocaleString()}</li></ul>`;
                checkoutItemsList.innerHTML = listHTML;
            }
        }
        
        // Add event listeners for quantity change and remove buttons
        attachEventListeners();
    }

    function attachEventListeners() {
        // 1. Quantity Update Listener (only for cart.html)
        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = e.target.dataset.itemId;
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity > 0) {
                    const itemIndex = cartItems.findIndex(item => item.id === itemId);
                    if (itemIndex > -1) {
                        cartItems[itemIndex].quantity = newQuantity;
                        localStorage.setItem('mahStoreCart', JSON.stringify(cartItems));
                        // Re-render the cart UI to show new totals
                        renderAndCalculateCart();
                    }
                } else {
                    // If quantity is 0 or less, automatically remove the item
                    removeItem(itemId);
                }
            });
        });
        
        // 2. Remove Button Listener
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                removeItem(itemId);
            });
        });
    }
    
    // Function to remove item from cart
    function removeItem(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('mahStoreCart', JSON.stringify(cartItems));
        renderAndCalculateCart(); // Re-render the cart
        updateMainCartCount();   // Update the header count
    }

    // Function to update the cart count in the header (from main.js logic)
    function updateMainCartCount() {
        const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        const cartCountSpan = document.getElementById('cart-count');
        if (cartCountSpan) {
            cartCountSpan.textContent = totalCount;
        }
    }
    
    // ----------------------------------------------------
    // CHECKOUT FORM SUBMISSION LOGIC (for checkout.html)
    // ----------------------------------------------------
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real application, all this data would be sent to the backend server
            
            // 1. Simple form validation (More advanced validation needed in a real app)
            if (!document.getElementById('full-name').value || !document.getElementById('email').value) {
                alert('براہ کرم تمام مطلوبہ فیلڈز پُر کریں (Please fill all required fields).');
                return;
            }
            
            // 2. Gather data
            const formData = new FormData(checkoutForm);
            const orderData = {
                shipping: {},
                payment_method: formData.get('payment_method'),
                items: cartItems,
                total: parseFloat(document.getElementById('final-checkout-total').textContent.replace('PKR ', '').replace(/,/g, '')) 
            };
            
            // Populate Shipping data (Example)
            orderData.shipping.fullName = formData.get('full-name');
            orderData.shipping.email = formData.get('email');
            // ... add all other fields

            // 3. Process Order (Send to Server/API)
            console.log('Order Data:', orderData);
            
            alert('آپ کا آرڈر کامیابی سے جمع کرایا گیا! (Your order has been placed successfully!)');
            
            // 4. Clear the cart after successful checkout
            localStorage.removeItem('mahStoreCart');
            cartItems = [];
            updateMainCartCount();
            
            // Redirect to a thank you page (optional)
            // window.location.href = 'thankyou.html';
        });
    }

    // Call the main render function on page load
    renderAndCalculateCart();
    updateMainCartCount();
});
