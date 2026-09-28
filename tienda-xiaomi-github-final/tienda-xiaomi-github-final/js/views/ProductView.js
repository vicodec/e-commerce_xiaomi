export class ProductView {
  constructor() {
    this.catalogContainer = document.getElementById('catalog-container');
    this.rateStatus = document.getElementById('rate-status');
  }

  // Actualiza el banner informativo del Puente Digital
  displayExchangeRate(rate) {
    if (this.rateStatus) {
      this.rateStatus.textContent = `Tipo de cambio en vivo: 1 USD = S/ ${rate.toFixed(2)}`;
    }
  }

  // Renderiza el catálogo de productos
  renderProducts(products, model) {
    if (!this.catalogContainer) return;
    this.catalogContainer.innerHTML = '';

    products.forEach(product => {
      const priceUSD = model.convertToUSD(product.pricePEN);
      
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-prices">
          <span class="price-pen">S/ ${product.pricePEN.toFixed(2)}</span>
          <span class="price-usd">($ ${priceUSD} USD)</span>
        </div>
        <button class="btn-buy" onclick="alert('Producto agregado al carrito de Xiaomi Arequipa')">
          Comprar ahora
        </button>
      `;
      this.catalogContainer.appendChild(card);
    });
  }
}