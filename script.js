let totalPrice = 0;
let selectedItems = [];

function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Menambahkan titik setiap tiga digit
}

function increaseQuantity(button, itemName, itemPrice) {
    const quantitySpan = button.previousElementSibling;
    let quantity = parseInt(quantitySpan.textContent);
    quantity += 1;
    quantitySpan.textContent = quantity;
    updateOrderSummary(itemName, itemPrice, quantity);
}

function decreaseQuantity(button, itemName, itemPrice) {
    const quantitySpan = button.nextElementSibling;
    let quantity = parseInt(quantitySpan.textContent);
    if (quantity > 0) {
        quantity -= 1;
    }
    quantitySpan.textContent = quantity;
    updateOrderSummary(itemName, itemPrice, quantity);
}


// Fungsi untuk memperbarui ringkasan pesanan (tabel pesanan)
function updateOrderSummary(itemName, itemPrice, quantity) {
    const orderTable = document.getElementById("orderTable");
    let row = document.querySelector(`[data-item='${itemName}']`);
    
    // Jika baris sudah ada, update kuantitas dan total harga
    if (row) {
        if (quantity === 0) {
            totalPrice -= itemPrice * parseInt(row.querySelector(".quantity-cell").textContent);
            row.remove(); 
        } else {
            const oldTotal = parseInt(row.querySelector(".total-cell").textContent.replace(/\D/g, ""));
            row.querySelector(".quantity-cell").textContent = quantity;
            row.querySelector(".total-cell").textContent = `Rp ${formatCurrency(itemPrice * quantity)}`;
            totalPrice += itemPrice * quantity - oldTotal;
        }
    } else {
        
        if (quantity > 0) {
            row = document.createElement("tr");
            row.setAttribute("data-item", itemName);
            row.innerHTML = `
                <td>${itemName}</td>
                <td>Rp ${formatCurrency(itemPrice)}</td>
                <td class="quantity-cell">${quantity}</td>
                <td class="total-cell">Rp ${formatCurrency(itemPrice * quantity)}</td>
            `;
            orderTable.appendChild(row);
            totalPrice += itemPrice * quantity;
        }
    }

    updateTotalPrice();
}

function updateTotalPrice() {
    document.getElementById("totalPrice").textContent = `Rp ${formatCurrency(totalPrice)}`;
}

function purchaseItems() {
    if (totalPrice > 0) {
        let message = "Halo, saya ingin membeli produk berikut:\n\n";

        
        const rows = document.querySelectorAll("#orderTable tr");
        rows.forEach(row => {
            const itemName = row.querySelector("td:first-child").textContent;
            const quantity = row.querySelector(".quantity-cell").textContent;
            const total = row.querySelector(".total-cell").textContent.replace(/\D/g, ""); // Menghapus non-digit untuk mendapatkan angka

            
            message += `${itemName}: ${quantity} buah, Total: Rp ${formatCurrency(total)}\n`;
        });

        message += `\nTotal Pembelian: Rp ${formatCurrency(totalPrice)}\n\nMohon info lebih lanjut.`;

        
        const phoneNumber = '6285693672730'; 
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


        window.open(url, "_blank");
    } else {
        alert("Silakan tambahkan produk ke keranjang terlebih dahulu.");
    }
}
