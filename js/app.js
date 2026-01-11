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
/* --- SISTEMA DE RESERVAS --- */
let selectedTableId = null;

function openReservationModal() {
    document.getElementById('reservationModal').classList.add('active');
    // Setear fecha mínima a hoy
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('resDate').min = now.toISOString().slice(0,16);
}

function closeReservationModal() {
    document.getElementById('reservationModal').classList.remove('active');
}

// Lógica de simulación y validación
function simulateTables() {
    const dateInput = document.getElementById('resDate').value;
    const grid = document.getElementById('tablesGrid');
    const msg = document.getElementById('tableSelectionMsg');
    
    if(!dateInput) return;

    const dateObj = new Date(dateInput);
    const day = dateObj.getDay(); // 0 Domingo, 1 Lunes...
    const hour = dateObj.getHours();

    // 1. VALIDACIÓN DE HORARIO
    // Lunes (1) cerrado. Horario: 10 a 23.
    if (day === 1) {
        alert("Lo sentimos, los lunes estamos cerrados.");
        document.getElementById('resDate').value = "";
        grid.innerHTML = "";
        return;
    }
    if (hour < 10 || hour >= 23) {
        alert("El horario de reservas es de 10:00 a 23:00 hs.");
        document.getElementById('resDate').value = "";
        grid.innerHTML = "";
        return;
    }

    // 2. GENERAR 20 MESAS (Simulación)
    grid.innerHTML = "";
    selectedTableId = null;
    msg.innerText = "Selecciona una mesa libre";

    // Usamos la fecha como 'semilla' simple para que si elige la misma fecha, 
    // la ocupación sea la misma (simulado).
    const seed = dateObj.getDate() + dateObj.getHours();

    for (let i = 1; i <= 20; i++) {
        const table = document.createElement('div');
        table.innerText = i;
        table.className = 'table-box';

        // Simular ocupación: (Si la suma de fecha+hora+mesa es par, está ocupada - ejemplo simple)
        // O un random simple:
        const isOccupied = Math.random() < 0.4; // 40% de probabilidad de estar ocupada

        if (isOccupied) {
            table.classList.add('occupied');
            table.title = "Mesa Ocupada";
        } else {
            table.classList.add('available');
            table.title = "Mesa Libre";
            table.onclick = () => selectTable(i, table);
        }

        grid.appendChild(table);
    }
}

function selectTable(id, element) {
    // Remover selección previa
    document.querySelectorAll('.table-box').forEach(t => t.classList.remove('selected'));
    
    // Seleccionar nueva
    element.classList.add('selected');
    selectedTableId = id;
    document.getElementById('tableSelectionMsg').innerText = `Mesa #${id} seleccionada`;
}

function confirmReservation() {
    const name = document.getElementById('resName').value;
    const dni = document.getElementById('resDNI').value;
    const phone = document.getElementById('resPhone').value;
    const people = document.getElementById('resPeople').value;
    const date = document.getElementById('resDate').value;

    if (!name || !dni || !phone || !people || !date) {
        return alert("Por favor completa todos los datos.");
    }
    if (!selectedTableId) {
        return alert("Debes seleccionar una mesa verde del mapa.");
    }

    // Formatear mensaje para WhatsApp
    const dateFormatted = new Date(date).toLocaleString();
    const msg = `Hola! Quiero confirmar una RESERVA:%0A%0A` +
                `👤 Nombre: ${name}%0A` +
                `🆔 DNI: ${dni}%0A` +
                `📞 Contacto: ${phone}%0A` +
                `👥 Personas: ${people}%0A` +
                `📅 Fecha: ${dateFormatted}%0A` +
                `🪑 Mesa N°: ${selectedTableId}`;

    const whatsappNumber = "5491112345678"; // Reemplaza con tu número
    
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    
    closeReservationModal();
    showToast(`Reserva enviada para Mesa #${selectedTableId}`);
}