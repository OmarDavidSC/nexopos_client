import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SalePaymenteService } from 'src/app/shared/services/salepayement.service';

export interface RegisterSalePaymentDialogData {
  saleId: number;
  saldoPendiente?: number;
  simboloMoneda?: string;
  cashSessionId?: number | null;
}

@Component({
  selector: 'app-register-sale-payment-dialog',
  templateUrl: './register-sale-payment-dialog.component.html',
  styleUrls: ['./register-sale-payment-dialog.component.scss']
})
export class RegisterSalePaymentDialogComponent implements OnInit {

  FormularioPago!: FormGroup;
  Loading: boolean = false;

  MetodosPago = [
  {
    value: 'CASH',
    label: 'Efectivo',
    description: 'Pago realizado en efectivo.',
    icon: 'payments'
  },
  {
    value: 'CARD',
    label: 'Tarjeta',
    description: 'Tarjeta de crédito o débito.',
    icon: 'credit_card'
  },
  {
    value: 'TRANSFER',
    label: 'Transferencia',
    description: 'Transferencia bancaria.',
    icon: 'account_balance'
  },
  {
    value: 'YAPE',
    label: 'Yape',
    description: 'Pago mediante Yape.',
    icon: 'phone_android'
  },
  {
    value: 'PLIN',
    label: 'Plin',
    description: 'Pago mediante Plin.',
    icon: 'smartphone'
  },
  {
    value: 'OTHER',
    label: 'Otro',
    description: 'Otro método de pago.',
    icon: 'more_horiz'
  }
];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: RegisterSalePaymentDialogData,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<RegisterSalePaymentDialogComponent>,
    private pagoService: SalePaymenteService,
    private toastService: ToastrService
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.controlarMetodoPago();
  }

  crearFormulario(): void {
    this.FormularioPago = this.formBuilder.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
      payment_method: ['CASH', Validators.required],
      reference: [null],
      payment_date: [new Date(), Validators.required],
      observation: [null, Validators.maxLength(250)]
    });
  }

  controlarMetodoPago(): void {
    this.FormularioPago.get('payment_method')?.valueChanges.subscribe((metodo: string) => {
      const referenciaControl = this.FormularioPago.get('reference');
      if (metodo === 'TRANSFER' || metodo === 'CARD' || metodo === 'YAPE' || metodo === 'PLIN') {
        referenciaControl?.setValidators([Validators.required, Validators.maxLength(100)]);
      } else {
        referenciaControl?.clearValidators();
        referenciaControl?.setValidators([Validators.maxLength(100)]);
      }
      referenciaControl?.updateValueAndValidity();
    });
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  obtenerMetodoSeleccionado(): any {
    const metodo = this.FormularioPago?.get('payment_method')?.value;
    return this.MetodosPago.find(item => item.value === metodo);
  }

  establecerMontoCompleto(): void {
    if (!this.data.saldoPendiente) {
      return;
    }
    this.FormularioPago.patchValue({ amount: this.data.saldoPendiente });
  }

  async registrarPago(): Promise<void> {

    if (this.FormularioPago.invalid) {
      this.FormularioPago.markAllAsTouched();
      this.toastService.warning('Completa correctamente los campos obligatorios.');
      return;
    }

    const monto = Number(this.FormularioPago.get('amount')?.value);
    if (this.data.saldoPendiente && monto > this.data.saldoPendiente) {
      this.toastService.warning('El monto ingresado supera el saldo pendiente.');
      return;
    }
    this.Loading = true;

    try {
      const formulario = this.FormularioPago.getRawValue();
      const formData = new FormData();
      formData.append('id', this.data.saleId.toString());
      formData.append('amount', Number(formulario.amount).toString());
      formData.append('payment_method', formulario.payment_method);
      formData.append('reference', formulario.reference ?? '');
      formData.append('payment_date', this.formatearFecha(formulario.payment_date) ?? '');
      formData.append('observation', formulario.observation ?? '');
      // formData.append('cash_session_id', this.data.cashSessionId ? this.data.cashSessionId.toString() : '');

      const response = await this.pagoService.store(formData);
      if (!response.success) {
        this.toastService.warning(response.message);
        return;
      }

      this.toastService.success(response.message);
      this.dialogRef.close({ success: true, payment: response.data });

    } catch (error: any) {
      this.toastService.error(error?.error?.message || error?.message || 'Ocurrió un error al registrar el pago.');
    } finally {
      this.Loading = false;
    }
  }

  cerrar(): void {
    if (this.Loading) {
      return;
    }
    this.dialogRef.close();
  }

  campoInvalido(campo: string): boolean {
    const control = this.FormularioPago.get(campo);
    return Boolean(control && control.invalid && (control.touched || control.dirty));
  }

  formatearFecha(fecha: Date | string): string | null {
    if (!fecha) {
      return null;
    }

    const fechaPago = new Date(fecha);
    const year = fechaPago.getFullYear();

    const month = String(fechaPago.getMonth() + 1).padStart(2, '0');
    const day = String(fechaPago.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  seleccionarMetodoPago(metodo: string): void {
  this.FormularioPago.patchValue({
    payment_method: metodo
  });

  this.FormularioPago
    .get('payment_method')
    ?.markAsTouched();
}

}
