
import { getProducts } from './productos.js';
import { addToCart, showNotification, updateCartCount } from './carrito.js';

// Esperar que el DOM esté listo 
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Cargar productos y actualizar interfaz
        const productos = await getProducts('mens-shoes', 5);
        
        updateCartCount();
        
        // Para manejar errores de carga
        if (!productos || productos.length === 0) {
            showNotification('No hay productos disponibles', 'warning');
            document.getElementById('products-container').innerHTML = 
                '<p class="no-products">Actualmente no tenemos productos disponibles. Vuelve pronto!</p>';
        }
        
        mostrarProductos(productos);

    } catch (err) {
        console.error("Error al cargar productos:", err);
        showNotification('Error al cargar los productos', 'error');
    }
});

// Función para mostrar productos en la página
function mostrarProductos(lista) {
    const contenedor = document.getElementById("products-container");
    if (!contenedor) return;

    // Vaciado de contenedor
    contenedor.innerHTML = "";

    // Creación de las cards de productos
    lista.forEach((prod) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = prod.id;

        // Datos con validación
        const nombre = prod.name || 'Producto sin nombre';
        const precio = typeof prod.price === 'number' ? prod.price.toFixed(2) : '0.00';
        const imagen = prod.thumbnail || 'placeholder.jpg';
        const descripcion = prod.description || 'Descripción no disponible';

        card.innerHTML = `
            <img src="${imagen}" alt="Imagen de ${nombre}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${nombre}</h3>
                <p class="product-price">$${precio}</p>
                <p class="product-description">${descripcion.substring(0, 60)}...</p>
                <div class="product-buttons">
                    <button class="btn btn-primary show-description" aria-label="Ver detalles de ${nombre}">
                        <i class="fas fa-info-circle"></i> Detalles
                    </button>
                    <button class="btn btn-secondary add-to-cart" aria-label="Añadir ${nombre} al carrito">
                        <i class="fas fa-cart-plus"></i> Añadir
                    </button>
                </div>
            </div>
        `;

        contenedor.appendChild(card);

        // Evento para añadir al carrito
        const botonCarrito = card.querySelector('.add-to-cart');
        botonCarrito.addEventListener('click', () => {
            addToCart(prod.id);
            showNotification(`${nombre} añadido al carrito`, 'success');
            updateCartCount();
            
            // Feedback visual
            botonCarrito.innerHTML = '<i class="fas fa-check"></i> Añadido';
            botonCarrito.disabled = true;
            setTimeout(() => {
                botonCarrito.innerHTML = '<i class="fas fa-cart-plus"></i> Añadir';
                botonCarrito.disabled = false;
            }, 2000);
        });

        botonCarrito.classList.add('added');
        setTimeout(() => {
            botonCarrito.classList.remove('added');
        }, 2000);

        // Evento para mostrar detalles 
        card.querySelector('.show-description')?.addEventListener('click', () => {
            showNotification(descripcion, 'info');
        });
    });
}
