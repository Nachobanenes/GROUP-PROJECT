window.addEventListener('DOMContentLoaded', async () => {
        const basket = JSON.parse(localStorage.getItem("basket"))
        console.log(basket)
        if(error) console.error("Order Error:", error.message)
        else {
                if(data) for(let i = 0, o = 0; i < data.length; i += 4*3, o++) {
                        catalog[o] = data.slice(i, i+12)
                }
                localStorage.setItem("catalog", JSON.stringify(catalog))
                
                let pgidx = localStorage.getItem("pgidx") || 1
                catalog.forEach((page, pagei) => {
                        const _page = document.createElement("div")
                        _page.id = `invpg${pagei}`
                        _page.className = `grid-${pagei+1==pgidx?5:0}`
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
                        document.getElementById("invct").appendChild(_page)
                })
        }
})