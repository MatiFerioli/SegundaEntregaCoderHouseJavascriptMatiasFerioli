const menu = [
  {
    id: 1,
    nombre: "Hamburguesa",
    precio: 12000,
    imagen: "./assets/hamburguesa.jfif",
    descripcion: "Hamburguesa con carne, queso, lechuga y tomate",
  },
  {
    id: 2,
    nombre: "Milanesa",
    precio: 14000,
    imagen: "/assets/milanesa.jfif",
    descripcion: "Sandwich de milanesa de carne o pollo",
  },
  {
    id: 3,
    nombre: "Papas fritas",
    precio: 6000,
    imagen: "assets/papasfritas.jfif",
    descripcion: "Papas fritas solas o con cheddar y bacon",
  },
  {
    id: 4,
    nombre: "Lomito",
    precio: 15000,
    imagen: "assets/lomito.jfif",
    descripcion: "Sandwich de lomo completo con lechuga, tomate y mayonesa",
  },
  {
    id: 5,
    nombre: "Choripan",
    precio: 10000,
    imagen: "assets/choripan.jfif",
    descripcion: "Choripan con chimichurri",
  },
  {
    id: 6,
    nombre: "Pizza",
    precio: 11000,
    imagen: "assets/pizza.jfif",
    descripcion: "Pizza con mozzarella, salame y aceitunas",
  },
  {
    id: 7,
    nombre: "Empanadas",
    precio: 4000,
    imagen: "assets/empanadas.jfif",
    descripcion: "Empanadas de carne o pollo",
  },
  {
    id: 8,
    nombre: "Gaseosa",
    precio: 3500,
    imagen: "assets/gaseosas.jfif",
    descripcion: "Gaseosa de 330ml",
  },
  {
    id: 9,
    nombre: "Agua",
    precio: 3000,
    imagen: "assets/agua.jfif",
    descripcion: "Agua mineral 500ml",
  },
  {
    id: 10,
    nombre: "Cerveza",
    precio: 5500,
    imagen: "assets/cerveza.jfif",
    descripcion: "Cerveza artesanal 1L",
  },
];

// Carrito de compras
let carrito = [];
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
} else {
  carrito = [];
}

// Obtengo los elementos del HTML
const menuItemsContainer = document.getElementById("menu-items");
const cartItemsContainer = document.getElementById("cart-items");
const cartCountElement = document.getElementById("cart-count");
const cartTotalElement = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const cartSection = document.getElementById("cart-section");
const paymentSection = document.getElementById("payment-section");
const receiptSection = document.getElementById("receipt-section");
const paymentForm = document.getElementById("payment-form");
const customerPaymentInput = document.getElementById("customer-payment");
const paymentTotalElement = document.getElementById("payment-total");
const cancelPaymentBtn = document.getElementById("cancel-payment-btn");
const receiptTotalElement = document.getElementById("receipt-total");
const receiptPaymentElement = document.getElementById("receipt-payment");
const receiptChangeElement = document.getElementById("receipt-change");
const newOrderBtn = document.getElementById("new-order-btn");

// Función para mostrar los productos del menú en la página
function mostrarMenu() {
  menuItemsContainer.innerHTML = "";

  // Recorro el array de productos y creo un elemento para cada uno
  for (let i = 0; i < menu.length; i++) {
    // Div para el producto
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";

    // Agrego el contenido HTML del producto
    menuItem.innerHTML = `
            <img src="${menu[i].imagen}" alt="${menu[i].nombre}">
            <div class="menu-item-info">
                <h3 class="menu-item-title">${menu[i].nombre}</h3>
                <p>${menu[i].descripcion}</p>
                <p class="menu-item-price">$${menu[i].precio}</p>
                <button class="btn-primary add-to-cart-btn" data-id="${menu[i].id}">Agregar al Pedido</button>
            </div>
        `;
    menuItemsContainer.appendChild(menuItem);
  }

  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  for (let i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", agregarAlCarrito);
  }
}

// Función para agregar un producto al carrito
function agregarAlCarrito(event) {
  const productoId = Number.parseInt(event.target.getAttribute("data-id"));
  let productoSeleccionado = null;
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].id === productoId) {
      productoSeleccionado = menu[i];
      break;
    }
  }

  // Verificación del producto si ya está en el carrito
  let productoEncontrado = false;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === productoId) {
      carrito[i].cantidad = carrito[i].cantidad + 1;
      productoEncontrado = true;
      break;
    }
  }

  // Si no está en el carrito, agregamos el producto
  if (!productoEncontrado) {
    carrito.push({
      id: productoSeleccionado.id,
      nombre: productoSeleccionado.nombre,
      precio: productoSeleccionado.precio,
      cantidad: 1,
    });
  }

  // Guardo el carrito en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarCarrito();
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
  cartItemsContainer.innerHTML = "";

  // Si el carrito está vacío, muestro un mensaje
  if (carrito.length === 0) {
    cartItemsContainer.innerHTML = "<p>No hay productos en tu pedido</p>";
    checkoutBtn.disabled = true;
    clearCartBtn.disabled = true;
  } else {
    // Si hay productos, habilito los botones
    checkoutBtn.disabled = false;
    clearCartBtn.disabled = false;

    // Recorro el carrito y creo un elemento para cada producto
    for (let i = 0; i < carrito.length; i++) {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      // Agrego el contenido HTML del producto
    cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${carrito[i].nombre}</h4>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-btn" data-id="${carrito[i].id}">-</button>
                        <span>${carrito[i].cantidad}</span>
                        <button class="quantity-btn increase-btn" data-id="${carrito[i].id}">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <p>$${carrito[i].precio * carrito[i].cantidad}</p>
                    <button class="remove-btn" data-id="${carrito[i].id}">Eliminar</button>
                </div>
            `;
     // Agrego el producto al contenedor del carrito
      cartItemsContainer.appendChild(cartItem);
    }

    // Todos los botones de disminuir, aumentar y eliminar
    const decreaseBtns = document.querySelectorAll(".decrease-btn");
    const increaseBtns = document.querySelectorAll(".increase-btn");
    const removeBtns = document.querySelectorAll(".remove-btn");

    // Botones de disminuir
    for (let i = 0; i < decreaseBtns.length; i++) {
      decreaseBtns[i].addEventListener("click", disminuirCantidad);
    }

    // Botones de aumentar
    for (let i = 0; i < increaseBtns.length; i++) {
      increaseBtns[i].addEventListener("click", aumentarCantidad);
    }

    // Botones de eliminar
    for (let i = 0; i < removeBtns.length; i++) {
      removeBtns[i].addEventListener("click", eliminarDelCarrito);
    }
  }

  // Actualizo el contador y el total
  actualizarContadorYTotal();
}

// Disminución de la cantidad de un producto
function disminuirCantidad(event) {
  const productoId = Number.parseInt(event.target.getAttribute("data-id"));

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === productoId) {
      if (carrito[i].cantidad > 1) {
        carrito[i].cantidad = carrito[i].cantidad - 1;
      } else {
        carrito.splice(i, 1);
      }
      break;
    }
  }

  // Guardo el carrito en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarCarrito();
}

// Función para aumentar la cantidad de un producto
function aumentarCantidad(event) {
  // ID del producto
  const productoId = Number.parseInt(event.target.getAttribute("data-id"));

  // Busco el producto en el carrito
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === productoId) {
      carrito[i].cantidad = carrito[i].cantidad + 1;
      break;
    }
  }

  // Guardo el carro en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarCarrito();
}

// Eliminar producto del carro
function eliminarDelCarrito(event) {
  const productoId = Number.parseInt(event.target.getAttribute("data-id"));

  // Creo un nuevo array sin el producto eliminado
  const nuevoCarrito = [];
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id !== productoId) {
      nuevoCarrito.push(carrito[i]);
    }
  }

  // Actualizo el carrito
  carrito = nuevoCarrito;

  // Guardo el carrito en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarCarrito();
}

// Función para actualizar el contador y el total del carrito
function actualizarContadorYTotal() {
  let cantidadTotal = 0;
  for (let i = 0; i < carrito.length; i++) {
    cantidadTotal = cantidadTotal + carrito[i].cantidad;
  }

  // Calculos del precio
  let precioTotal = 0;
  for (let i = 0; i < carrito.length; i++) {
    precioTotal = precioTotal + carrito[i].precio * carrito[i].cantidad;
  }

  // Actualizo los elementos en el HTML
  cartCountElement.textContent = cantidadTotal;
  cartTotalElement.textContent = precioTotal;
  paymentTotalElement.textContent = precioTotal;
}

// Función para vaciar el carrito
function vaciarCarrito() {
  carrito = [];

// Guardo el carro vacío en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  actualizarCarrito();
}

// Función para mostrar la sección de pago
function mostrarPago() {
  cartSection.classList.add("hidden");

  paymentSection.classList.remove("hidden");

  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total = total + carrito[i].precio * carrito[i].cantidad;
  }

  // Mínimo del input de pago al total del carrito
  customerPaymentInput.min = total;
  customerPaymentInput.value = total;
}

// Función para cancelar el pago y volver al carrito
function cancelarPago() {
  paymentSection.classList.add("hidden");

  cartSection.classList.remove("hidden");
}

// Función para procesar el pago
function procesarPago(event) {
  event.preventDefault();

  // Calculo total a pagar
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total = total + carrito[i].precio * carrito[i].cantidad;
  }

  // Obtengo el monto ingresado por el usuario
  const pago = Number.parseFloat(customerPaymentInput.value);

  // Verifico que el pago sea correcto
  if (pago < total) {
    alert("El monto ingresado es menor al total a pagar");
    return;
  }

  // Calculo el vuelto
  const vuelto = pago - total;

  // Actualizo los elementos del recibo
  receiptTotalElement.textContent = total;
  receiptPaymentElement.textContent = pago;
  receiptChangeElement.textContent = vuelto;

  // Oculto sección pago
  paymentSection.classList.add("hidden");

  // Muestro recibo
  receiptSection.classList.remove("hidden");

  vaciarCarrito();
}

// Iniciar nuevo pedido
function nuevoPedido() {
   receiptSection.classList.add("hidden");
   cartSection.classList.remove("hidden");
}

// Inicio app
function inicializarApp() {
  mostrarMenu();

  actualizarCarrito();

  // Eventos botones principales
  checkoutBtn.addEventListener("click", mostrarPago);
  clearCartBtn.addEventListener("click", vaciarCarrito);
  cancelPaymentBtn.addEventListener("click", cancelarPago);
  paymentForm.addEventListener("submit", procesarPago);
  newOrderBtn.addEventListener("click", nuevoPedido);
}

inicializarApp();
