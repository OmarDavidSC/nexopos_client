import { Component, Input, OnInit } from '@angular/core';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';

@Component({
  selector: 'app-quotation-summary',
  templateUrl: './quotation-summary.component.html',
  styleUrls: ['./quotation-summary.component.scss'],
})
export class QuotationSummaryComponent {
  @Input() cotizacion: any = null;
  @Input() detallesCotizacion: any[] = [];
  @Input() cliente: ECliente | null = null;
  @Input() compania: ECompany | null = null;
  @Input() loading: boolean = false;

  get simboloMoneda(): string {
    return this.compania?.SimboloMoneda || 'S/';
  }

  get cantidadProductos(): number {
    return this.detallesCotizacion.length;
  }

  get cantidadUnidades(): number {
    return this.detallesCotizacion.reduce((total: number, detalle: any) => total + Number(detalle.quantity || 0), 0,);
  }

  get nombreCliente(): string {
    return ((this.cliente as any)?.NombreCliente || this.cotizacion?.customer_name || 'Cliente no seleccionado');
  }

  get documentoCliente(): string {
    return ((this.cliente as any)?.NumeroDocumento || this.cotizacion?.customer_document || 'Sin documento');
  }

  obtenerEstado(estado: string): string {
    const estados: Record<string, string> = {
      DRAFT: 'Borrador',
      SENT: 'Enviada',
    };
    return estados[estado] || estado || 'Sin estado';
  }
}
