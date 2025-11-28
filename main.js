// ======================== ZentroMall - Full Advanced main.js ========================

let products = JSON.parse(localStorage.getItem("zm_products") || "[]");
let cart = JSON.parse(localStorage.getItem("zm_cart") || "[]");
let orders = JSON.parse(localStorage.getItem("zm_orders") || "[]");
let banners = JSON.parse(localStorage.getItem("zm_banners") || "[]");

// پہلی دفعہ ڈیفالٹ پروڈکٹس اور پاس ورڈ
if (!localStorage.getItem("zm_admin_pass")) localStorage.setItem("zm_admin_pass", "asad123");
if (products.length === 0) {
  products = [
    {id:1, name:"iPhone 15 Pro Max", price:429999, image:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80", desc:"PTA Approved - Official"},
    {id:2, name:"Samsung S24 Ultra", price:389999, image:"https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-ultra-sm-s928bztqins-539574-sm-s928bztqins-571363123?$650_519_PNG$", desc:"1 Year Official Warranty"}
  ];
  localStorage.setItem("zm_products", JSON.stringify(products));
}

// WhatsApp نمبر (اپنا ڈال دو)
const whatsappNumber = "923001234567"; // ← یہاں اپنا نمبر ڈالو

// ======================== Utility Functions ========================
function saveData() {
  localStorage.setItem("zm_products", JSON.stringify(products));
  localStorage.setItem("zm_cart", JSON.stringify(cart));
  localStorage.setItem("zm_orders", JSON.stringify(orders));
  localStorage.setItem("zm_banners", JSON.stringify(banners));
}

function formatPrice(p) {
  return "₨" + Number(p).toLocaleString("en-PK");
}

function openWhatsApp(msg) {
  const encoded = encodeURIComponent(msg);
  window.location.href = `whatsapp://send?phone=${whatsappNumber}&text=${encoded}`;
  setTimeout(() => window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank'), 1000);
}

function handleImageUpload(event, callback) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => callback(e.target.result);
  reader.readAsDataURL(file);
}

// ======================== Cart Functions ========================
function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty++;
  else cart.push({id, qty: 1});
  saveData();
  updateCartCount();
  alert("Added to Cart!");
}

function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = total);
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveData();
  updateCartCount();
}

// ======================== Order Functions ========================
function placeOrder(e) {
  e.preventDefault();
  const name = document.getElementById("name")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const address = document.getElementById("address")?.value.trim();

  if (!name || !phone || !address) {
    alert("Please fill all fields!");
    return;
  }

  let total = 0;
  let msg = `*New Order - ZentroMall*\n\n`;
  msg += `Name: ${name}\nPhone: ${phone}\nAddress: ${address}\n\n*Order Details:*\n`;

  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    if (p) {
      total += p.price * item.qty;
      msg += `• ${p.name} × ${item.qty} = ${formatPrice(p.price * item.qty)}\n`;
    }
  });

  msg += `\n*Total Amount:* ${formatPrice(total)}\nThank you!`;

  // Save order
  orders.push({
    date: new Date().toLocaleString("en-PK"),
    items: cart.map(c => ({...c, name: products.find(p => p.id === c.id)?.name || "Unknown"})),
    total,
    customer: {name, phone, address},
    status: "pending",
    tracking_id: ""
  });

  saveData();
  cart = [];
  localStorage.setItem("zm_cart", "[]");
  updateCartCount();
  alert("Order Placed Successfully! Redirecting to WhatsApp...");
  openWhatsApp(msg);
}

// ======================== Page Load ========================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // اگر products.html یا index.html ہے تو پروڈکٹس دکھاؤ
  if (document.getElementById("featured") || document.getElementById("allProducts")) {
    renderProducts();
  }

  // Banner لوڈ کرو
  if (document.getElementById("topBanner")) {
    if (banners.length > 0) {
      document.getElementById("bannerText").innerHTML = banners.map(t => "   " + t + "   |   ").join("");
    } else {
      document.getElementById("topBanner").style.display = "none";
    }
  }
});

// ======================== Render Products (Home + Products Page) ========================
function renderProducts() {
  const featured = document.getElementById("featured");
  const allProducts = document.getElementById("allProducts");

  const productHTML = (p) => `
    <div class="bg-white text-black rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition">
      ${p.image.startsWith("data:video") 
        ? `<video src="${p.image}" class="w-full h-64 object-cover" controls></video>`
        : `<img src="${p.image}" class="w-full h-64 object-cover" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">`
      }
      <div class="p-6">
        <h3 class="text-xl font-bold">${p.name}</h3>
        <p class="text-gray-600 text-sm mt-1">${p.desc || ""}</p>
        <p class="text-3xl font-bold text-green-600 my-4">${formatPrice(p.price)}</p>
        <button onclick="addToCart(${p.id})" class="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">
          Add to Cart
        </button>
      </div>
    </div>`;

  if (featured) {
    featured.innerHTML = products.slice(0, 8).map(productHTML).join("");
  }
  if (allProducts) {
    allProducts.innerHTML = products.map(productHTML).join("");
  }
}

// ======================== Admin Panel Helper Functions (اگر admin-panel.html کھلا ہو) ========================
if (window.location.pathname.includes("admin-panel.html")) {
  window.loadOrders = function() { /* admin-panel.html میں خود ہے */ };
  window.loadProducts = function() { /* admin-panel.html میں خود ہے */ };
}

// ======================== Final Export ========================
console.log("ZentroMall Engine Loaded - Full Advanced Version 2025");
