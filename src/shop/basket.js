import { supabase } from '../shared/scripts/supabase.js'

window.addEventListener('DOMContentLoaded', async () => {
        const basket = JSON.parse(localStorage.getItem("basket")) || []
        const bskct = document.getElementById("bskct")
        
        let data, error;
        
        ({ data, error } = await supabase.from('Inventory').select('*'));
        
        if(error) console.error("Error:", error)
        else {
                
                data.filter(i => new Set(basket.map(o=>o.id)).has(i.id)).forEach((item) => {
                        bskct.innerHTML +=
                        `
                        <div class="cart-item" id="b${item.id}">
                                <input type="checkbox" class="cart-item-checkbox" checked>
                                <div class="cart-item-image">
                                        <img src="${item.image}" alt="${item.name}">
                                </div>
                                <div class="cart-item-details">
                                        <div class="cart-item-title">${item.name}</div>
                                        <div class="cart-item-category">${item.category}</div>
                                        <div class="cart-item-price">
                                                <span class="price-current">₱${item.final}</span>
                                                ${item.discount?'<span class="price-original">(₱'+item.price+')</span>':""}
                                        </div>
                                        <div class="cart-item-quantity">
                                                <button id="bd${item.id}" class="quantity-btn" onclick="dec(${item.id})">−</button>
                                                <input id="v${item.id}" type="number" class="quantity-input" value="1" readonly>
                                                <button id="bi${item.id}" class="quantity-btn" onclick="inc(${item.id})">+</button>
                                        </div>
                                </div>
                                <button class="cart-item-remove" onclick="removeFromBasket(${item.id})">Remove</button>
                        </div>
                        `
                })
        }
        // Syncs the UI value to localStorage basket
        const syncLocalStorage = (id, newQty) => {
            let basket = JSON.parse(localStorage.getItem("basket")) || [];
            const itemIndex = basket.findIndex(item => item.id === id);
        
            if (itemIndex !== -1) {
                basket[itemIndex].quantity = newQty;
            } else {
                // If it's not in basket yet, add it
                basket.push({ id, quantity: newQty });
            }
            
            localStorage.setItem("basket", JSON.stringify(basket));
        };
        
        window.inc = async (id) => {
            const input = document.getElementById(`v${id}`);
            const btnDec = document.getElementById(`bd${id}`);
            const btnInc = document.getElementById(`bi${id}`);
        
            // Real-time stock check
            const { data, error } = await supabase.from('Inventory').select('quantity').eq('id', id).single();
        
            if (error) return console.error("Stock check failed:", error);
        
            let currentVal = Number(input.value);
        
            // Only increment if we are below available stock
            if (currentVal < data.quantity) {
                currentVal++;
                input.value = currentVal;
                
                // UI: Enable minus, check if we just hit the max
                btnDec.style.opacity = "100%";
                btnInc.style.opacity = (currentVal >= data.quantity) ? "20%" : "100%";
        
                syncLocalStorage(id, currentVal);
            } else {
                // Just in case the stock changed under them
                btnInc.style.opacity = "20%";
            }
        };
        
        window.dec = async (id) => {
            const input = document.getElementById(`v${id}`);
            const btnDec = document.getElementById(`bd${id}`);
            const btnInc = document.getElementById(`bi${id}`);
        
            let currentVal = Number(input.value);
        
            // Floor is 1 since removal is handled elsewhere
            if (currentVal > 1) {
                currentVal--;
                input.value = currentVal;
                
                // UI: Enable plus, check if we hit the floor
                btnInc.style.opacity = "100%";
                btnDec.style.opacity = (currentVal === 1) ? "20%" : "100%";
        
                syncLocalStorage(id, currentVal);
            } else {
                btnDec.style.opacity = "20%";
            }
        };
        
        window.removeFromBasket = async(id) => {
                let basket = JSON.parse(localStorage.getItem("gbasket")) || []
                basket = basket.filter(i=>i.id!==id)
                localStorage.setItem("basket", JSON.stringify(basket))
                document.getElementById(`b${id}`).remove()
        }
})