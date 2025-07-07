
import { getProducts, mostrarAlerta } from './productos.js';
const CART_KEY = "urbanShoes_cart";

// Funciones básicas del carrito
function getCart() {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Operaciones del carrito
export function addToCart(productId) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    saveCart(cart);
    updateCartCount();
}

export function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
        updateCartCount();
    } else {
        mostrarAlerta("Producto no encontrado en el carrito.");
    }
}

export function removeFromCart(productId) {
    const cart = getCart();
    const newCart = cart.filter(item => item.id !== productId);

    if (newCart.length !== cart.length) {
        saveCart(newCart);
        updateCartCount();
    } else {
        mostrarAlerta("Producto no encontrado para eliminar.");
    }
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
}

// Interfaz
export function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = total;
}

export function showNotification(msg, type = 'info') {
    // Notificación nativa si está disponible y permitida
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification("BBB.ARG", {
                body: msg,
                icon: "./imagenes/logo.png"
            });
            return;
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("BBB.ARG", {
                        body: msg,
                        icon: "./imagenes/logo.png"
                    });
                } else {
                    showCustomNotification(msg, type);
                }
            });
            return;
        }
    }

    // Fallback personalizado
    showCustomNotification(msg, type);
}

function showCustomNotification(msg, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = msg;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Renderización
export async function renderCart() {
    const [cart, productos] = await Promise.all([getCart(), getProducts()]);
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (!container || !totalEl) {
        mostrarAlerta("Elementos del carrito no encontrados en la página.");
        return;
    }

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        totalEl.textContent = '0.00';
        return;
    }

    let itemsHTML = '';
    let total = 0;

    cart.forEach(cartItem => {
        const product = productos.find(p => p.id === cartItem.id);
        if (!product) return;

        const subtotal = product.price * cartItem.quantity;
        total += subtotal;

        itemsHTML += `
            <div class="cart-item" data-id="${product.id}">
                <img src="${product.thumbnail}" alt="${product.name}">
                <div class="item-details">
                    <h3>${product.name}</h3>
                    <p>Precio unitario: $${product.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="btn-quantity decrease">-</button>
                        <span class="quantity">${cartItem.quantity}</span>
                        <button class="btn-quantity increase">+</button>
                        <button class="btn-remove" aria-label="Eliminar producto">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        </div>
                    <p class="subtotal">Subtotal: $${subtotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = itemsHTML;
    totalEl.textContent = total.toFixed(2);
}

// Eventos
function setupCartListeners() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const itemElement = e.target.closest('.cart-item');
        if (!itemElement) return;

        const productId = parseInt(itemElement.dataset.id);
        const cart = getCart();
        const cartItem = cart.find(item => item.id === productId);

        if (e.target.classList.contains('decrease')) {
            updateQuantity(productId, cartItem.quantity - 1);
            renderCart();
        } else if (e.target.classList.contains('increase')) {
            updateQuantity(productId, cartItem.quantity + 1);
            renderCart();
        } else if (e.target.closest('.btn-remove')) {
            removeFromCart(productId);
            showNotification('Producto eliminado', 'warning');
            renderCart();
        }
    });

    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            clearCart();
            renderCart();
            showNotification('Carrito vaciado', 'info');

             // Redirigir al inicio después de 3 segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 3000);
        });
    }

    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            clearCart();
            renderCart();
            showNotification('¡Gracias por tu compra!', 'success');

            // Redirigir al inicio después de 3 segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 3000);
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Ejecutar sólo si se está en la página del carrito
    if (document.getElementById('cart-items') && document.getElementById('cart-total')) {
        renderCart();
        setupCartListeners();
    }
});

