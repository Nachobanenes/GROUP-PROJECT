
import { supabase } from '../shared/scripts/supabase.js'

window.addEventListener('DOMContentLoaded', async () => {
        const { data, error } = await supabase.from('Item').select('*')
        
        /*<div class="product-card">
        <a href="#" class="clickable-card">
          <div class="img-wrapper">
            <img src="https://acigirlboutique.com/cdn/shop/files/ED509E1F-C2F2-4D43-A017-B5DF3904876C.jpg?v=1729088231&width=823" alt="Meowy KittyMas Stickers">
            
          </div>
          <h3 class="product-title">CCICCIBOORICCI Meowy KittyMas Stickers</h3>
          <p class="product-price">
            <s class="old-price">₱60.00 PHP</s> 
            <span class="actual-price">From ₱50.00 PHP</span>
          </p>
        </a>
        <button class="btn btn-outline-dark add-to-cart">Choose options</button>
      </div>*/

})

const checkout = async(reference, name, phone, address, order) => {
        
}
