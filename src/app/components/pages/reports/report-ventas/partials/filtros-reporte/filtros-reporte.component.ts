import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportSaleFilter } from 'src/app/shared/models/base/ReportSaleFilter';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';

@Component({
  selector: 'app-filtros-reporte',
  templateUrl: './filtros-reporte.component.html',
  styleUrls: ['./filtros-reporte.component.scss']
})
export class FiltrosReporteComponent {

  paymentMethods = [
    { value: 'CASH', name: 'Efectivo' },
    { value: 'TRANSFER', name: 'Transferencia' },
    { value: 'CARD', name: 'Tarjeta' },
    { value: 'YAPE', name: 'Yape' },
    { value: 'PLIN', name: 'Plin' }
  ];

  voucherTypes = [
    { value: 'BOLETA', name: 'Boleta' },
    { value: 'FACTURA', name: 'Factura' },
    { value: 'NOTA_VENTA', name: 'Nota de Venta' }
  ];

  statusList = [
    { value: 'COMPLETED', name: 'Completada' },
    { value: 'CANCELLED', name: 'Anulada' },
    { value: 'PENDING', name: 'Pendiente' }
  ];

  @Input() Filtro!: ReportSaleFilter;

  @Input() Sucursales: ESucursal[] = [];
  @Input() Clientes: ECliente[] = [];
  @Input() Usuarios: Eusuario[] = [];

  @Output() buscar = new EventEmitter<void>();
  @Output() limpiar = new EventEmitter<void>();

  buscarReporte(): void {
    this.buscar.emit();
  }

  limpiarReporte(): void {
    this.limpiar.emit();
  }

}
