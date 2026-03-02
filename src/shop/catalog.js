import { supabase } from '../shared/scripts/supabase.js'

let masterData = []; // Holds original data from Supabase

const renderCatalog = (data) => {
    const invct = document.getElementById("invct");
    invct.innerHTML = ""; // Clear current grid

    if (data.length === 0) {
        invct.innerHTML = "<p style='padding: 20px;'>No products match your filters.</p>";
        return;
    }

    let catalog = [];
    for(let i = 0; i < data.length; i += 12) {
        catalog.push(data.slice(i, i + 12));
    }

    let pgidx = localStorage.getItem("pgidx") || 1;
    
    catalog.forEach((page, pagei) => {
        const _page = document.createElement("div");
        _page.id = `invpg${pagei}`;
        // grid-5 shows the items, grid-0 hides them (based on your CSS)
        _page.className = (pagei + 1 == pgidx) ? "grid-5" : "grid-0";
        
        page.forEach((product) => {
            _page.innerHTML += `
                <div class="product-card">
                    <a href="#" class="clickable-card">
                        <div class="img-wrapper">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">
                            <span class="actual-price">₱${product.final}</span>
                            ${product.discount ? `<s class="old-price">(₱${product.price})</s>` : ""}
                        </p>
                    </a>
                    <button class="btn btn-outline-dark add-to-cart" onclick="addToBasket(${product.id})">Add to basket</button>
                </div>`;
        });
        invct.appendChild(_page);
    });
};

window.addEventListener('DOMContentLoaded', async () => {
    const { data, error } = await supabase.from('Inventory').select('*');
    
    if(error) {
        console.error("Order Error:", error.message);
    } else {
        masterData = data || [];
        renderCatalog(masterData);
    }

    // Attach click event to the Apply button in your HTML
    document.getElementById('applyFiltersBtn')?.addEventListener('click', window.catrefresh);
});

window.catrefresh = () => {
    let filtered = [...masterData];

    // 1. Availability Filter
    const inStock = document.getElementById('inStock').checked;
    const outStock = document.getElementById('outOfStock').checked;
    if (inStock && !outStock) filtered = filtered.filter(i => i.quantity > 0);
    if (outStock && !inStock) filtered = filtered.filter(i => i.quantity <= 0);

    // 2. Price Range Filter
    const minP = parseFloat(document.getElementById('priceFrom').value) || 0;
    const maxP = parseFloat(document.getElementById('priceTo').value) || Infinity;
    filtered = filtered.filter(i => i.final >= minP && i.final <= maxP);

    // 3. Category Filter
    const cats = [];
    if (document.getElementById('stickers').checked) cats.push('Stickers');
    if (document.getElementById('bracelets').checked) cats.push('Bracelets');
    if (document.getElementById('scrunchies').checked) cats.push('Scrunchies');
    
    if (cats.length > 0) {
        filtered = filtered.filter(i => cats.includes(i.category));
    }

    // 4. Sorting
    const sortVal = document.querySelector('input[name="sort"]:checked')?.value;
    if (sortVal === "price-low-high") filtered.sort((a, b) => a.final - b.final);
    if (sortVal === "price-high-low") filtered.sort((a, b) => b.final - a.final);
    if (sortVal === "alphabetical") filtered.sort((a, b) => a.name.localeCompare(b.name));

    renderCatalog(filtered);
};

window.addToBasket = (id) => {
    let basket = JSON.parse(localStorage.getItem("basket")) || [];
    const found = basket.find(item => item.id === id);
    if (found) {
        found.quantity += 1;
    } else {
        basket.push({ id: id, quantity: 1 });
    }
    localStorage.setItem("basket", JSON.stringify(basket));
    alert("Added to basket!");
};