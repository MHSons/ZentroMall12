/* Inside existing cart_checkout.js (The submitOrder function) */

function generateWhatsAppLink(orderData) {
    // 1. Prepare Customer Name and Address
    const name = orderData.shippingAddress.name;
    const itemsList = orderData.items.map(item => `* ${item.name} (${item.quantity} PCs) @ ${item.price.toLocaleString()} PKR`).join('\n');
    const total = orderData.totalAmount.toLocaleString();
    const phone = '923001234567'; // Your Business WhatsApp Number

    // 2. The WhatsApp Message Text
    const messageTemplate = 
        `🎉 New Order Confirmed! - MAH Store 🎉
        
        Customer: ${name}
        
        --- Items Ordered ---
        ${itemsList}
        
        Total Amount: *${total} PKR*
        
        Shipping Address:
        ${orderData.shippingAddress.address}, City: ${orderData.shippingAddress.city}, Phone: ${orderData.shippingAddress.phone}
        
        We will process your order shortly. Thank you!`;

    // 3. Encode the message and return the URL
    const encodedMessage = encodeURIComponent(messageTemplate);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
}

// ... your existing submitOrder() function ...
async function submitOrder() {
    // ... (All existing logic for validation and API call) ...
    
    // --- NEW: WhatsApp Integration After Successful API Call ---
    // Assuming 'submitSuccess' is true and 'orderResponse' is the API result
    
    const API_SUCCESS = true; // Replace with your actual API check result
    const ORDER_DETAILS = { /* Get details from your API response or local cart */
        email: document.getElementById('checkout-email').value,
        totalAmount: getTotalAmount(),
        items: JSON.parse(localStorage.getItem('cart')),
        shippingAddress: {
            name: document.getElementById('checkout-name').value,
            phone: document.getElementById('checkout-phone').value,
            address: document.getElementById('checkout-address').value,
            city: document.getElementById('checkout-city').value,
        }
    };
    
    if (API_SUCCESS) {
        // Clear the cart
        localStorage.removeItem('cart');
        updateCartDisplay();
        
        // Generate WhatsApp link
        const whatsappLink = generateWhatsAppLink(ORDER_DETAILS);
        
        // Show confirmation and prompt user to open WhatsApp
        alert('Order placed successfully! You will now be redirected to WhatsApp for confirmation.');
        
        // Open WhatsApp chat in a new tab
        window.open(whatsappLink, '_blank');
        
        // Redirect to a Thank You page (or back to home)
        window.location.href = 'index.html'; 
    } else {
        // ... (Error handling) ...
    }
}
