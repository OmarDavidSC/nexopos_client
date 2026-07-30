import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';

@Component({
  selector: 'app-sale-payment-history',
  templateUrl: './sale-payment-history.component.html',
  styleUrls: ['./sale-payment-history.component.scss']
})
export class SalePaymentHistoryComponent implements OnChanges {

  @Input() pagos: any[] = [];
  @Input() compania: ECompany | null = null;

  ListaPagosOrdenados: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagos']) {
      this.ordenarPagos();
    }
  }

  ordenarPagos(): void {
    this.ListaPagosOrdenados = [...(this.pagos || [])].sort(
      (a: any, b: any) => {

        const fechaA = new Date(
          a?.payment_date || a?.created_at
        ).getTime();

        const fechaB = new Date(
          b?.payment_date || b?.created_at
        ).getTime();

        if (fechaA === fechaB) {
          return Number(b?.id || 0) - Number(a?.id || 0);
        }

        return fechaB - fechaA;
      }
    );
  }

  obtenerTipoPago(tipo: string): string {
    const tipos: Record<string, string> = {
      INITIAL: 'Pago inicial',
      INSTALLMENT: 'Abono',
      FINAL: 'Pago final'
    };

    return tipos[tipo] || 'Pago';
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

  obtenerIconoMetodo(metodo: string): string {
    const iconos: Record<string, string> = {
      CASH: 'payments',
      CARD: 'credit_card',
      TRANSFER: 'account_balance',
      YAPE: 'phone_android',
      PLIN: 'phone_android',
      OTHER: 'account_balance_wallet'
    };

    return iconos[metodo] || 'payments';
  }

  obtenerClaseTipo(tipo: string): string {
    const clases: Record<string, string> = {
      INITIAL: 'payment-initial',
      INSTALLMENT: 'payment-installment',
      FINAL: 'payment-final'
    };

    return clases[tipo] || 'payment-default';
  }

  obtenerEstado(estado: string): string {
    const estados: Record<string, string> = {
      ACTIVE: 'Activo',
      CANCELLED: 'Anulado'
    };

    return estados[estado] || estado || 'Sin estado';
  }

  obtenerNombreUsuario(usuario: any): string {
    if (!usuario) {
      return 'Usuario no disponible';
    }

    return [
      usuario.name,
      usuario.paternal_surname,
      usuario.maternal_surname
    ]
      .filter(Boolean)
      .join(' ');
  }


}
