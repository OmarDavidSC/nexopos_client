import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-comprobante-venta',
  templateUrl: './modal-comprobante-venta.component.html',
  styleUrls: ['./modal-comprobante-venta.component.scss']
})
export class ModalComprobanteVentaComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComprobanteVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  get venta(): any {
    return this.data?.venta ?? {};
  }

  abrirPdf(url: string | null): void {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  imprimirPdf(url: string | null): void {
    if (!url) return;

    const ventana = window.open(url, '_blank', 'noopener,noreferrer');

    if (!ventana) return;

    ventana.onload = () => {
      ventana.focus();
      ventana.print();
    };
  }

  compartirWhatsApp(url: string | null): void {
    if (!url) return;

    const comprobante = `${this.venta.voucher_series ?? ''}-${this.venta.voucher_number ?? ''}`;
    const mensaje = [
      'Hola, compartimos su comprobante electrónico.',
      `Comprobante: ${comprobante}`,
      `Total: ${Number(this.venta.total ?? 0).toFixed(2)}`,
      `Documento: ${url}`
    ].join('\n');

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  cerrar(): void {
    this.dialogRef.close(true);
  }
}
