export class ProductModel {
  constructor() {
    // Catálogo base de productos Xiaomi
    this.products = [
      { id: 1, name: "Xiaomi Redmi Note 13 Pro", pricePEN: 1299, image: "https://http2.mlstatic.com/D_NQ_NP_755593-MLA83226537631_032025-O.png" },
      { id: 2, name: "Xiaomi Poco X6 Pro 5G", pricePEN: 1599, image: "https://http2.mlstatic.com/D_NQ_NP_659009-MLA74193959545_012024-O.webp" },
      { id: 3, name: "Xiaomi Smart Band 8", pricePEN: 169, image: "https://via.placeholder.com/200?text=Smart+Band+8" },
      { id: 4, name: "Xiaomi Pad 6", pricePEN: 1399, image: "https://via.placeholder.com/200?text=Xiaomi+Pad+6" }
    ];
    this.exchangeRate = 3.75; // Valor por defecto
  }

  // Obtiene el catálogo de productos
  getProducts() {
    return this.products;
  }

  // Puente Digital: Conexión con la API de Tipo de Cambio (Sesión 2)
  async fetchExchangeRate() {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await response.json();
      if (data && data.rates && data.rates.PEN) {
        this.exchangeRate = data.rates.PEN;
      }
      return this.exchangeRate;
    } catch (error) {
      console.warn("Error al obtener tipo de cambio, usando valor local:", error);
      return this.exchangeRate;
    }
  }

  // Convierte Soles a Dólares
  convertToUSD(pricePEN) {
    return (pricePEN / this.exchangeRate).toFixed(2);
  }
}