import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuotationFilter } from 'src/app/shared/models/base/QuotationFilter';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';

@Component({
  selector: 'app-quotation-filters',
  templateUrl: './quotation-filters.component.html',
  styleUrls: ['./quotation-filters.component.scss'],
})
export class QuotationFiltersComponent {
  @Input() filter!: QuotationFilter;
  @Input() customers: ECliente[] = [];
  @Input() branches: ESucursal[] = [];
  @Input() loading: boolean = false;
  @Output() search = new EventEmitter<void>();
  @Output() customerChange = new EventEmitter<void>();
  @Output() branchChange = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<void>();
  @Output() dateChange = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  MostrarFiltrosAvanzados: boolean = false;

  EstadosCotizacion = [
    { value: 'DRAFT', label: 'Borrador', },
    { value: 'SENT', label: 'Enviada', },
    { value: 'ACCEPTED', label: 'Aceptada', },
    { value: 'REJECTED', label: 'Rechazada', },
    { value: 'EXPIRED', label: 'Vencida', },
    { value: 'CONVERTED', label: 'Convertida', },
    { value: 'CANCELLED', label: 'Cancelada', },
  ];

  OnEventoBuscar(): void {
    if (this.loading) {
      return;
    }
    this.search.emit();
  }

  OnEventoEnter(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    this.OnEventoBuscar();
  }

  OnEventoCambiarCliente(): void {
    if (this.loading) {
      return;
    }
    this.customerChange.emit();
  }

  OnEventoCambiarSucursal(): void {
    if (this.loading) {
      return;
    }
    this.branchChange.emit();
  }

  OnEventoCambiarEstado(): void {
    if (this.loading) {
      return;
    }
    this.statusChange.emit();
  }

  OnEventoCambiarFecha(): void {
    if (this.loading) {
      return;
    }
    this.dateChange.emit();
  }

  OnEventoLimpiar(): void {
    if (this.loading) {
      return;
    }
    this.clear.emit();
  }

  OnEventoMostrarFiltros(): void {
    this.MostrarFiltrosAvanzados = !this.MostrarFiltrosAvanzados;
  }

  get CantidadFiltrosActivos(): number {
    if (!this.filter) {
      return 0;
    }
    let total = 0;
    if (this.filter.search?.trim()) {
      total++;
    }
    if (this.filter.customer_id) {
      total++;
    }
    if (this.filter.branch_id) {
      total++;
    }
    if (this.filter.status) {
      total++;
    }
    if (this.filter.issue_date_start) {
      total++;
    }
    if (this.filter.issue_date_end) {
      total++;
    }
    if (this.filter.expiration_date_start) {
      total++;
    }
    if (this.filter.expiration_date_end) {
      total++;
    }
    return total;
  }
}
