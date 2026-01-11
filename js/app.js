/* --- STATE --- */
let cart = [];
const navbar = document.getElementById('navbar');

/* --- NAVBAR SCROLL --- */
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

/* --- MENÚ HAMBURGUESA --- */
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
}

/* --- LÓGICA DEL CARRITO --- */
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
    document.getElementById('cartOverlay').classList.toggle('active');
}

// Función Agregar (Ahora recibe precio)
function addToCart(name, price) {
    // Buscar si ya existe para sumar cantidad (Opcional, aquí agregamos simple)
    const item = {
        id: Date.now(), // ID único
        name: name,
        price: price
    };
    
    cart.push(item);
    renderCart();
    
    // Abrir carrito automáticamente al agregar (Opcional)
    // toggleCart(); 
    
    // Notificación Toast
    showToast(name);
}

// Función Borrar Item
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

// Renderizar HTML del Carrito
function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const countSpan = document.getElementById('cart-count');
    const totalSpan = document.getElementById('cartTotal');
    
    // Limpiar
    container.innerHTML = '';
    
    // Calcular Total
    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Tu carrito está vacío 🍕</p>';
    } else {
        cart.forEach(item => {
            total += item.price;
            
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="item-info">
                    <h5>${item.name}</h5>
                    <span>$${item.price.toFixed(2)}</span>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            container.appendChild(div);
        });
    }
    
    // Actualizar UI
    countSpan.innerText = cart.length;
    totalSpan.innerText = '$' + total.toFixed(2);
}

/* --- CHECKOUT WHATSAPP --- */
function checkoutWhatsApp() {
    if(cart.length === 0) return alert("Agrega productos primero");
    
    let msg = "Hola! Quiero realizar el siguiente pedido:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        msg += `- ${item.name} ($${item.price})\n`;
        total += item.price;
    });
    
    msg += `\n*TOTAL: $${total.toFixed(2)}*`;
    msg += "\n\nDirección de envío: ";
    
    // Reemplaza con el número de la pizzería
    const phone = "5491112345678"; 
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* --- TOAST --- */
function showToast(productName) {
    const toast = document.getElementById("toast");
    toast.innerHTML = `${productName} agregado <i class="fa-solid fa-check"></i>`;
    toast.className = "show";
    setTimeout(() => toast.className = toast.className.replace("show", ""), 3000);
}

/* --- SMOOTH SCROLL --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
/* --- FILTRO DEL MENÚ (Categorías) --- */
const filterTabs = document.querySelectorAll('.menu-tab');
const menuItems = document.querySelectorAll('.pizza-card');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 1. Remover la clase 'active' de todos los botones
        filterTabs.forEach(t => t.classList.remove('active'));
        
        // 2. Agregar la clase 'active' al botón que se clickeó
        tab.classList.add('active');

        // 3. Obtener el valor de la categoría a filtrar
        const filterValue = tab.getAttribute('data-filter');

        // 4. Filtrar los items
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');

            if (filterValue === 'all' || filterValue === itemCategory) {
                // Mostrar el item
                item.style.display = 'block';
                
                // Pequeña animación de reaparición (opcional)
                item.style.opacity = '0';
                setTimeout(() => item.style.opacity = '1', 50);
            } else {
                // Ocultar el item
                item.style.display = 'none';
            }
        });
    });
});