import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

export type InventoryMovementType =
  | 'ENTRY'
  | 'EXIT'
  | 'SALE'
  | 'PURCHASE'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT'
  | 'RETURN'
  | 'TRANSFER';

export interface InventoryMovement {
  id: number;
  company_id: number;
  product_id: number;
  user_id: number;
  branch_id: number;
  type: InventoryMovementType | string;
  quantity: number | string;
  stock_before: number | string;
  stock_after: number | string;
  reference_type: string | null;
  reference_id: number | null;
  observation: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  product_name: string;
  code: string;
  user_name: string;
  branch_name?: string;
}

export interface InventoryMovementTypeOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-inventory-movements',
  templateUrl: './inventory-movements.component.html',
  styleUrls: ['./inventory-movements.component.scss']
})
export class InventoryMovementsComponent {

  @Input() movimientos: InventoryMovement[] = [];
  @Input() loading: boolean = false;

  textoBusqueda: string = '';
  tipoSeleccionado: string = 'ALL';

  paginaActual: number = 1;
  cantidadPorPagina: number = 8;

  movimientosFiltrados: InventoryMovement[] = [];
  movimientosPaginados: InventoryMovement[] = [];

  tiposMovimiento: InventoryMovementTypeOption[] = [
    { value: 'ALL', label: 'Todos los movimientos' },
    { value: 'PURCHASE', label: 'Compras' },
    { value: 'SALE', label: 'Ventas' },
    { value: 'ENTRY', label: 'Entradas' },
    { value: 'EXIT', label: 'Salidas' },
    { value: 'ADJUSTMENT_IN', label: 'Ajustes de entrada' },
    { value: 'ADJUSTMENT_OUT', label: 'Ajustes de salida' },
    { value: 'RETURN', label: 'Devoluciones' },
    { value: 'TRANSFER', label: 'Transferencias' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movimientos']) {
      this.paginaActual = 1;
      this.filtrarMovimientos();
    }
  }

  filtrarMovimientos(): void {
    const busqueda: string = this.textoBusqueda.trim().toLowerCase();

    this.movimientosFiltrados = (this.movimientos ?? []).filter((movimiento: InventoryMovement) => {
      const coincideTipo: boolean =
        this.tipoSeleccionado === 'ALL' ||
        movimiento.type === this.tipoSeleccionado;

      const contenido: string = [
        movimiento.product_name,
        movimiento.code,
        movimiento.user_name,
        movimiento.observation,
        movimiento.reference_type,
        movimiento.reference_id,
        movimiento.branch_name
      ]
        .filter((valor: unknown) => valor !== null && valor !== undefined)
        .join(' ')
        .toLowerCase();

      const coincideBusqueda: boolean =
        !busqueda || contenido.includes(busqueda);

      return coincideTipo && coincideBusqueda;
    });

    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    const inicio: number = (this.paginaActual - 1) * this.cantidadPorPagina;
    const fin: number = inicio + this.cantidadPorPagina;

    this.movimientosPaginados = this.movimientosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) {
      return;
    }

    this.paginaActual = pagina;
    this.actualizarPaginacion();
  }

  cambiarCantidadPorPagina(): void {
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarMovimientos();
  }

  get totalPaginas(): number {
    return Math.max(
      Math.ceil(this.movimientosFiltrados.length / this.cantidadPorPagina),
      1
    );
  }

  get numeroInicial(): number {
    if (!this.movimientosFiltrados.length) {
      return 0;
    }

    return (this.paginaActual - 1) * this.cantidadPorPagina + 1;
  }

  get numeroFinal(): number {
    return Math.min(
      this.paginaActual * this.cantidadPorPagina,
      this.movimientosFiltrados.length
    );
  }

  get totalEntradas(): number {
    return this.movimientosFiltrados
      .filter((movimiento: InventoryMovement) => this.esEntrada(movimiento.type))
      .reduce(
        (total: number, movimiento: InventoryMovement) =>
          total + this.obtenerNumero(movimiento.quantity),
        0
      );
  }

  get totalSalidas(): number {
    return this.movimientosFiltrados
      .filter((movimiento: InventoryMovement) => this.esSalida(movimiento.type))
      .reduce(
        (total: number, movimiento: InventoryMovement) =>
          total + this.obtenerNumero(movimiento.quantity),
        0
      );
  }

  obtenerNumero(valor: number | string | null | undefined): number {
    return Number(valor ?? 0);
  }

  esEntrada(tipo: string): boolean {
    return ['ENTRY', 'PURCHASE', 'ADJUSTMENT_IN', 'RETURN'].includes(tipo);
  }

  esSalida(tipo: string): boolean {
    return ['EXIT', 'SALE', 'ADJUSTMENT_OUT'].includes(tipo);
  }

  obtenerClaseMovimiento(tipo: string): string {
    const clases: { [key: string]: string } = {
      PURCHASE: 'purchase',
      SALE: 'sale',
      ENTRY: 'entry',
      EXIT: 'exit',
      ADJUSTMENT_IN: 'adjustment-in',
      ADJUSTMENT_OUT: 'adjustment-out',
      RETURN: 'return',
      TRANSFER: 'transfer'
    };

    return clases[tipo] ?? 'default';
  }

  obtenerIconoMovimiento(tipo: string): string {
    const iconos: { [key: string]: string } = {
      PURCHASE: 'shopping_cart',
      SALE: 'point_of_sale',
      ENTRY: 'south',
      EXIT: 'north',
      ADJUSTMENT_IN: 'add_circle_outline',
      ADJUSTMENT_OUT: 'remove_circle_outline',
      RETURN: 'assignment_return',
      TRANSFER: 'swap_horiz'
    };

    return iconos[tipo] ?? 'sync_alt';
  }

  obtenerNombreMovimiento(tipo: string): string {
    const nombres: { [key: string]: string } = {
      PURCHASE: 'Ingreso por compra',
      SALE: 'Salida por venta',
      ENTRY: 'Entrada de inventario',
      EXIT: 'Salida de inventario',
      ADJUSTMENT_IN: 'Ajuste de entrada',
      ADJUSTMENT_OUT: 'Ajuste de salida',
      RETURN: 'Devolución',
      TRANSFER: 'Transferencia'
    };

    return nombres[tipo] ?? tipo;
  }

  obtenerSignoMovimiento(tipo: string): string {
    if (this.esEntrada(tipo)) {
      return '+';
    }

    if (this.esSalida(tipo)) {
      return '-';
    }

    return '';
  }

  obtenerReferenciaTexto(movimiento: InventoryMovement): string {
    if (!movimiento.reference_type && !movimiento.reference_id) {
      return 'Movimiento manual';
    }

    const referencia: string = this.obtenerNombreReferencia(
      movimiento.reference_type
    );

    return movimiento.reference_id
      ? `${referencia} #${movimiento.reference_id}`
      : referencia;
  }

  obtenerNombreReferencia(tipo: string | null): string {
    if (!tipo) {
      return 'Sin referencia';
    }

    const referencias: { [key: string]: string } = {
      PURCHASE: 'Compra',
      SALE: 'Venta',
      PURCHASE_CANCEL: 'Anulación de compra',
      SALE_CANCEL: 'Anulación de venta',
      RETURN: 'Devolución',
      TRANSFER: 'Transferencia',
      ADJUSTMENT: 'Ajuste'
    };

    return referencias[tipo] ?? tipo.replace(/_/g, ' ');
  }

  obtenerIniciales(nombre: string | null | undefined): string {
    if (!nombre) {
      return 'US';
    }

    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte: string) => parte.charAt(0).toUpperCase())
      .join('');
  }

  obtenerFechaValida(fecha: string): Date | null {
    if (!fecha) {
      return null;
    }

    const fechaNormalizada: string = fecha.replace(' ', 'T');
    const resultado: Date = new Date(fechaNormalizada);

    return isNaN(resultado.getTime()) ? null : resultado;
  }

  trackByMovimiento(index: number, movimiento: InventoryMovement): number {
    return movimiento.id;
  }

}
