import { getProducts } from './productos.js';

const CART_KEY = "urbanShoes_cart";

// Obtener carrito
export const getCart = () => {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

// Añadir al carrito (con cantidades)
export const addToCart = (productId) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
};

// Actualizar cantidad
export const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(productId);

    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    }
};

// Eliminar producto
export const removeFromCart = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
};

// Vaciar carrito
export const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
};

// Actualizar contador
const updateCartCount = () => {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    if (countElement) countElement.textContent = count;
};

// Notificación
export const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
};

// Renderizar carrito
export const renderCart = async () => {
    const cart = getCart();
    const products = await getProducts();
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p>Tu carrito está vacío</p>';
        totalElement.textContent = '0.00';
        return;
    }

    const cartItems = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        return { ...product, quantity: cartItem.quantity };
    });

    container.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.thumbnail}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="btn-quantity decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="btn-quantity increase">+</button>
                    <button class="btn-remove">Eliminar</button>
                </div>
                <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = total.toFixed(2);

    // Eventos para controles
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.cart-item').dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item) updateQuantity(productId, item.quantity - 1);
            renderCart();
        });
    });

    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.cart-item').dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item) updateQuantity(productId, item.quantity + 1);
            renderCart();
        });
    });

    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.cart-item').dataset.id);
            removeFromCart(productId);
            renderCart();
            showNotification('Producto eliminado');
        });
    });
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    if (document.getElementById('cart-items')) {
        renderCart();
        
        document.getElementById('clear-cart').addEventListener('click', () => {
            clearCart();
            renderCart();
            showNotification('Carrito vaciado');
        });

        document.getElementById('checkout').addEventListener('click', () => {
            showNotification('Compra finalizada ¡Gracias!');
            setTimeout(() => {
                clearCart();
                window.location.href = '../index.html';
            }, 1500);
        });
    }
});