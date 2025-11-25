/* js/products.js */
document.addEventListener('DOMContentLoaded', async () => {
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  const cartBtn = document.getElementById('cartBtn');
  const cartModal = document.getElementById('cartModal');
  const cartClose = document.getElementById('cartClose');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const stripeCheckoutBtn = document.getElementById('stripeCheckout');
  const bankCheckoutBtn = document.getElementById('bankCheckout');
  const waCheckout = document.getElementById('waCheckout');

  const productModal = document.getElementById('productModal');
  const productModalClose = document.getElementById('productModalClose');
  const productDetail = document.getElementById('productDetail');

  let products = [];
  let cart = JSON.parse(localStorage.getItem('ec_cart') || '{}');

  // load products from data file (fall back to inline if fails)
  try {
    const res = await fetch('data/products.json');
    products = await res.json();
  } catch (err) {
    console.error('Could not load products.json, falling back to defaults', err);
    products = [
      { id: 'p1', name: 'Ehsan Shirt', price: 1200, images: ['images/product1.jpg'], category:'Clothing', description:'Default' }
    ];
  }

  // populate categories
  const categories = Array.from(new Set(products.map(p => p.category || 'Uncategorized')));
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    categoryFilter.appendChild(opt);
  });

  function renderProducts(list){
    productsGrid.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product';
      card.innerHTML = `
        <img src="${p.images?.[0] || 'images/product1.jpg'}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="price">${p.price} PKR</div>
          <div class="desc">${(p.description||'').slice(0,80)}</div>
        </div>
        <div class="actions">
          <button class="btn view" data-id="${p.id}">View</button>
          <button class="btn add" data-id="${p.id}">Add</button>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  }

  function applyFilters(){
    const q = (searchInput.value || '').toLowerCase();
    const cat = categoryFilter.value;
    const filtered = products.filter(p => {
      return (p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q))
        && (cat ? p.category === cat : true);
    });
    renderProducts(filtered);
  }

  renderProducts(products);
  applyFilters();

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);

  // product click handling
  productsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const id = btn.dataset.id;
    const prod = products.find(p => p.id === id);
    if(btn.classList.contains('add')){
      addToCart(prod);
    } else if(btn.classList.contains('view')){
      openProductModal(prod);
    }
  });

  function openProductModal(p){
    productDetail.innerHTML = `
      <h2>${p.name}</h2>
      <div style="display:flex;gap:12px;">
        <img src="${p.images?.[0]||'images/product1.jpg'}" style="width:220px;height:auto" />
        <div>
          <p>${p.description || ''}</p>
          <p><strong>${p.price} PKR</strong></p>
          <button class="btn add" data-id="${p.id}">Add to cart</button>
        </div>
      </div>
    `;
    productModal.classList.remove('hidden');
  }

  productModalClose.addEventListener('click', ()=> productModal.classList.add('hidden'));

  // Cart functions
  function addToCart(p){
    cart[p.id] = cart[p.id] || {...p, qty:0};
    cart[p.id].qty++;
    saveCart();
    updateCartUI();
  }

  function saveCart(){ localStorage.setItem('ec_cart', JSON.stringify(cart)); }
  function updateCartUI(){
    cartItemsEl.innerHTML = '';
    let total=0, count=0;
    Object.values(cart).forEach(i=>{
      total += i.price * i.qty;
      count += i.qty;
      cartItemsEl.innerHTML += `<div>${i.name} x${i.qty} — ${i.price*i.qty} PKR</div>`;
    });
    cartTotalEl.textContent = total;
    cartCountEl.textContent = count;
  }
  updateCartUI();

  cartBtn.onclick = ()=> cartModal.classList.remove('hidden');
  cartClose.onclick = ()=> cartModal.classList.add('hidden');

  // Stripe: call serverless endpoint to create session
  stripeCheckoutBtn.addEventListener('click', async ()=>{
    // Prepare line items
    const line_items = Object.values(cart).map(i=>({
      price_data: {
        currency: 'pkr',
        product_data: { name: i.name },
        unit_amount: Math.round(i.price * 100) // PKR cents (Stripe expects smallest currency unit)
      },
      quantity: i.qty
    }));
    if(line_items.length===0){ alert('Cart is empty'); return; }

    // Call serverless create-checkout-session
    try {
      const res = await fetch('/api/create-checkout-session', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ line_items, success_url: window.location.origin + '/success.html', cancel_url: window.location.href })
      });
      const data = await res.json();
      if(data.url){ window.location = data.url; } else { alert('Error starting Stripe Checkout'); console.error(data); }
    } catch (err){
      console.error(err); alert('Unable to start Stripe checkout. Check console and serverless function.');
    }
  });

  // Bank transfer: show simple instructions + order summary
  bankCheckoutBtn.addEventListener('click', ()=>{
    const bankDetails = `Bank: ABC Bank\nAccount Title: Ehsan Collection\nAccount No: 1234567890\nIBAN: PK00ABCD1234567890\n\nPlease send payment proof to WhatsApp +92XXXXXXXXXX and include your order details.`;
    const order = Object.values(cart).map(i=>`${i.name} x${i.qty} = ${i.price*i.qty} PKR`).join('\n');
    alert(bankDetails + '\n\nOrder:\n' + order + '\n\nTotal: ' + cartTotalEl.textContent + ' PKR');
  });

  // WhatsApp checkout link
  waCheckout.addEventListener('click', ()=>{
    const orderText = encodeURIComponent(Object.values(cart).map(i=>`${i.name} x${i.qty} = ${i.qty*i.price}`).join('\n') + `\nTotal: ${cartTotalEl.textContent} PKR`);
    waCheckout.href = `https://wa.me/923018067880?text=${orderText}`;
  });
});
