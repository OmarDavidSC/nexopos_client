import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

export interface InventoryProductMovement {
  id: number;
  name: string;
  total_quantity: number | string;
  total_movements: number | string;
}

@Component({
  selector: 'app-inventory-products',
  templateUrl: './inventory-products.component.html',
  styleUrls: ['./inventory-products.component.scss']
})
export class InventoryProductsComponent implements OnChanges {

  @Input() productos: InventoryProductMovement[] = [];
  @Input() loading: boolean = false;

  textoBusqueda: string = '';
  productosFiltrados: InventoryProductMovement[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productos']) {
      this.filtrarProductos();
    }
  }

  filtrarProductos(): void {
    const busqueda: string = this.textoBusqueda.trim().toLowerCase();

    this.productosFiltrados = (this.productos ?? [])
      .filter((producto: InventoryProductMovement) =>
        !busqueda ||
        producto.name?.toLowerCase().includes(busqueda) ||
        producto.id?.toString().includes(busqueda)
      )
      .sort(
        (a: InventoryProductMovement, b: InventoryProductMovement) =>
          this.obtenerCantidad(b) - this.obtenerCantidad(a)
      );
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarProductos();
  }

  obtenerCantidad(producto: InventoryProductMovement): number {
    return Number(producto.total_quantity ?? 0);
  }

  obtenerMovimientos(producto: InventoryProductMovement): number {
    return Number(producto.total_movements ?? 0);
  }

  obtenerCantidadMaxima(): number {
    if (!this.productosFiltrados.length) {
      return 0;
    }

    return Math.max(
      ...this.productosFiltrados.map(
        (producto: InventoryProductMovement) =>
          this.obtenerCantidad(producto)
      )
    );
  }

  obtenerPorcentaje(producto: InventoryProductMovement): number {
    const cantidadMaxima: number = this.obtenerCantidadMaxima();

    if (cantidadMaxima <= 0) {
      return 0;
    }

    return Math.min(
      (this.obtenerCantidad(producto) / cantidadMaxima) * 100,
      100
    );
  }

  obtenerParticipacion(producto: InventoryProductMovement): number {
    const totalCantidad: number = this.totalCantidad;

    if (totalCantidad <= 0) {
      return 0;
    }

    return (this.obtenerCantidad(producto) / totalCantidad) * 100;
  }

  obtenerInicial(nombre: string | null | undefined): string {
    return nombre?.trim().charAt(0).toUpperCase() || 'P';
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

  obtenerIconoPosicion(index: number): string {
    return index <= 2 ? 'emoji_events' : 'inventory_2';
  }

  get totalCantidad(): number {
    return this.productosFiltrados.reduce(
      (total: number, producto: InventoryProductMovement) =>
        total + this.obtenerCantidad(producto),
      0
    );
  }

  get totalMovimientos(): number {
    return this.productosFiltrados.reduce(
      (total: number, producto: InventoryProductMovement) =>
        total + this.obtenerMovimientos(producto),
      0
    );
  }

  trackByProducto(
    index: number,
    producto: InventoryProductMovement
  ): number {
    return producto.id;
  }
}
