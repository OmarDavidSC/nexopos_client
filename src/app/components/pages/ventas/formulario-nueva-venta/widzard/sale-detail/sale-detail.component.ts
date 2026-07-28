import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.scss']
})
export class SaleDetailComponent {

  @Input() detallesVenta: any[] = [];
  @Input() compania: ECompany | null = null;

  @Output() eliminarProducto = new EventEmitter<number>();

  columnas: string[] = [
    'producto',
    'cantidad',
    'precio',
    'total',
    'accion'
  ];

  onEliminarProducto(index: number): void {
    this.eliminarProducto.emit(index);
  }

}
