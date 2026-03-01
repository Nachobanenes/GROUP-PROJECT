import { supabase } from '../shared/scripts/supabase.js'

window.addEventListener('DOMContentLoaded', async () => {
        const checkout = async(reference, name, phone, address) => {
                let basket = JSON.parse(localStorage.getItem('basket')) || null
                if(!basket) { alert("You ordered nothing..."); return; }
                const order = basket.map(item => ({
                        id: item.id,
                        qty: item.qty
                }))
                
                try {
                        const { data, error } = await supabase.rpc('process_order', {
                                p_reference: reference,
                                p_phone: phone,
                                p_name: name,
                                p_address: address,
                                p_order: order
                        })
                        if(error) {
                                console.error("Order Error:", error.message)
                                alert(`Checkout failed: ${error.message}`);
                                return;
                        }
                        localStorage.setItem("basket", null)
                        alert("Payment submitted! Your order is pending verification.");
                } catch(err) {
                        console.error("Unexpected error:", err)
                        alert("An unexpected error occurred. Please try again.")
                }
        }
})
