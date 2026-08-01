import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';

@Component({
  selector: 'app-quotation-customer',
  templateUrl: './quotation-customer.component.html',
  styleUrls: ['./quotation-customer.component.scss'],
})
export class QuotationCustomerComponent {

  @Input() cotizacion: any = null;
  @Input() clientesFiltrados: ECliente[] = [];
  @Input() clienteSeleccionado: ECliente | null = null;
  @Input() textoCliente: string = '';
  @Output() textoClienteChange = new EventEmitter<string>();
  @Output() filtrarCliente = new EventEmitter<void>();
  @Output() seleccionarCliente = new EventEmitter<ECliente>();
  @Output() limpiarCliente = new EventEmitter<void>();
  @Output() nuevoCliente = new EventEmitter<void>();

  OnEventoCambiarTexto(texto: string): void {
    this.textoCliente = texto;
    this.textoClienteChange.emit(texto);
    this.filtrarCliente.emit();
  }

  OnEventoSeleccionarCliente(cliente: ECliente): void {
    this.seleccionarCliente.emit(cliente);
  }

  OnEventoLimpiarCliente(): void {
    this.textoCliente = '';
    this.textoClienteChange.emit('');
    this.limpiarCliente.emit();
  }

  OnEventoNuevoCliente(): void {
    this.nuevoCliente.emit();
  }

  mostrarCliente(cliente: any): string {
    if (!cliente) {
      return '';
    }
    return (`${cliente.NumeroDocumento || ''} - ` + `${cliente.NombreCliente || ''}`).trim();
  }

  get cliente(): any {
    return this.clienteSeleccionado;
  }

  get tieneClienteSeleccionado(): boolean {
    return Boolean(this.cotizacion?.customer_id && this.clienteSeleccionado);
  }
}
