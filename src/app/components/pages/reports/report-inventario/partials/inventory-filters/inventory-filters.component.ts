import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportInventoryFilter } from 'src/app/shared/models/base/ReportInventoryFilter';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';

@Component({
  selector: 'app-inventory-filters',
  templateUrl: './inventory-filters.component.html',
  styleUrls: ['./inventory-filters.component.scss']
})
export class InventoryFiltersComponent {

  @Input() filtro: ReportInventoryFilter = {
    branch_id: null,
    product_id: null,
    date_start: null,
    date_end: null
  };

  @Input() sucursales: ESucursal[] = [];
  @Input() productos: EProducto[] = [];
  @Input() loading: boolean = false;

  @Output() buscar: EventEmitter<ReportInventoryFilter> = new EventEmitter<ReportInventoryFilter>();
  @Output() limpiar: EventEmitter<void> = new EventEmitter<void>();

  aplicarFiltros(): void {
    this.buscar.emit({ ...this.filtro });
  }

  limpiarFiltros(): void {
    this.limpiar.emit();
  }

}
