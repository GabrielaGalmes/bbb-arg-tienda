// --- Configuración de productos (simula una API REST) ---
const API_URL = "https://fakestoreapi.com/products?limit=4"; // Puedes cambiar el límite o usar tu propia API

// --- Estado global del carrito ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- Renderizado de productos ---
async function fetchAndRenderProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    renderProducts(products);
  } catch (e) {
    document.querySelector('.product-grid').innerHTML = "<p>Error al cargar productos.</p>";
  }
}

function renderProducts(products) {
  const grid = document.querySelector('.product-grid');
  grid.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>${product.description.substring(0, 80)}...</p>
      <p class="price">$${product.price}</p>
      <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
    `;
    grid.appendChild(card);
  });
}

// --- Carrito: lógica y renderizado ---
function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

function renderCart() {
  const tbody = document.getElementById('cart-body');
  tbody.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const subtotal = (item.price * item.quantity);
    total += subtotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.title}</td>
      <td>$${item.price}</td>
      <td>
        <div class="quantity-controls">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <input type="number" min="1" class="quantity-input" value="${item.quantity}" data-id="${item.id}">
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
        </div>
      </td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button class="remove-btn" data-id="${item.id}">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
  updateCartCount();
  localStorage.setItem('cart', JSON.stringify(cart));
}

// --- Añadir producto al carrito ---
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-to-cart')) {
    const id = e.target.getAttribute('data-id');
    addToCart(id);
  }
  if (e.target.classList.contains('remove-btn')) {
    const id = e.target.getAttribute('data-id');
    cart = cart.filter(item => item.id != id);
    renderCart();
  }
  if (e.target.classList.contains('quantity-btn')) {
    const id = e.target.getAttribute('data-id');
    const item = cart.find(i => i.id == id);
    if (!item) return;
    if (e.target.classList.contains('increase')) item.quantity++;
    if (e.target.classList.contains('decrease') && item.quantity > 1) item.quantity--;
    renderCart();
  }
});

// --- Cambiar cantidad manualmente ---
document.addEventListener('input', function(e) {
  if (e.target.classList.contains('quantity-input')) {
    const id = e.target.getAttribute('data-id');
    const item = cart.find(i => i.id == id);
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    item.quantity = val;
    renderCart();
  }
});

// --- Añadir producto al carrito (desde productos) ---
async function addToCart(id) {
  // Si ya está, solo suma cantidad
  let item = cart.find(i => i.id == id);
  if (item) {
    item.quantity++;
    renderCart();
    return;
  }
  // Si no está, búscalo en la API
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1
    });
    renderCart();
  } catch (e) {
    alert("No se pudo agregar el producto.");
  }
}

// --- Checkout simulado (WhatsApp) ---
document.getElementById('checkout-btn').addEventListener('click', function(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  let mensaje = "Hola BBB, quiero proceder con mi compra. Mi pedido es:\n";
  cart.forEach(item => {
    mensaje += `- ${item.quantity} x ${item.title} ($${item.price} c/u)\n`;
  });
  mensaje += `Total: $${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}`;
  const url = `https://wa.me/+5491123456789?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
});

// --- Validación de formularios (contacto y reseñas) ---
document.getElementById('contactForm').addEventListener('submit', function(e) {
  if (!validateContactForm()) {
    e.preventDefault();
    alert("Por favor, completa todos los campos correctamente.");
  }
});

function validateContactForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return name && emailRegex.test(email) && message;
}

// --- Validación y feedback para reseñas ---
document.getElementById('reviewForm').addEventListener('submit', function(e) {
  const name = document.getElementById('review-name').value.trim();
  const location = document.getElementById('review-location').value.trim();
  const stars = document.getElementById('review-stars').value;
  const message = document.getElementById('review-message').value.trim();
  if (!name || !location || !stars || !message) {
    e.preventDefault();
    alert("Por favor, completa todos los campos de la reseña.");
    return;
  }
  // Mostrar mensaje de confirmación
  e.preventDefault();
  this.reset();
  document.querySelector('.comment-confirmation').style.display = "block";
  setTimeout(() => {
    document.querySelector('.comment-confirmation').style.display = "none";
  }, 3000);
});

// --- Inicialización ---
fetchAndRenderProducts();
renderCart();

// ...existing code...

// Mostrar barra de búsqueda al hacer clic en la lupa
document.querySelector('a[href="#busqueda"]').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('search-bar').style.display = 'flex';
  document.getElementById('search-input').focus();
});

// Cerrar barra de búsqueda
document.getElementById('search-close').addEventListener('click', function() {
  document.getElementById('search-bar').style.display = 'none';
  document.getElementById('search-input').value = '';
});

// Buscar y desplazar a la sección o producto
document.getElementById('search-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const val = this.value.trim().toLowerCase();
    // Buscar sección por id
    const secciones = ['inicio','productos','reseñas','carrito','pago','envio','contacto','sobre-nosotros'];
    const match = secciones.find(id => id.includes(val));
    if (match) {
      document.getElementById(match).scrollIntoView({behavior: 'smooth'});
      document.getElementById('search-bar').style.display = 'none';
      this.value = '';
      return;
    }
    // Buscar producto por nombre (si tienes productos dinámicos)
    const productos = document.querySelectorAll('.product-card h3');
    for (let prod of productos) {
      if (prod.textContent.toLowerCase().includes(val)) {
        prod.scrollIntoView({behavior: 'smooth'});
        document.getElementById('search-bar').style.display = 'none';
        this.value = '';
        return;
      }
    }
    alert('No se encontró la sección o producto.');
  }
});

// Mostrar modal login
document.querySelector('a[href="#login"]').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('login-modal').style.display = 'flex';
});
// Cerrar modal login
document.getElementById('login-close').onclick = function() {
  document.getElementById('login-modal').style.display = 'none';
};
// Cerrar modal al hacer click fuera del contenido
window.onclick = function(e) {
  const modal = document.getElementById('login-modal');
  if (e.target === modal) modal.style.display = 'none';
};

// Mostrar y ocultar modales
function showModal(id) {
  document.querySelectorAll('.login-modal').forEach(m => m.style.display = 'none');
  document.getElementById(id).style.display = 'flex';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Abrir login desde menú
document.querySelector('a[href="#login"]').addEventListener('click', function(e) {
  e.preventDefault();
  showModal('login-modal');
});
// Cerrar modales
document.getElementById('login-close').onclick = () => closeModal('login-modal');
document.getElementById('register-close').onclick = () => closeModal('register-modal');
document.getElementById('recover-close').onclick = () => closeModal('recover-modal');
// Cerrar al hacer click fuera
window.addEventListener('click', function(e) {
  document.querySelectorAll('.login-modal').forEach(modal => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

// Cambiar entre modales
document.getElementById('show-register').onclick = function(e) {
  e.preventDefault();
  showModal('register-modal');
};
document.getElementById('show-login').onclick = function(e) {
  e.preventDefault();
  showModal('login-modal');
};
document.getElementById('show-login2').onclick = function(e) {
  e.preventDefault();
  showModal('login-modal');
};
document.getElementById('show-recover').onclick = function(e) {
  e.preventDefault();
  showModal('recover-modal');
};

// Validación y mensajes simulados (puedes conectar a backend real)
document.getElementById('login-form').onsubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  if (!email || !pass) {
    document.getElementById('login-msg').textContent = "Completa todos los campos.";
    return;
  }
  // Aquí iría la llamada real al backend
  document.getElementById('login-msg').textContent = "Inicio de sesión simulado exitoso.";
  setTimeout(() => closeModal('login-modal'), 1200);
};

document.getElementById('register-form').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const pass = document.getElementById('register-password').value;
  const pass2 = document.getElementById('register-password2').value;
  if (!name || !email || !pass || !pass2) {
    document.getElementById('register-msg').textContent = "Completa todos los campos.";
    return;
  }
  if (pass !== pass2) {
    document.getElementById('register-msg').textContent = "Las contraseñas no coinciden.";
    return;
  }
  // Aquí iría la llamada real al backend
  document.getElementById('register-msg').textContent = "Registro simulado exitoso.";
  setTimeout(() => showModal('login-modal'), 1200);
};

document.getElementById('recover-form').onsubmit = function(e) {
  e.preventDefault();
  const email = document.getElementById('recover-email').value.trim();
  if (!email) {
    document.getElementById('recover-msg').textContent = "Ingresa tu email.";
    return;
  }
  // Aquí iría la llamada real al backend
  document.getElementById('recover-msg').textContent = "Enlace de recuperación enviado (simulado).";
  setTimeout(() => showModal('login-modal'), 1500);
};

