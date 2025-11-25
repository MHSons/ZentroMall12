// dashboard.js — reads orders from localStorage (ORDERS_KEY) and allows export as CSV
const ORDERS_KEY = "ehsan_orders_v1";

function loadOrders(){ return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"); }

function renderOrders(){
  const orders = loadOrders();
  const tbody = document.querySelector("#orders-table tbody");
  tbody.innerHTML = "";
  orders.slice().reverse().forEach(o=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><a href="#" class="view-order" data-id="${o.id}">${o.id}</a></td><td>${(new Date(o.date)).toLocaleString()}</td><td>${o.customer.name} (${o.customer.phone})</td><td>${o.total}</td><td>${o.status}</td>`;
    tbody.appendChild(tr);
  });
  document.querySelectorAll(".view-order").forEach(a=> a.addEventListener("click", (e)=>{
    e.preventDefault(); const id = a.getAttribute("data-id"); showOrderDetail(id);
  }));
}

function showOrderDetail(id){
  const orders = loadOrders();
  const o = orders.find(x=>x.id===id);
  const el = document.getElementById("order-detail");
  if(!o){ el.textContent = "Order not found"; return; }
  el.textContent = JSON.stringify(o, null, 2);
}

function exportOrdersCSV(){
  const orders = loadOrders();
  if(orders.length===0){ alert("No orders to export"); return; }
  // Basic CSV: one line per order with items concatenated
  const rows = [ ["OrderID","Date","CustomerName","Phone","Address","TransactionID","Items","Total","Status"] ];
  orders.forEach(o=>{
    const itemsText = o.items.map(i=> `${i.title} x${i.qty}`).join(" | ");
    rows.push([ o.id, o.date, o.customer.name, o.customer.phone, o.customer.address, o.transaction_id || "", itemsText, o.total, o.status ]);
  });
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\\n");
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders_export.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderOrders();
  document.getElementById("export-csv").addEventListener("click", (e)=>{ e.preventDefault(); exportOrdersCSV(); });
  document.getElementById("logout-btn").addEventListener("click", (e)=>{ e.preventDefault(); localStorage.removeItem("admin_logged"); window.location.href = "admin.html"; });
});
