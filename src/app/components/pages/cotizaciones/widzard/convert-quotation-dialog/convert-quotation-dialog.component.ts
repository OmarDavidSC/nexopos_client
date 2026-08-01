import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-convert-quotation-dialog',
  templateUrl: './convert-quotation-dialog.component.html',
  styleUrls: ['./convert-quotation-dialog.component.scss'],
})
export class ConvertQuotationDialogComponent implements OnInit {

  FormularioConversion!: FormGroup;
  Loading: boolean = false;
  MetodosPago = [
    { value: 'CASH', label: 'Efectivo', icon: 'payments', },
    { value: 'CARD', label: 'Tarjeta', icon: 'credit_card', },
    { value: 'TRANSFER', label: 'Transferencia', icon: 'account_balance', },
    { value: 'YAPE', label: 'Yape', icon: 'phone_android', },
    { value: 'PLIN', label: 'Plin', icon: 'phone_android', },
    { value: 'OTHER', label: 'Otro', icon: 'account_balance_wallet', },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ConvertQuotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      cotizacion: any;
      simboloMoneda: string;
    },
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario(): void {
    this.FormularioConversion = this.formBuilder.group({
      sale_date: [new Date(), Validators.required],
      voucher_type: ['BOLETA', Validators.required],
      voucher_series: ['B001', Validators.required],
      payment_condition: ['CASH', Validators.required],
      payment_method: ['CASH', Validators.required],
      amount_paid: [Number(this.data.cotizacion?.Total || 0), [Validators.required, Validators.min(0)],],
      due_date: [null],
    });
  }

  OnEventoCambiarComprobante(): void {
    const tipo = this.FormularioConversion.get('voucher_type')?.value;
    let serie = '';
    switch (tipo) {
      case 'FACTURA': serie = 'F001';
        break;
      case 'BOLETA': serie = 'B001';
        break;
      case 'TICKET': serie = 'TK01';
        break;
      case 'NOTA': serie = 'NT';
        break;
    }
    this.FormularioConversion.get('voucher_series')?.setValue(serie);
  }

  OnEventoCambiarCondicionPago(): void {
    const condicion = this.FormularioConversion.get('payment_condition')?.value;
    const amountControl = this.FormularioConversion.get('amount_paid');
    const dueDateControl = this.FormularioConversion.get('due_date');
    if (condicion === 'CASH') {
      amountControl?.setValue(Number(this.data.cotizacion?.Total || 0));
      dueDateControl?.clearValidators();
      dueDateControl?.setValue(null);
    } else {
      amountControl?.setValue(0);
      dueDateControl?.setValidators([Validators.required]);
    }
    dueDateControl?.updateValueAndValidity();
  }

  seleccionarMetodoPago(metodo: string): void {
    this.FormularioConversion.get('payment_method')?.setValue(metodo);
  }

  establecerPagoCompleto(): void {
    this.FormularioConversion.get('amount_paid')?.setValue(Number(this.data.cotizacion?.Total || 0),);
  }

  get esCredito(): boolean {
    return (this.FormularioConversion?.get('payment_condition')?.value === 'CREDIT');
  }

  get totalCotizacion(): number {
    return Number(this.data.cotizacion?.Total || 0);
  }

  get saldoPendiente(): number {
    const pagado = Number(this.FormularioConversion?.get('amount_paid')?.value || 0,);
    return Math.max(this.totalCotizacion - pagado, 0);
  }

  confirmar(): void {
    if (this.FormularioConversion.invalid) {
      this.FormularioConversion.markAllAsTouched();
      return;
    }
    const formulario = this.FormularioConversion.getRawValue();
    const amountPaid = Number(formulario.amount_paid || 0);

    if (amountPaid > this.totalCotizacion) {
      this.FormularioConversion.get('amount_paid')?.setErrors({ exceedsTotal: true, });
      return;
    }

    if (formulario.payment_condition === 'CREDIT' && amountPaid >= this.totalCotizacion) {
      this.FormularioConversion.get('amount_paid')?.setErrors({ invalidCreditAmount: true, });
      return;
    }
    this.dialogRef.close(formulario);
  }

  cerrar(): void {
    this.dialogRef.close(null);
  }
}
