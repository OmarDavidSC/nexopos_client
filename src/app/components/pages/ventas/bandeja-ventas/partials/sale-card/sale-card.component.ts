import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EVenta } from 'src/app/shared/models/entidades/EVenta';

@Component({
  selector: 'app-sale-card',
  templateUrl: './sale-card.component.html',
  styleUrls: ['./sale-card.component.scss']
})
export class SaleCardComponent {

  @Input() sale!: EVenta;
  @Input() moneda: string = 'S/';
  @Output() view = new EventEmitter<EVenta>();
  @Output() cancel = new EventEmitter<EVenta>()
  @Output() paymentHistory = new EventEmitter<EVenta>();

  get esVentaCredito(): boolean {
    return this.sale?.MetodoCondicion === 'CREDIT';
  }

  get estaPagado(): boolean {
    return this.sale?.EstadoPago === 'PAID';
  }

  get estaVencido(): boolean {
    if (!this.esVentaCredito || this.estaPagado || !this.sale?.FechaVencimientoSinFormato) {
      return false;
    }
    const vencimiento = new Date(`${this.sale.FechaVencimientoSinFormato}T23:59:59`);
    return vencimiento.getTime() < new Date().getTime();
  }

  get estadoCreditoTexto(): string {
    if (this.sale?.EstadoPago === 'PAID') {
      return 'Pagado';
    }
    if (this.estaVencido) {
      return 'Vencido';
    }
    if (this.sale?.EstadoPago === 'PARTIAL') {
      return 'Pago parcial';
    }
    return 'Pendiente';
  }

  get claseEstadoCredito(): string {
    if (this.sale?.EstadoPago === 'PAID') {
      return 'credit-paid';
    }
    if (this.estaVencido) {
      return 'credit-overdue';
    }
    if (this.sale?.EstadoPago === 'PARTIAL') {
      return 'credit-partial';
    }
    return 'credit-pending';
  }
}
