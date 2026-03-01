
import { supabase } from '../shared/scripts/supabase.js'

window.addEventListener('DOMContentLoaded', async () => {
        const { inventory, error } = await supabase.from('Inventory').select('*')
        
        if(error) console.error("Order Error:", error.message)
        else {
                const catalog = []
                for(i = 0; i < inventory.length; i += 5*3) {
                        catalog[i] = inventory.slice(i, i+15)
                }
                
                const dce = document.createElement
                catalog.forEach((page) => {
                        const _page = dce("div")
                        _page.id = `inventory-page-${page}`
                        _page.class = "grid-5"
                        page.forEach((product) => {
                                _page.innerHTML +=
                                        `<div class="product-card">`+
                                        `       <a href="#" class="clickable-card">`+
                                        `               <div class="img-wrapper">`+
                                        `                       <img src="${product.image}">`+
                                        `               </div>`+
                                        `               <h3 class="product-title">${product.name}</h3>`+
                                        `               <p class="product-price">`+
                                        `                       <s class="old-price">₱${product.price}</s>`+
                                        `                       <span class="actual-price">₱${product.final}</span>`+
                                        `               </p>`+
                                        `       </a>`+
                                        `       <button class="btn btn-outline-dark add-to-cart">Add to basket</button>`+
                                        `</div>`
                        })
                })
        }
})
