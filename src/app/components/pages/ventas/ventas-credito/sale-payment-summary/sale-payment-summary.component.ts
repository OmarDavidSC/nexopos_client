import { Component, Input, OnInit } from '@angular/core';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';

@Component({
  selector: 'app-sale-payment-summary',
  templateUrl: './sale-payment-summary.component.html',
  styleUrls: ['./sale-payment-summary.component.scss']
})
export class SalePaymentSummaryComponent {

  @Input() pagos: any[] = [];
  @Input() compania: ECompany | null = null;

  get pagosActivos(): any[] {
    return (this.pagos || []).filter(pago => pago?.status === 'ACTIVE');
  }

  get totalPagado(): number {
    return this.pagosActivos.reduce(
      (total: number, pago: any) =>
        total + Number(pago?.amount || 0),
      0
    );
  }

  get cantidadPagos(): number {
    return this.pagosActivos.length;
  }

  get ultimoPago(): any | null {
    if (this.pagosActivos.length === 0) {
      return null;
    }

    return [...this.pagosActivos].sort(
      (a: any, b: any) => {
        const fechaA = new Date(a?.payment_date || a.created_at).getTime();
        const fechaB = new Date(b?.payment_date || b?.created_at).getTime();
        return fechaB - fechaA;
      }
    )[0];
  }

  get sucursal(): string {
    return (this.ultimoPago?.branch?.name || this.pagosActivos[0]?.branch?.name || 'Sin sucursal');
  }

  get metodoUlitmoPago(): string {
    return this.obtenerMetodoPago(this.ultimoPago?.payment_method);
  }

  obtenerMetodoPago(metodo: string): string {
    const metodos: Record<string, string> = {
      CASH: 'Efectivo',
      CARD: 'Tarjeta',
      TRANSFER: 'Trasnferencia',
      YAPE: 'Yape',
      PLIN: 'Plin',
      OTHER: 'Otro'
    };
    return metodos[metodo] || 'No especificado';
  }

}
