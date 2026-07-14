import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportPurchaseFilter } from 'src/app/shared/models/base/ReportPurchaseFilter';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';

@Component({
  selector: 'app-filtros-compras',
  templateUrl: './filtros-compras.component.html',
  styleUrls: ['./filtros-compras.component.scss']
})
export class FiltrosComprasComponent {

  @Input() Filtro!: ReportPurchaseFilter;

  @Input() Sucursales: ESucursal[] = [];
  @Input() Proveedores: EProveedor[] = [];
  @Input() Usuarios: Eusuario[] = [];

  @Output() Buscar = new EventEmitter<void>();
  @Output() Limpiar = new EventEmitter<void>();

  buscar() {
    this.Buscar.emit();
  }

  limpiar() {
    this.Limpiar.emit();
  }
}
