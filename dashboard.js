let products = JSON.parse(localStorage.getItem("products")) || [];
let banks = JSON.parse(localStorage.getItem("banks")) || [];

function showTab(tab) {
    document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
    document.getElementById(tab).classList.remove("hidden");
}

function save() {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("banks", JSON.stringify(banks));
    loadProducts();
    loadBanks();
}

function addProduct() {
    products.push({
        name: pname.value,
        price: pprice.value,
        image: pimg.value
    });
    save();
}

function deleteProduct(i) {
    products.splice(i, 1);
    save();
}

function loadProducts() {
    let box = document.getElementById("plist");
    box.innerHTML = "";
    products.forEach((p, i) => {
        box.innerHTML += `<p>${p.name} - Rs ${p.price} 
        <button onclick="deleteProduct(${i})">Delete</button></p>`;
    });
}

function addBank() {
    banks.push({
        bank: bankname.value,
        acc: accno.value,
        iban: iban.value
    });
    save();
}

function deleteBank(i) {
    banks.splice(i, 1);
    save();
}

function loadBanks() {
    let box = document.getElementById("banklist");
    box.innerHTML = "";
    banks.forEach((b, i) => {
        box.innerHTML += `<p>${b.bank} - ${b.acc} 
        <button onclick="deleteBank(${i})">Delete</button></p>`;
    });
}

loadProducts();
loadBanks();
