import { getProducts } from './productos.js';
import { addToCart, showNotification } from './carrito.js';

document.addEventListener('DOMContentLoaded', async () => {
    const products = await getProducts();
    renderProducts(products);
});

function renderProducts(products) {
    const container = document.getElementById('products-container');
    
    container.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.thumbnail}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="btn btn-primary show-description">Ver detalles</button>
                <button class="btn btn-secondary add-to-cart">Añadir al carrito</button>
            </div>
        </div>
    `).join('');

    // Eventos para botones
    document.querySelectorAll('.add-to-cart').forEach((button, index) => {
        button.addEventListener('click', () => {
            addToCart(products[index].id);
            showNotification(`${products[index].name} añadido al carrito`);
        });
    });
}