import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

export interface InventoryLowStock {
  name: string;
  code: string;
  branch_name: string;
  current_stock: number | string;
  minimum_stock: number | string;
}

export type LowStockStatus = 'ALL' | 'OUT_OF_STOCK' | 'CRITICAL' | 'LOW';

@Component({
  selector: 'app-inventory-low-stock',
  templateUrl: './inventory-low-stock.component.html',
  styleUrls: ['./inventory-low-stock.component.scss']
})
export class InventoryLowStockComponent implements OnChanges {

  @Input() bajoStock: InventoryLowStock[] = [];
  @Input() loading: boolean = false;

  textoBusqueda: string = '';
  estadoSeleccionado: LowStockStatus = 'ALL';

  registrosFiltrados: InventoryLowStock[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bajoStock']) {
      this.filtrarRegistros();
    }
  }

  filtrarRegistros(): void {
    const busqueda: string = this.textoBusqueda.trim().toLowerCase();

    this.registrosFiltrados = (this.bajoStock ?? [])
      .filter((item: InventoryLowStock) => {
        const contenido: string = [
          item.name,
          item.code,
          item.branch_name
        ]
          .filter((valor: string | null | undefined) => !!valor)
          .join(' ')
          .toLowerCase();

        const coincideBusqueda: boolean =
          !busqueda || contenido.includes(busqueda);

        const coincideEstado: boolean =
          this.estadoSeleccionado === 'ALL' ||
          this.obtenerEstado(item) === this.estadoSeleccionado;

        return coincideBusqueda && coincideEstado;
      })
      .sort(
        (a: InventoryLowStock, b: InventoryLowStock) =>
          this.obtenerPrioridad(b) - this.obtenerPrioridad(a)
      );
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarRegistros();
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.estadoSeleccionado = 'ALL';
    this.filtrarRegistros();
  }

  obtenerStockActual(item: InventoryLowStock): number {
    return Number(item.current_stock ?? 0);
  }

  obtenerStockMinimo(item: InventoryLowStock): number {
    return Number(item.minimum_stock ?? 0);
  }

  obtenerEstado(item: InventoryLowStock): Exclude<LowStockStatus, 'ALL'> {
    const actual: number = this.obtenerStockActual(item);
    const minimo: number = this.obtenerStockMinimo(item);

    if (actual <= 0) {
      return 'OUT_OF_STOCK';
    }

    if (minimo > 0 && actual <= minimo * 0.5) {
      return 'CRITICAL';
    }

    return 'LOW';
  }

  obtenerEstadoTexto(item: InventoryLowStock): string {
    const estado: Exclude<LowStockStatus, 'ALL'> = this.obtenerEstado(item);

    const estados: Record<Exclude<LowStockStatus, 'ALL'>, string> = {
      OUT_OF_STOCK: 'Agotado',
      CRITICAL: 'Crítico',
      LOW: 'Stock bajo'
    };

    return estados[estado];
  }

  obtenerClaseEstado(item: InventoryLowStock): string {
    const clases: Record<Exclude<LowStockStatus, 'ALL'>, string> = {
      OUT_OF_STOCK: 'out-of-stock',
      CRITICAL: 'critical',
      LOW: 'low'
    };

    return clases[this.obtenerEstado(item)];
  }

  obtenerIconoEstado(item: InventoryLowStock): string {
    const iconos: Record<Exclude<LowStockStatus, 'ALL'>, string> = {
      OUT_OF_STOCK: 'remove_shopping_cart',
      CRITICAL: 'error_outline',
      LOW: 'warning_amber'
    };

    return iconos[this.obtenerEstado(item)];
  }

  obtenerCantidadReposicion(item: InventoryLowStock): number {
    const actual: number = this.obtenerStockActual(item);
    const minimo: number = this.obtenerStockMinimo(item);

    if (minimo <= 0) {
      return actual <= 0 ? 1 : 0;
    }

    return Math.max(minimo - actual, 0);
  }

  obtenerStockObjetivo(item: InventoryLowStock): number {
    const minimo: number = this.obtenerStockMinimo(item);

    if (minimo <= 0) {
      return 1;
    }

    return minimo;
  }

  obtenerPorcentajeStock(item: InventoryLowStock): number {
    const actual: number = this.obtenerStockActual(item);
    const minimo: number = this.obtenerStockMinimo(item);

    if (actual <= 0) {
      return 0;
    }

    if (minimo <= 0) {
      return 0;
    }

    return Math.min((actual / minimo) * 100, 100);
  }

  obtenerPrioridad(item: InventoryLowStock): number {
    const estado: Exclude<LowStockStatus, 'ALL'> = this.obtenerEstado(item);

    const prioridades: Record<Exclude<LowStockStatus, 'ALL'>, number> = {
      OUT_OF_STOCK: 3,
      CRITICAL: 2,
      LOW: 1
    };

    return prioridades[estado];
  }

  obtenerInicial(nombre: string | null | undefined): string {
    return nombre?.trim().charAt(0).toUpperCase() || 'P';
  }

  get totalAgotados(): number {
    return (this.bajoStock ?? []).filter(
      (item: InventoryLowStock) =>
        this.obtenerEstado(item) === 'OUT_OF_STOCK'
    ).length;
  }

  get totalCriticos(): number {
    return (this.bajoStock ?? []).filter(
      (item: InventoryLowStock) =>
        this.obtenerEstado(item) === 'CRITICAL'
    ).length;
  }

  get totalBajos(): number {
    return (this.bajoStock ?? []).filter(
      (item: InventoryLowStock) =>
        this.obtenerEstado(item) === 'LOW'
    ).length;
  }

  get totalUnidadesReposicion(): number {
    return this.registrosFiltrados.reduce(
      (total: number, item: InventoryLowStock) =>
        total + this.obtenerCantidadReposicion(item),
      0
    );
  }

  trackByLowStock(index: number, item: InventoryLowStock): string {
    return `${item.code}-${item.branch_name}`;
  }
}
