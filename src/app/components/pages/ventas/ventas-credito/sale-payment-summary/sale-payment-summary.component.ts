import { Component, Input, OnInit } from '@angular/core';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';

@Component({
  selector: 'app-sale-payment-summary',
  templateUrl: './sale-payment-summary.component.html',
  styleUrls: ['./sale-payment-summary.component.scss']
})
export class SalePaymentSummaryComponent {

  @Input() pagos: any[] = [];

  @Input() venta: any = null;

  @Input() resumen: any = {
    total_sale: 0,
    total_paid: 0,
    balance_due: 0,
    payment_count: 0,
    payment_status: 'PENDING'
  };

  @Input() compania: ECompany | null = null;

  get pagosActivos(): any[] {
    return (this.pagos || []).filter(pago => pago?.status === 'ACTIVE');
  }

  get totalVenta(): number {
    return Number(this.resumen?.total_sale ?? this.venta?.total ?? 0);
  }

  get totalPagado(): number {
    return Number(this.resumen?.total_paid ?? this.venta?.amount_paid ?? 0);
  }

  get saldoPendiente(): number {
    return Number(this.resumen?.balance_due ?? this.venta?.balance_due ?? 0);
  }

  get cantidadPagos(): number {
    return Number(this.resumen?.payment_count ?? this.pagosActivos.length);
  }

  get estadoPago(): string {
    const estado = this.resumen?.payment_status ?? this.venta?.payment_status;
    const estados: Record<string, string> = {
      PENDING: 'Pendiente',
      PARTIAL: 'Pago parcial',
      PAID: 'Pagado'
    };

    return estados[estado] || 'Pendiente';
  }

  get ultimoPago(): any | null {
    if (this.pagosActivos.length === 0) {
      return null;
    }

    return [...this.pagosActivos].sort(
      (a: any, b: any) => {
        const fechaA = new Date(a?.payment_date || a?.created_at).getTime();
        const fechaB = new Date(b?.payment_date || b?.created_at).getTime();
        if (fechaA === fechaB) {
          return Number(b?.id || 0) - Number(a?.id || 0);
        }
        return fechaB - fechaA;
      }
    )[0];
  }

  get sucursal(): string {
    return (this.ultimoPago?.branch?.name || this.pagosActivos[0]?.branch?.name || 'Sin sucursal');
  }

  get metodoUltimoPago(): string {
    return this.obtenerMetodoPago(this.ultimoPago?.payment_method);
  }

  obtenerMetodoPago(metodo: string): string {
    const metodos: Record<string, string> = {
      CASH: 'Efectivo',
      CARD: 'Tarjeta',
      TRANSFER: 'Transferencia',
      YAPE: 'Yape',
      PLIN: 'Plin',
      OTHER: 'Otro'
    };

    return metodos[metodo] || 'No especificado';
  }
}
