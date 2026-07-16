import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

export interface InventoryCategory {
  category: string;
  total_products: number | string;
  total_stock: number | string;
  inventory_value: number | string;
}

export type InventoryCategoryOrder = 'VALUE' | 'STOCK' | 'PRODUCTS' | 'NAME';

@Component({
  selector: 'app-inventory-category',
  templateUrl: './inventory-category.component.html',
  styleUrls: ['./inventory-category.component.scss']
})
export class InventoryCategoryComponent implements OnChanges {

  @Input() porCategoria: InventoryCategory[] = [];
  @Input() loading: boolean = false;
  @Input() currencySymbol: string = 'S/';

  textoBusqueda: string = '';
  ordenSeleccionado: InventoryCategoryOrder = 'VALUE';
  categoriasFiltradas: InventoryCategory[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['porCategoria']) {
      this.filtrarCategorias();
    }
  }

  filtrarCategorias(): void {
    const busqueda: string = this.textoBusqueda.trim().toLowerCase();

    this.categoriasFiltradas = (this.porCategoria ?? [])
      .filter((item: InventoryCategory) => {
        const categoria: string = (item.category || 'Sin categoría').toLowerCase();
        return !busqueda || categoria.includes(busqueda);
      })
      .sort((a: InventoryCategory, b: InventoryCategory) => this.compararCategorias(a, b));
  }

  compararCategorias(a: InventoryCategory, b: InventoryCategory): number {
    switch (this.ordenSeleccionado) {
      case 'STOCK':
        return this.obtenerStock(b) - this.obtenerStock(a);

      case 'PRODUCTS':
        return this.obtenerProductos(b) - this.obtenerProductos(a);

      case 'NAME':
        return (a.category || '').localeCompare(b.category || '');

      case 'VALUE':
      default:
        return this.obtenerValor(b) - this.obtenerValor(a);
    }
  }

  cambiarOrden(): void {
    this.filtrarCategorias();
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarCategorias();
  }

  obtenerProductos(item: InventoryCategory): number {
    return Number(item.total_products ?? 0);
  }

  obtenerStock(item: InventoryCategory): number {
    return Number(item.total_stock ?? 0);
  }

  obtenerValor(item: InventoryCategory): number {
    return Number(item.inventory_value ?? 0);
  }

  obtenerParticipacionValor(item: InventoryCategory): number {
    if (this.totalValor <= 0) {
      return 0;
    }

    return (this.obtenerValor(item) / this.totalValor) * 100;
  }

  obtenerParticipacionStock(item: InventoryCategory): number {
    if (this.totalStock <= 0) {
      return 0;
    }

    return (this.obtenerStock(item) / this.totalStock) * 100;
  }

  obtenerPorcentajeComparativo(item: InventoryCategory): number {
    const valorMaximo: number = this.obtenerValorMaximo();

    if (valorMaximo <= 0) {
      return 0;
    }

    return Math.min((this.obtenerValor(item) / valorMaximo) * 100, 100);
  }

  obtenerValorMaximo(): number {
    if (!this.categoriasFiltradas.length) {
      return 0;
    }

    return Math.max(
      ...this.categoriasFiltradas.map(
        (item: InventoryCategory) => this.obtenerValor(item)
      )
    );
  }

  obtenerInicial(categoria: string | null | undefined): string {
    return categoria?.trim().charAt(0).toUpperCase() || 'C';
  }

  obtenerClasePosicion(index: number): string {
    if (index === 0) {
      return 'first';
    }

    if (index === 1) {
      return 'second';
    }

    if (index === 2) {
      return 'third';
    }

    return 'default';
  }

  get totalCategorias(): number {
    return this.categoriasFiltradas.length;
  }

  get totalProductos(): number {
    return this.categoriasFiltradas.reduce(
      (total: number, item: InventoryCategory) =>
        total + this.obtenerProductos(item),
      0
    );
  }

  get totalStock(): number {
    return this.categoriasFiltradas.reduce(
      (total: number, item: InventoryCategory) =>
        total + this.obtenerStock(item),
      0
    );
  }

  get totalValor(): number {
    return this.categoriasFiltradas.reduce(
      (total: number, item: InventoryCategory) =>
        total + this.obtenerValor(item),
      0
    );
  }

  get promedioValorCategoria(): number {
    if (!this.totalCategorias) {
      return 0;
    }

    return this.totalValor / this.totalCategorias;
  }

  trackByCategoria(index: number, item: InventoryCategory): string {
    return item.category || `category-${index}`;
  }
}
