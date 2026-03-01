
import { supabase } from '../shared/scripts/supabase.js'

window.addEventListener('DOMContentLoaded', async () => {
        const checkout = async(reference, name, phone, address, order) => {
                const order = order.map(item => ({
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
                        alert("Payment submitted! YOur order is pending verification.");
                } catch(err) {
                        console.error("Unexpected error:", err)
                        alert("An unexpected error occurred. Please try again.")
                }
        }
})
