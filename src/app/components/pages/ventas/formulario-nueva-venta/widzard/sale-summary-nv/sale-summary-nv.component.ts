import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';

@Component({
  selector: 'app-sale-summary-nv',
  templateUrl: './sale-summary-nv.component.html',
  styleUrls: ['./sale-summary-nv.component.scss']
})
export class SaleSummaryNvComponent {

  @Input() venta: any;
  @Input() cantidadProductos = 0;
  @Input() compania: ECompany | null = null;
  @Input() loading = false;

  @Output() registrarVenta = new EventEmitter<void>();

  get saldoPendiente(): number {
    if (!this.venta) {
      return 0;
    }

    const total = Number(this.venta.total || 0);
    const montoPagado = Number(this.venta.amount_paid || 0);
    return Math.max(total - montoPagado, 0);
  }

  get esVentaCredito(): boolean {
    return this.venta?.payment_condition === 'CREDIT';
  }

  onRegistrarVenta(): void {
    if (this.loading || this.cantidadProductos === 0) {
      return;
    }

    this.registrarVenta.emit();
  }
}
