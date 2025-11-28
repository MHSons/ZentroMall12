let products = JSON.parse(localStorage.getItem("zm_products") || "[]");
let cart = JSON.parse(localStorage.getItem("zm_cart") || "[]");
let orders = JSON.parse(localStorage.getItem("zm_orders") || "[]");
let currentUser = JSON.parse(localStorage.getItem("zm_user") || "null");
let users = JSON.parse(localStorage.getItem("zm_users") || "[]");
let lang = localStorage.getItem("zm_lang") || "en";
let wishlist = JSON.parse(localStorage.getItem("zm_wishlist") || "[]");
let viewed = JSON.parse(localStorage.getItem("zm_viewed") || "[]");
const flashDeals = [
  {id:1, discount:30, timeLeft:"2h 15m"},
  {id:3, discount:25, timeLeft:"5h 30m"}
];

if (products.length === 0) {
  products = [
    {id:1,name:"iPhone 15 Pro",price:129900,image:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-blacktitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692846357731",desc:"Titanium • A17 Pro",category:"electronics"},
    {id:2,name:"MacBook Pro M3",price:239900,image:"https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290",desc:"Space Black • 48GB RAM",category:"electronics"},
    {id:3,name:"Samsung S24 Ultra",price:134999,image:"https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-ultra-sm-s928bztqins-539574-sm-s928bztqins-571363123?$650_519_PNG$",desc:"200MP Camera",category:"electronics"},
    {id:4,name:"Levi's Jeans",price:4999,image:"https://via.placeholder.com/400/000000/FFFFFF?text=Levi's+Jeans",desc:"Classic Fit",category:"fashion"}
  ];
  localStorage.setItem("zm_products", JSON.stringify(products));
}

function saveData() {
  localStorage.setItem("zm_products", JSON.stringify(products));
  localStorage.setItem("zm_cart", JSON.stringify(cart));
  localStorage.setItem("zm_orders", JSON.stringify(orders));
  localStorage.setItem("zm_users", JSON.stringify(users));
  localStorage.setItem("zm_user", JSON.stringify(currentUser));
  localStorage.setItem("zm_wishlist", JSON.stringify(wishlist));
  localStorage.setItem("zm_viewed", JSON.stringify(viewed));
}

function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty++; else cart.push({id, qty:1});
  saveData(); updateCartCount(); alert(lang === "ur" ? "کارٹ میں شامل ہو گیا!" : "Added to Cart!");
}

function updateCartCount() {
  const total = cart.reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll("#cart-count").forEach(el=>el.textContent=total);
}

function loadFeatured() {
  const div = document.getElementById("featured");
  if (!div) return;
  div.innerHTML = products.slice(0,8).map(p => {
    const deal = flashDeals.find(d => d.id === p.id);
    const price = deal ? p.price * (1 - deal.discount / 100) : p.price;
    return `
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover-grow" role="article">
        <img src="${p.image}" alt="${p.name}" class="w-full h-64 object-cover">
        ${deal ? `<div class="bg-red-600 text-white p-2 text-sm font-bold">-${deal.discount}%</div>` : ""}
        <div class="p-6">
          <h3 class="text-xl font-bold">${p.name}</h3>
          <p class="text-gray-600 dark:text-gray-300">${p.desc}</p>
          <p class="text-3xl font-bold text-indigo-600 my-4">₹${price.toLocaleString()} ${deal ? `<span class="line-through text-gray-400">₹${p.price.toLocaleString()}</span>` : ""}</p>
          <button onclick="addToCart(${p.id})" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg">Add to Cart</button>
        </div>
      </div>`;
  }).join("");
}

function loadRecentlyViewed() {
  const div = document.getElementById("recently-viewed");
  if (!div) return;
  div.innerHTML = viewed.map(id => {
    const p = products.find(x => x.id === id);
    return p ? `
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover-grow">
        <img src="${p.image}" alt="${p.name}" class="w-full h-64 object-cover">
        <div class="p-6">
          <h3 class="text-xl font-bold">${p.name}</h3>
          <p class="text-gray-600 dark:text-gray-300">${p.desc}</p>
          <p class="text-3xl font-bold text-indigo-600 my-4">₹${p.price.toLocaleString()}</p>
        </div>
      </div>` : "";
  }).join("") || "<p class='text-center text-2xl'>No recently viewed items</p>";
}

function toggleWishlist(id) {
  if (!currentUser) return alert(lang === "ur" ? "لاگ ان کریں" : "Please login");
  if (wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
  else wishlist.push(id);
  saveData();
  alert(wishlist.includes(id) ? lang === "ur" ? "❤️ خواہشات میں شامل" : "❤️ Added to Wishlist" : lang === "ur" ? "ہٹا دیا گیا" : "Removed from Wishlist");
}

function buyNow(id) {
  if (!currentUser) return alert(lang === "ur" ? "لاگ ان کریں" : "Please login");
  if (confirm(lang === "ur" ? "COD آرڈر کی تصدیق کریں؟\nہم 5 منٹ میں کال کریں گے" : "Confirm COD Order?\nWe will call you in 5 minutes for confirmation")) {
    const p = products.find(x => x.id === id);
    const msg = `*Instant COD Order*\nProduct: ${p.name}\nPrice: ₹${p.price.toLocaleString()}\nCustomer: ${currentUser.name} (${currentUser.phone})\nVia ZentroMall`;
    window.open("https://wa.me/919876543210?text=" + encodeURIComponent(msg));
    alert(lang === "ur" ? "آرڈر رکھ دیا گیا!" : "Order placed!");
  }
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("zm_theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
}
function loadTheme() { if (localStorage.getItem("zm_theme") === "dark") document.documentElement.classList.add("dark"); }

function toggleLang() {
  lang = lang === "en" ? "ur" : "en";
  localStorage.setItem("zm_lang", lang);
  loadLang();
}
function loadLang() {
  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    el.textContent = lang === "ur" ? urdu[key] : english[key];
  });
}
const english = { welcome: "Welcome", shop: "Shop Now", cart: "Cart", login: "Login" };
const urdu = { welcome: "خوش آمدید", shop: "ابھی خریداری کریں", cart: "کارٹ", login: "لاگ ان" };

function acceptConsent() {
  localStorage.setItem("zm_consent", "accepted");
  document.getElementById("consent").classList.add("hidden");
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else { saveData(); renderCart(); updateCartCount(); }
  }
}
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveData(); renderCart(); updateCartCount();
}

document.addEventListener("DOMContentLoaded", () => { updateCartCount(); loadTheme(); loadLang(); });
