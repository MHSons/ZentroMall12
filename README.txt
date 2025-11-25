Ehsan Collection - static demo site (frontend-only)
Files:
- index.html
- style.css
- main.js
- admin.html
- admin.css
- admin.js
- dashboard.html
- dashboard.css
- dashboard.js
- assets/ (place product images here)
- logo.png  (place your logo file here, exact name 'logo.png')

How it works (static):
- All data (products, banks, admins, orders, cart) are saved in browser localStorage.
- Admin login default: username: admin password: 12345 (change via Admins panel)
- Admin dashboard allows adding/editing/deleting products and banks, viewing orders and downloading CSV.
- Checkout opens WhatsApp with order details. Customer fills name & phone at checkout (no account needed).
- To make persistent/secure, integrate these operations with a server & database (recommended for production).

Performance tips:
- Serving many large images locally can slow the site. Resize product images to web sizes (<= 1200px) and use compressed JPEG/WEBP.
- Replace Tailwind CDN with a compiled Tailwind CSS file (PostCSS) and serve the CSS locally for faster load.
