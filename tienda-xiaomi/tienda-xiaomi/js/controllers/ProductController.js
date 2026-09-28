export class ProductController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async init() {
    // 1. Cargar tipo de cambio desde el puente digital (API)
    const rate = await this.model.fetchExchangeRate();
    this.view.displayExchangeRate(rate);

    // 2. Obtener productos y renderizar la vista
    const products = this.model.getProducts();
    this.view.renderProducts(products, this.model);
  }
}