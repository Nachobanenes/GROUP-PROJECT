import { supabase } from '../shared/scripts/supabase.js'

window.addEventListener('DOMContentLoaded', async () => {
        let catalog = [[]]
        let data, error;
        
        ({ data, error } = await supabase.from('Inventory').select('*'));
        
        if(error) console.error("Order Error:", error.message)
        else {
                if(data) for(let i = 0, o = 0; i < data.length; i += 4*3, o++) {
                        catalog[o] = data.slice(i, i+12)
                }
                
                let pgidx = localStorage.getItem("pgidx") || 1
                catalog.forEach((page, pagei) => {
                        const _page = document.createElement("div")
                        _page.id = `invpg${pagei}`
                        _page.className = `grid-${pagei+1==pgidx?5:0}`
                        page.forEach((product) => {
                                _page.innerHTML +=
                                        `
                                        <div class="product-card">
                                               <a href="#" class="clickable-card">
                                                       <div class="img-wrapper">
                                                               <img src="${product.image}" alt="${product.name}">
                                                       </div>
                                                       <h3 class="product-title">${product.name}</h3>
                                                       <p class="product-price">
                                                                <span class="actual-price">₱${product.final}</span>
                                                                ${product.discount?'<s class="old-price">(₱'+product.price+')</s>':""}
                                                       </p>
                                               </a>
                                               <button class="btn btn-outline-dark add-to-cart" onclick="addToBasket(${product.id})">Add to basket</button>
                                        </div>
                                        `
                        })
                        document.getElementById("invct").appendChild(_page)
                })
        }
        
        window.addToBasket = (_) => {
                let basket = JSON.parse(localStorage.getItem("basket")) || []
                
                basket.push({ id: _, quantity: 1 })
                
                localStorage.setItem("basket", JSON.stringify(basket))
        }
})