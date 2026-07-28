import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';

@Component({
  selector: 'app-sale-information',
  templateUrl: './sale-information.component.html',
  styleUrls: ['./sale-information.component.scss']
})
export class SaleInformationComponent {

  @Input() venta: any;
  @Input() compania: ECompany | null = null;
  @Input() clientesFiltrados: ECliente[] = [];
  @Input() clienteSeleccionado: ECliente | null = null;
  @Input() textoCliente = '';

  @Output() textoClienteChange = new EventEmitter<string>();
  @Output() filtrarCliente = new EventEmitter<void>();
  @Output() seleccionarCliente = new EventEmitter<ECliente>();
  @Output() nuevoCliente = new EventEmitter<void>();
  @Output() cambiarSerie = new EventEmitter<void>();
  @Output() cambiarCondicionPago = new EventEmitter<void>();

  onTextoClienteChange(value: string): void {
    this.textoCliente = value;
    this.textoClienteChange.emit(value);
    this.filtrarCliente.emit();
  }

  onSeleccionarCliente(cliente: ECliente): void {
    this.seleccionarCliente.emit(cliente);
  }

  onNuevoCliente(): void {
    this.nuevoCliente.emit();
  }

  onCambiarSerie(): void {
    this.cambiarSerie.emit();
  }

  onCambiarCondicionPago(): void {
    this.cambiarCondicionPago.emit();
  }

  mostrarCliente(cliente: any): string {
    return cliente ? `${cliente.NumeroDocumento} - ${cliente.NombreCliente}` : '';
  }
}
