import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';

@Component({
  selector: 'app-quotation-products',
  templateUrl: './quotation-products.component.html',
  styleUrls: ['./quotation-products.component.scss'],
})
export class QuotationProductsComponent {
  @Input() productosFiltrados: EProducto[] = [];
  @Input() productoSeleccionado: EProducto | null = null;
  @Input() productoTemporal: any = {
    product_id: null,
    code: '',
    name: '',
    quantity: 1,
    unit_price: 0,
    discount_percentage: 0,
    discount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    description: '',
    stock: 0,
  };

  @Input() detallesCotizacion: any[] = [];
  @Input() compania: ECompany | null = null;
  @Input() textoProducto: string = '';
  @Output() textoProductoChange = new EventEmitter<string>();
  @Output() filtrarProducto = new EventEmitter<void>();
  @Output() seleccionarProducto = new EventEmitter<EProducto>();
  @Output() calcularProducto = new EventEmitter<void>();
  @Output() agregarProducto = new EventEmitter<void>();
  @Output() eliminarProducto = new EventEmitter<number>();
  @Output() actualizarDetalle = new EventEmitter<{ index: number; detalle: any; }>();

  OnEventoCambiarTexto(texto: string): void {
    this.textoProducto = texto;
    this.textoProductoChange.emit(texto);
    this.filtrarProducto.emit();
  }

  OnEventoSeleccionarProducto(producto: EProducto): void {
    this.seleccionarProducto.emit(producto);
  }

  OnEventoCalcularProducto(): void {
    this.calcularProducto.emit();
  }

  OnEventoAgregarProducto(): void {
    this.agregarProducto.emit();
  }

  OnEventoEliminarProducto(index: number): void {
    this.eliminarProducto.emit(index);
  }

  OnEventoActualizarDetalle(index: number, campo: string, valor: any): void {
    const detalleActual = this.detallesCotizacion[index];
    if (!detalleActual) {
      return;
    }
    this.actualizarDetalle.emit({ index, detalle: { ...detalleActual, [campo]: valor, }, });
  }

  mostrarProducto(producto: any): string {
    if (!producto) {
      return '';
    }

    return (`${producto.Codigo || ''} - ` + `${producto.Nombre || ''}`).trim();
  }

  get tieneProductoSeleccionado(): boolean {
    return Boolean(this.productoSeleccionado && this.productoTemporal?.product_id,);
  }

  get simboloMoneda(): string {
    return this.compania?.SimboloMoneda || 'S/';
  }
}
