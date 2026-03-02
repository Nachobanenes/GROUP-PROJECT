import { supabase } from '../shared/scripts/supabase.js'

const loginContainer = document.getElementById('loginContainer');
const tabsContainer = document.getElementById('tabsContainer');
const dashboardContent = document.getElementById('dashboardContent');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');

loginBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  adminLogin(username, password)
});

async function adminLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })
  if (error) alert("Access Denied: " + error.message)
  else {
    loginContainer.style.display = 'none';
    tabsContainer.style.display = 'block';
    dashboardContent.style.display = 'block';
    showTab('diagnostics')
    refetch()
  }
}

window.refetch = async () => {
    // 1. Target the two specific table bodies
    const inv = document.getElementById("tinv");
    const sls = document.getElementById("tsls");

    // 2. Fetch from both tables simultaneously
    // We order by 'id' descending so the newest items/sales appear at the top
    const [inventoryRes, salesRes] = await Promise.all([
        supabase.from('Inventory').select('*').order('id', { ascending: false }),
        supabase.from('Sales').select('*').order('id', { ascending: false })
    ]);

    // Error handling
    if (inventoryRes.error) return console.error("Inventory Error:", inventoryRes.error);
    if (salesRes.error) return console.error("Sales Error:", salesRes.error);

    // 3. Clear existing rows to prevent duplicates
    inv.innerHTML = "";
    sls.innerHTML = "";

    // 4. Populate Inventory (tinv)
    inventoryRes.data.forEach((item) => {
        inv.innerHTML += `
            <tr id="tr${item.id}">
                <td data-field="image" onclick="handleImageClick(${item.id})">
                    <img style="cursor:pointer;" width="100px" height="100px" alt="${item.name}" src="${item.image}">
                </td>
                <td contenteditable="true" data-field="name">${item.name}</td>
                <td contenteditable="true" data-field="category">${item.category}</td>
                <td contenteditable="true" data-field="status">${item.status}</td>
                <td contenteditable="true" data-field="quantity">${item.quantity}</td>
                <td contenteditable="true" data-field="price">${item.price}</td>
                <td contenteditable="true" data-field="discount">${item.discount}</td>
                <td>${item.final || 0}</td>
                <td>
                    <button class="delete-btn" onclick="deleteRow(${item.id})">delete</button>
                </td>
            </tr>`;
    });
    
    salesRes.data.forEach((sale) => {
        const status = sale.status;
    
        // Determine the Row Background Color (Very subtle tints)
        let rowBg = 'background-color: transparent;'; 
        if (status === 'Pending') rowBg = 'background-color: #f9f9f9;';    // Very Light Grey
        if (status === 'Processing') rowBg = 'background-color: #fff5f2;'; // Very Pale Red/Clay
        if (status === 'Completed') rowBg = 'background-color: #f0fff4;';  // Very Pale Mint
    
        sls.innerHTML += `
            <tr id="sale${sale.id}" style="${rowBg} transition: background 0.3s ease;">
                <td>${sale.name || '-'}</td>
                <td>${sale.phone || '-'}</td>
                <td>${sale.reference || '-'}</td>
                <td>${sale.date ? new Date(sale.date).toLocaleDateString() : '-'}</td>
                <td>$${sale.total || 0}</td>
                <td>${sale.address || '-'}</td>
                <td>
                    <div class="status-buttons" style="display: flex; gap: 8px;">
                        <button class="btn-status btn-pending" onclick="updateStatus(${sale.id}, 'Pending')">Pending</button>
                        <button class="btn-status btn-processing" onclick="updateStatus(${sale.id}, 'Processing')">Processing</button>
                        <button class="btn-status btn-completed" onclick="updateStatus(${sale.id}, 'Completed')">Completed</button>
                    </div>
                </td>
                <td>
                    <button class="view-btn" onclick="viewOrderDetails(${sale.id})">View Order</button>
                </td>
            </tr>`;
    });
};

window.updateStatus = async (id, newStatus) => {
    const { error } = await supabase
        .from('Sales')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        alert("Update failed: " + error.message);
    } else {
        // This re-runs the loop, sees the new status, and applies the new rowBg
        refetch(); 
    }
};

const injectModal = () => {
    if (document.getElementById("orderModal")) return;

    const modalHtml = `
    <div id="orderModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; justify-content:center; align-items:center; font-family: sans-serif;">
        <div style="background:white; padding:30px; border-radius:12px; width:90%; max-width:650px; max-height:85vh; overflow-y:auto; position:relative; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
            <button onclick="document.getElementById('orderModal').style.display='none'" style="position:absolute; top:15px; right:15px; border:none; background:none; font-size:24px; cursor:pointer;">&times;</button>
            <h2 id="modalTitle" style="margin-top:0;">Order Inventory</h2>
            <div id="modalContent"></div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.viewOrderDetails = async (id) => {
    injectModal();
    
    const { data, error } = await supabase
        .from('Sales')
        .select('name, order, total, reference')
        .eq('id', id)
        .single();

    if (error || !data) return alert("Error loading order: " + error.message);

    const content = document.getElementById("modalContent");
    const title = document.getElementById("modalTitle");

    title.innerHTML = `Order Ref: ${data.reference}`;
    
    // --- Error Fix: Ensure order is an array ---
    let items = [];
    try {
        // If it's a string from the DB, parse it; otherwise use as is
        items = typeof data.order === 'string' ? JSON.parse(data.order) : data.order;
        if (!Array.isArray(items)) items = [items]; 
    } catch (e) {
        return alert("Data Error: Order JSON is not formatted correctly.");
    }

    // Build the "Mini Inventory" Table
    let itemsHtml = `
        <table style="width:100%; border-collapse: collapse; margin-top:20px; font-size:14px; text-align:left;">
            <thead>
                <tr style="border-bottom: 2px solid #333; color:#111;">
                    <th style="padding:10px;">ID</th>
                    <th style="padding:10px;">Name</th>
                    <th style="padding:10px;">Qty</th>
                    <th style="padding:10px;">Final</th>
                    <th style="padding:10px; text-align:right;">Total</th>
                </tr>
            </thead>
            <tbody>`;

    items.forEach(item => {
        // Calculate line total: qty * final price
        const qty = Number(item.qty || item.quantity || 0);
        const final = Number(item.final || item.price || 0);
        const lineTotal = qty * final;

        itemsHtml += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding:10px;">${item.id || '-'}</td>
                <td style="padding:10px; font-weight:bold;">${item.name || 'Unknown'}</td>
                <td style="padding:10px;">${qty}</td>
                <td style="padding:10px;">${final.toFixed(2)}</td>
                <td style="padding:10px; text-align:right;">${lineTotal.toFixed(2)}</td>
            </tr>`;
    });

    itemsHtml += `
            </tbody>
        </table>
        <div style="margin-top:20px; padding-top:15px; border-top:2px solid #333; text-align:right;">
            <span style="font-size:18px; font-weight:bold;">Grand Total: ${data.total}</span>
        </div>`;

    content.innerHTML = itemsHtml;
    document.getElementById("orderModal").style.display = "flex";
};

window.deleteRow = async (id) => {
    if (!confirm("Are you sure you want to delete this item? This cannot be undone.")) return;
    const { error } = await supabase
        .from('Inventory')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Delete failed:", error.message);
        alert("Error deleting item: " + error.message);
    } else {
        const row = document.getElementById(`tr${id}`);
        if (row) {
            row.style.transition = "all 0.3s ease";
            row.style.opacity = "0";
            setTimeout(() => row.remove(), 300);
        }
        console.log(`Item ${id} deleted successfully.`);
    }
};

window.createNewItem = async () => {
    const newItem = {
        name: "New Product",
        category: "---",
        status: "---",
        quantity: 0,
        price: 0,
        discount: 0,
        image: "https://via.placeholder.com/100"
    };
    const { data, error } = await supabase
        .from('Inventory')
        .insert([newItem])
        .select();
    if (error) {
        console.error("Insert failed:", error.message);
        alert("Could not create item: " + error.message);
        return;
    }
    const createdItem = data[0];
    const inv = document.getElementById("tinv");
    const newRowHtml = `
        <tr id="tr${createdItem.id}">
            <td data-field="image" onclick="handleImageClick(${createdItem.id})">
                <img style="cursor:pointer;" width="100px" height="100px" src="${createdItem.image}">
            </td>
            <td contenteditable="true" data-field="name">${createdItem.name}</td>
            <td contenteditable="true" data-field="category">${createdItem.category}</td>
            <td contenteditable="true" data-field="status">${createdItem.status}</td>
            <td contenteditable="true" data-field="quantity">${createdItem.quantity}</td>
            <td contenteditable="true" data-field="price">${createdItem.price}</td>
            <td contenteditable="true" data-field="discount">${createdItem.discount}</td>
            <td>0</td> <td>
                <button class="delete-btn" onclick="deleteRow(${createdItem.id})">Delete</button>
            </td>
        </tr>`;
    inv.insertAdjacentHTML('beforeend', newRowHtml);
    document.getElementById(`tr${createdItem.id}`).scrollIntoView({ behavior: 'smooth' });
};

document.querySelectorAll('[data-field="image"]').forEach(cell => {
    cell.addEventListener('dblclick', () => {
        const newUrl = prompt("Enter new Image URL:", cell.querySelector('img').src);
        if (newUrl) {
            cell.querySelector('img').src = newUrl;
            // Optional: Mark row as dirty/changed
            cell.parentElement.classList.add('is-dirty');
        }
    });
});

window.updateChanges = async () => {
    const inventoryTab = document.getElementById('tinv');
    const rows = inventoryTab.querySelectorAll('table tbody tr');
    const bulkData = Array.from(rows).map(row => {
        const rawId = row.id.replace('tr', '');
        const numericId = Number(rawId);
        const imgElement = row.querySelector('td img');
        const imageUrl = imgElement ? imgElement.src : "";
        const editableCells = row.querySelectorAll('[contenteditable="true"]');
        const rowData = { 
            id: numericId,
            image: imageUrl 
        };
        editableCells.forEach(cell => {
            const field = cell.dataset.field;
            if (field) {
                let value = cell.innerText.trim();
                if (['quantity', 'price', 'discount'].includes(field)) {
                    value = Number(value);
                }
                rowData[field] = value;
            }
        });
        return rowData;
    }).filter(data => data !== null && !isNaN(data.id));
    const { data, error } = await supabase
        .from('Inventory')
        .upsert(bulkData);
    if (error) {
        console.error("Supabase Error:", error.message);
        alert("Failed to sync: " + error.message);
    } else {
        alert("Inventory updated successfully!");
    }
};

window.handleImageClick = (id) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Find the image in the specific row
        const imgElement = document.querySelector(`#tr${id} img`);
        
        // 1. Visual cue that upload is starting
        imgElement.style.filter = "blur(2px) grayscale(100%)";

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'unsigned');
        
        const _cloudname = 'dzfaeh7do';
        
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${_cloudname}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.secure_url) {
                // 2. Update the DOM. 
                // Your existing save function will now see this new URL!
                imgElement.src = data.secure_url;
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            imgElement.style.filter = "none";
        }
    };

    fileInput.click();
};

document.addEventListener('keydown', (e) => {
    if (e.target.hasAttribute('contenteditable') && e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
    }
});

// Function to switch tabs
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';

  document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.tabs button[data-tab="${tabId}"]`).classList.add('active');
}

// Tab button listeners
document.querySelectorAll('.tabs button').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});
