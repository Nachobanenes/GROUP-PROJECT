import { supabase } from '../shared/scripts/supabase.js'

window.addEventListener('DOMContentLoaded', async () => {
        window.checkout = async(reference, name, phone, address) => {
                let basket = JSON.parse(localStorage.getItem('basket')) || []
                if(basket.length == 0) { alert("You ordered nothing..."); return; }
                const order = basket.map(item => ({
                        id: item.id,
                        qty: item.quantity
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

window.getFullBasket = () => {
    const raw = JSON.parse(localStorage.getItem('basket')) || [];
    // Assuming 'inventoryData' is your global array from the Supabase fetch
    return raw.map(item => {
        const info = (window.inventoryData || []).find(i => i.id == item.id);
        return {
            id: Number(item.id),
            name: info ? info.name : "Unknown",
            qty: Number(item.quantity),
            final: info ? Number(info.final) : 0
        };
    });
};
