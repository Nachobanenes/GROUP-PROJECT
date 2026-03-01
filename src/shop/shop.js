
import { supabase } from '../shared/scripts/supabase.js'

window.addEventListener('DOMContentLoaded', async () => {
        const { data, error } = await supabase.from('Item').select('*')
        
        
})

const checkout = async(reference, name, phone, address, order) => {
        
}
