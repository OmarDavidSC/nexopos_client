import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECotizacion } from 'src/app/shared/models/entidades/ECotizacion';

@Component({
  selector: 'app-uotation-list',
  templateUrl: './uotation-list.component.html',
  styleUrls: ['./uotation-list.component.scss']
})
export class UotationListComponent {

  @Input() quotations: ECotizacion[] = [];
  @Input() loading: boolean = false;
  @Input() moneda: string | null | undefined = 'S/';

  @Output() view = new EventEmitter<ECotizacion>();
  @Output() send = new EventEmitter<ECotizacion>();
  @Output() accept = new EventEmitter<ECotizacion>();
  @Output() reject = new EventEmitter<ECotizacion>();
  @Output() convert = new EventEmitter<ECotizacion>();
  @Output() cancel = new EventEmitter<ECotizacion>();

  obtenerEstadoTexto(estado: string): string {
    const estados: Record<string, string> = {
      DRAFT: 'Borrador',
      SENT: 'Enviada',
      ACCEPTED: 'Aceptada',
      REJECTED: 'Rechazada',
      EXPIRED: 'Vencida',
      CONVERTED: 'Convertida',
      CANCELLED: 'Cancelada'
    };
    return estados[estado] || estado || 'Sin estado';
  }

  obtenerIconoEstado(estado: string): string {
    const iconos: Record<string, string> = {
      DRAFT: 'edit_note',
      SENT: 'send',
      ACCEPTED: 'task_alt',
      REJECTED: 'block',
      EXPIRED: 'event_busy',
      CONVERTED: 'sync_alt',
      CANCELLED: 'cancel'
    };
    return iconos[estado] || 'help_outline';
  }

  obtenerClaseEstado(estado: string): string {
    const clases: Record<string, string> = {
      DRAFT: 'status-draft',
      SENT: 'status-sent',
      ACCEPTED: 'status-accepted',
      REJECTED: 'status-rejected',
      EXPIRED: 'status-expired',
      CONVERTED: 'status-converted',
      CANCELLED: 'status-cancelled'
    };
    return clases[estado] || 'status-default';
  }

  puedeEnviar(cotizacion: ECotizacion): boolean {
    return cotizacion.Estado === 'DRAFT';
  }

  puedeAceptar(cotizacion: ECotizacion): boolean {
    return ['DRAFT', 'SENT'].includes(cotizacion.Estado);
  }

  puedeRechazar(cotizacion: ECotizacion): boolean {
    return ['DRAFT', 'SENT', 'ACCEPTED'].includes(cotizacion.Estado);
  }

  puedeConvertir(cotizacion: ECotizacion): boolean {
    return ['DRAFT', 'SENT', 'ACCEPTED'].includes(cotizacion.Estado) && !cotizacion.ConvertidoVenta;
  }

  puedeCancelar(cotizacion: ECotizacion): boolean {
    return !['CONVERTED', 'CANCELLED'].includes(cotizacion.Estado) && !cotizacion.ConvertidoVenta;
  }

  estaVencida(cotizacion: ECotizacion): boolean {
    return cotizacion.Estado === 'EXPIRED';
  }

  estaConvertida(cotizacion: ECotizacion): boolean {
    return (cotizacion.Estado === 'CONVERTED' || cotizacion.ConvertidoVenta);
  }

  OnEventoVer(cotizacion: ECotizacion): void {
    this.view.emit(cotizacion);
  }

  OnEventoEnviar(cotizacion: ECotizacion): void {
    this.send.emit(cotizacion);
  }

  OnEventoAceptar(cotizacion: ECotizacion): void {
    this.accept.emit(cotizacion);
  }

  OnEventoRechazar(cotizacion: ECotizacion): void {
    this.reject.emit(cotizacion);
  }

  OnEventoConvertir(cotizacion: ECotizacion): void {
    this.convert.emit(cotizacion);
  }

  OnEventoCancelar(cotizacion: ECotizacion): void {
    this.cancel.emit(cotizacion);
  }
}
