import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';

@Component({
  selector: 'app-sale-product-selector',
  templateUrl: './sale-product-selector.component.html',
  styleUrls: ['./sale-product-selector.component.scss']
})
export class SaleProductSelectorComponent {

  @Input() productosFiltrados: EProducto[] = [];
  @Input() productoSeleccionado: EProducto | null = null;
  @Input() productoTemporal: any;
  @Input() compania: ECompany | null = null;
  @Input() textoProducto = '';

  @Output() textoProductoChange = new EventEmitter<string>();
  @Output() filtrarProducto = new EventEmitter<void>();
  @Output() seleccionarProducto = new EventEmitter<EProducto>();
  @Output() agregarProducto = new EventEmitter<void>();

  onTextoProductoChange(value: string): void {
    this.textoProducto = value;
    this.textoProductoChange.emit(value);
    this.filtrarProducto.emit();
  }

  onSeleccionarProducto(producto: EProducto): void {
    this.seleccionarProducto.emit(producto);
  }

  onAgregarProducto(): void {
    this.agregarProducto.emit();
  }

  mostrarProducto(producto: any): string {
    return producto ? `${producto.Codigo} - ${producto.Nombre}` : '';
  }
}
