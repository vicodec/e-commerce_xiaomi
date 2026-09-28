// Catálogo inicial de 20 productos de Xiaomi Arequipa
const productos = [
  { id: 1, nombre: "Xiaomi 13T Pro", categoria: "smartphones", precio: 2899, img: "https://via.placeholder.com/200?text=13T+Pro" },
  { id: 2, nombre: "Redmi Note 13 Pro 5G", categoria: "smartphones", precio: 1299, img: "https://via.placeholder.com/200?text=Note+13+Pro" },
  { id: 3, nombre: "Poco X6 Pro", categoria: "smartphones", precio: 1399, img: "https://via.placeholder.com/200?text=Poco+X6+Pro" },
  { id: 4, nombre: "Redmi 13C", categoria: "smartphones", precio: 499, img: "https://via.placeholder.com/200?text=Redmi+13C" },
  { id: 5, nombre: "Xiaomi Smart Band 8", categoria: "wearables", precio: 149, img: "https://via.placeholder.com/200?text=Band+8" },
  { id: 6, nombre: "Redmi Watch 4", categoria: "wearables", precio: 349, img: "https://via.placeholder.com/200?text=Redmi+Watch+4" },
  { id: 7, nombre: "Xiaomi Watch 2 Pro", categoria: "wearables", precio: 899, img: "https://via.placeholder.com/200?text=Watch+2+Pro" },
  { id: 8, nombre: "Redmi Buds 5", categoria: "audio", precio: 119, img: "https://via.placeholder.com/200?text=Buds+5" },
  { id: 9, nombre: "Redmi Buds 5 Pro", categoria: "audio", precio: 249, img: "https://via.placeholder.com/200?text=Buds+5+Pro" },
  { id: 10, nombre: "Xiaomi Sound Outdoor", categoria: "audio", precio: 179, img: "https://via.placeholder.com/200?text=Sound+Outdoor" },
  { id: 11, nombre: "Xiaomi Robot Vacuum S10", categoria: "hogar", precio: 849, img: "https://via.placeholder.com/200?text=Vacuum+S10" },
  { id: 12, nombre: "Mi Smart Air Fryer 3.5L", categoria: "hogar", precio: 299, img: "https://via.placeholder.com/200?text=Air+Fryer" },
  { id: 13, nombre: "Xiaomi Smart Camera C300", categoria: "hogar", precio: 139, img: "https://via.placeholder.com/200?text=Camera+C300" },
  { id: 14, nombre: "Xiaomi Electric Scooter 4", categoria: "hogar", precio: 1599, img: "https://via.placeholder.com/200?text=Scooter+4" },
  { id: 15, nombre: "Xiaomi Pad 6", categoria: "smartphones", precio: 1199, img: "https://via.placeholder.com/200?text=Pad+6" },
  { id: 16, nombre: "Redmi Pad SE", categoria: "smartphones", precio: 599, img: "https://via.placeholder.com/200?text=Pad+SE" },
  { id: 17, nombre: "Xiaomi Smart Kettle Pro", categoria: "hogar", precio: 189, img: "https://via.placeholder.com/200?text=Kettle+Pro" },
  { id: 18, nombre: "Xiaomi Power Bank 10000mAh", categoria: "audio", precio: 79, img: "https://via.placeholder.com/200?text=Power+Bank" },
  { id: 19, nombre: "Mi Body Composition Scale 2", categoria: "hogar", precio: 89, img: "https://via.placeholder.com/200?text=Scale+2" },
  { id: 20, nombre: "Xiaomi Lightbar Monitor", categoria: "hogar", precio: 159, img: "https://via.placeholder.com/200?text=Lightbar" }
];

let carrito = [];

function renderizarProductos(lista) {
  const contenedor = document.getElementById("gridProductos");
  contenedor.innerHTML = "";
  lista.forEach(p => {
    contenedor.innerHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.nombre}">
        <div>
          <span class="categoria">${p.categoria}</span>
          <h3>${p.nombre}</h3>
          <div class="precio">S/ ${p.precio.toFixed(2)}</div>
        </div>
        <button class="btn-add" onclick="agregarAlCarrito(${p.id})">Añadir al Carrito</button>
      </div>
    `;
  });
}

function filtrarCatálogo() {
  const texto = document.getElementById("searchInput").value.toLowerCase();
  const cat = document.getElementById("categoryFilter").value;

  const filtrados = productos.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(texto);
    const coincideCat = (cat === "todas" || p.categoria === cat);
    return coincideTexto && coincideCat;
  });

  renderizarProductos(filtrados);
}

function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  carrito.push(prod);
  actualizarCarrito();
}

function actualizarCarrito() {
  document.getElementById("cart-count").innerText = carrito.length;
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = "";
  
  let total = 0;
  carrito.forEach((item, index) => {
    total += item.precio;
    cartList.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.nombre}</strong><br>
          <small>S/ ${item.precio.toFixed(2)}</small>
        </div>
        <button style="background:none; border:none; color:#ff4d4d; cursor:pointer;" onclick="eliminarDelCarrito(${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  });

  document.getElementById("cartTotal").innerText = `Total: S/ ${total.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function abrirModal() { document.getElementById("modalCart").classList.add("active"); }
function cerrarModal() { document.getElementById("modalCart").classList.remove("active"); }

function enviarWhatsApp(e) {
  e.preventDefault();
  if (carrito.length === 0) {
    alert("Tu carrito está vacío. Agrega al menos un producto.");
    return;
  }

  const tipoDoc = document.getElementById("tipoDoc").value;
  const numDoc = document.getElementById("numDoc").value;
  const nombre = document.getElementById("nombreCliente").value;

  let resumen = `*NUEVO PEDIDO - XIAOMI STORE AREQUIPA*\n`;
  resumen += `------------------------------------\n`;
  resumen += `*Cliente:* ${nombre}\n`;
  resumen += `*Comprobante:* ${tipoDoc} (${numDoc})\n\n`;
  resumen += `*Productos:*\n`;

  let total = 0;
  carrito.forEach(item => {
    resumen += `- ${item.nombre} (S/ ${item.precio.toFixed(2)})\n`;
    total += item.precio;
  });

  resumen += `\n*TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n`;
  resumen += `------------------------------------\n`;
  resumen += `_Solicito coordinar la entrega y método de pago._`;

  const numTelefono = "51987654321"; // Cambia este número por el tuyo
  const url = `https://api.whatsapp.com/send?phone=${numTelefono}&text=${encodeURIComponent(resumen)}`;
  
  window.open(url, "_blank");
}

// Cargar catálogo al inicio
renderizarProductos(productos);
