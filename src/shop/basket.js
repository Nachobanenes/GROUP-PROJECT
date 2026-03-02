/*
const addToBasket = (_) => {
        let basket = JSON.parse(localStorage.getItem("basket")) || []
        
        basket.push({ id: _ })
        
        localStorage.setItem("basket", JSON.stringify(basket))
}
*/

// bskct

/*
import { supabase } from '../shared/scripts/supabase.js'

window.addEventListener('DOMContentLoaded', async () => {
        let catalog = JSON.parse(localStorage.getItem("catalog"))
        let data, error;
        if(!catalog) {
                ({ data, error } = await supabase.from('Inventory').select('*'))
                catalog = [[]]
        }
        
        if(error) console.error("Order Error:", error.message)
        else {
                for(i = 0, o = 0; i < data.length; i += 4*3, o++) {
                        catalog[o] = data.slice(i, i+12)
                }
                localStorage.setItem("catalog", JSON.stringify(catalog))
                
                const dce = document.createElement
                catalog.forEach((page) => {
                        const _page = dce("div")
                        _page.id = `invpg${page}`
                        _page.class = "grid-0"
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
*/