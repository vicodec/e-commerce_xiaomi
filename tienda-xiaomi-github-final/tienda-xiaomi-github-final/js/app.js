// ==========================================
// 1. MODELO (Datos y Divisas)
// ==========================================
class ProductModel {
  constructor() {
    this.phoneWhatsApp = "51987654321"; // Número de WhatsApp de la tienda en Arequipa
    
    this.products = [
      { id: 1, category: "smartphones", name: "Xiaomi Redmi Note 13 Pro", pricePEN: 1299, image: "https://via.placeholder.com/200?text=Redmi+Note+13+Pro" },
      { id: 2, category: "smartphones", name: "Xiaomi Poco X6 Pro 5G", pricePEN: 1599, image: "https://via.placeholder.com/200?text=Poco+X6+Pro" },
      { id: 3, category: "wearables", name: "Xiaomi Smart Band 8", pricePEN: 169, image: "https://via.placeholder.com/200?text=Smart+Band+8" },
      { id: 4, category: "wearables", name: "Xiaomi Watch S3", pricePEN: 599, image: "https://via.placeholder.com/200?text=Watch+S3" },
      { id: 5, category: "tablets", name: "Xiaomi Pad 6", pricePEN: 1399, image: "https://via.placeholder.com/200?text=Xiaomi+Pad+6" },
      { id: 6, category: "tablets", name: "Redmi Pad SE", pricePEN: 699, image: "https://via.placeholder.com/200?text=Redmi+Pad+SE" }
    ];

    this.rates = { PEN: 1, USD: 0.27, EUR: 0.25, CLP: 250.5, MXN: 4.85, COP: 1050.0, ARS: 255.0 };
    this.symbols = { PEN: "S/", USD: "$", EUR: "€", CLP: "CLP$", MXN: "MXN$", COP: "COP$", ARS: "ARS$" };
  }

  getProductsByCategory(category) {
    return this.products.filter(p => p.category === category);
  }

  async fetchExchangeRates() {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/PEN');
      const data = await response.json();
      if (data && data.rates) {
        this.rates = {
          PEN: 1,
          USD: data.rates.USD || this.rates.USD,
          EUR: data.rates.EUR || this.rates.EUR,
          CLP: data.rates.CLP || this.rates.CLP,
          MXN: data.rates.MXN || this.rates.MXN,
          COP: data.rates.COP || this.rates.COP,
          ARS: data.rates.ARS || this.rates.ARS
        };
      }
      return this.rates;
    } catch (error) {
      console.warn("Usando tasas de cambio locales:", error);
      return this.rates;
    }
  }

  convertPrice(pricePEN, targetCurrency) {
    const rate = this.rates[targetCurrency] || 1;
    const converted = pricePEN * rate;
    const symbol = this.symbols[targetCurrency] || "";
    
    if (['CLP', 'COP', 'ARS'].includes(targetCurrency)) {
      return `${symbol} ${Math.round(converted).toLocaleString('es-PE')}`;
    }
    return `${symbol} ${converted.toFixed(2)}`;
  }

  // Genera el enlace dinámico de WhatsApp con el nombre del producto
  getWhatsAppLink(productName) {
    const message = encodeURIComponent(`Hola Xiaomi Store Arequipa, deseo consultar sobre el producto: ${productName}`);
    return `https://wa.me/${this.phoneWhatsApp}?text=${message}`;
  }
}

// ==========================================
// 2. VISTA (Renderizado e Interfaz)
// ==========================================
class ProductView {
  constructor() {
    this.rateStatus = document.getElementById('rate-status');
  }

  displayStatus(mensaje) {
    if (this.rateStatus) {
      this.rateStatus.innerHTML = `<i class="fa-solid fa-check"></i> ${mensaje}`;
    }
  }

  renderCategory(categoryId, products, model) {
    const container = document.getElementById(`catalog-${categoryId}`);
    if (!container) return;
    container.innerHTML = '';

    products.forEach(product => {
      const waLink = model.getWhatsAppLink(product.name);
      
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <h3 class="product-title">${product.name}</h3>
        
        <div class="product-prices">
          <span class="price-pen">S/ ${product.pricePEN.toFixed(2)} PEN</span>
          
          <div class="currency-selector-box">
            <label for="currency-${product.id}">Convertir precio:</label>
            <select id="currency-${product.id}" class="select-currency" data-product-id="${product.id}">
              <option value="USD">Dólares ($ USD)</option>
              <option value="EUR">Euros (€ EUR)</option>
              <option value="CLP">Pesos Chilenos (CLP)</option>
              <option value="MXN">Pesos Mexicanos (MXN)</option>
              <option value="COP">Pesos Colombianos (COP)</option>
              <option value="ARS">Pesos Argentinos (ARS)</option>
              <option value="PEN">Soles (S/ PEN)</option>
            </select>
          </div>

          <span id="converted-price-${product.id}" class="price-converted">
            ${model.convertPrice(product.pricePEN, 'USD')} USD
          </span>
        </div>

        <div class="card-actions">
          <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-consult">
            <i class="fab fa-whatsapp"></i> Consultar
          </a>
          <button class="btn-buy" onclick="alert('Producto agregado al carrito')">
            Comprar
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  updateSingleConvertedPrice(productId, convertedText) {
    const priceElement = document.getElementById(`converted-price-${productId}`);
    if (priceElement) priceElement.textContent = convertedText;
  }
}

// ==========================================
// 3. CONTROLADOR
// ==========================================
class ProductController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    await this.model.fetchExchangeRates();
    this.view.displayStatus("Divisas sincronizadas");

    const categories = ["smartphones", "wearables", "tablets"];
    categories.forEach(cat => {
      const products = this.model.getProductsByCategory(cat);
      this.view.renderCategory(cat, products, this.model);
    });

    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('change', (e) => {
      if (e.target && e.target.classList.contains('select-currency')) {
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        const targetCurrency = e.target.value;
        const product = this.model.products.find(p => p.id === productId);
        if (product) {
          const convertedText = `${this.model.convertPrice(product.pricePEN, targetCurrency)} ${targetCurrency}`;
          this.view.updateSingleConvertedPrice(productId, convertedText);
        }
      }
    });
  }
}

// ==========================================
// 4. INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const model = new ProductModel();
  const view = new ProductView();
  const controller = new ProductController(model, view);
  controller.init();
});