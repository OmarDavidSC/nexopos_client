import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

export interface InventoryBranch {
  branch: string;
  total_products: number | string;
  total_stock: number | string;
  inventory_value: number | string;
}

export type InventoryBranchOrder = 'VALUE' | 'STOCK' | 'PRODUCTS' | 'NAME';

@Component({
  selector: 'app-inventory-branch',
  templateUrl: './inventory-branch.component.html',
  styleUrls: ['./inventory-branch.component.scss']
})
export class InventoryBranchComponent implements OnChanges {

  @Input() porSucursal: InventoryBranch[] = [];
  @Input() loading: boolean = false;
  @Input() currencySymbol: string = 'S/';

  textoBusqueda: string = '';
  ordenSeleccionado: InventoryBranchOrder = 'VALUE';
  sucursalesFiltradas: InventoryBranch[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['porSucursal']) {
      this.filtrarSucursales();
    }
  }

  filtrarSucursales(): void {
    const busqueda: string = this.textoBusqueda.trim().toLowerCase();

    this.sucursalesFiltradas = (this.porSucursal ?? [])
      .filter((item: InventoryBranch) => {
        const nombre: string = (item.branch || 'Sin sucursal').toLowerCase();
        return !busqueda || nombre.includes(busqueda);
      })
      .sort((a: InventoryBranch, b: InventoryBranch) => this.compararSucursales(a, b));
  }

  compararSucursales(a: InventoryBranch, b: InventoryBranch): number {
    switch (this.ordenSeleccionado) {
      case 'STOCK':
        return this.obtenerStock(b) - this.obtenerStock(a);
      case 'PRODUCTS':
        return this.obtenerProductos(b) - this.obtenerProductos(a);
      case 'NAME':
        return (a.branch || '').localeCompare(b.branch || '');
      case 'VALUE':
      default:
        return this.obtenerValor(b) - this.obtenerValor(a);
    }
  }

  cambiarOrden(): void {
    this.filtrarSucursales();
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarSucursales();
  }

  obtenerProductos(item: InventoryBranch): number {
    return Number(item.total_products ?? 0);
  }

  obtenerStock(item: InventoryBranch): number {
    return Number(item.total_stock ?? 0);
  }

  obtenerValor(item: InventoryBranch): number {
    return Number(item.inventory_value ?? 0);
  }

  obtenerParticipacionValor(item: InventoryBranch): number {
    if (this.totalValor <= 0) {
      return 0;
    }

    return (this.obtenerValor(item) / this.totalValor) * 100;
  }

  obtenerParticipacionStock(item: InventoryBranch): number {
    if (this.totalStock <= 0) {
      return 0;
    }

    return (this.obtenerStock(item) / this.totalStock) * 100;
  }

  obtenerPorcentajeComparativo(item: InventoryBranch): number {
    const maximo: number = this.obtenerValorMaximo();

    if (maximo <= 0) {
      return 0;
    }

    return Math.min((this.obtenerValor(item) / maximo) * 100, 100);
  }

  obtenerValorMaximo(): number {
    if (!this.sucursalesFiltradas.length) {
      return 0;
    }

    return Math.max(
      ...this.sucursalesFiltradas.map(
        (item: InventoryBranch) => this.obtenerValor(item)
      )
    );
  }

  obtenerInicial(nombre: string | null | undefined): string {
    return nombre?.trim().charAt(0).toUpperCase() || 'S';
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

  get totalSucursales(): number {
    return this.sucursalesFiltradas.length;
  }

  get totalProductos(): number {
    return this.sucursalesFiltradas.reduce(
      (total: number, item: InventoryBranch) =>
        total + this.obtenerProductos(item),
      0
    );
  }

  get totalStock(): number {
    return this.sucursalesFiltradas.reduce(
      (total: number, item: InventoryBranch) =>
        total + this.obtenerStock(item),
      0
    );
  }

  get totalValor(): number {
    return this.sucursalesFiltradas.reduce(
      (total: number, item: InventoryBranch) =>
        total + this.obtenerValor(item),
      0
    );
  }

  get promedioValorSucursal(): number {
    if (!this.totalSucursales) {
      return 0;
    }

    return this.totalValor / this.totalSucursales;
  }

  trackBySucursal(index: number, item: InventoryBranch): string {
    return item.branch || `branch-${index}`;
  }
}
