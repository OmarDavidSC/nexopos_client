import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from 'src/app/shared/services/purchase.service';
import { StepVertical } from '../../../widzard/step-vertical/step-vertical.component';

@Component({
  selector: 'app-modal-cancelar-compra',
  templateUrl: './modal-cancelar-compra.component.html',
  styleUrls: ['./modal-cancelar-compra.component.scss']
})
export class ModalCancelarCompraComponent implements OnInit {

  public TituloPopup: string;
  Loading: boolean = false;
  LoadingToast: any;

  Compra: any;
  Moneda: string;

  steps: StepVertical[] = [
    {
      title: 'Confirmación',
      description: 'Esperando confirmación de cancelación',
      status: 'active'
    },
    {
      title: 'Validación',
      description: 'Validando información de la compra',
      status: 'pending'
    },
    {
      title: 'Finalizado',
      description: 'Compra cancelada correctamente',
      status: 'pending'
    }
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private compraService: PurchaseService,
    private spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
    public dialogRef: MatDialogRef<ModalCancelarCompraComponent>,
    private dialog: MatDialog
  ) {
    this.TituloPopup = 'Cancelar Compra';
    this.Compra = data.compra;
    this.Moneda = data.moneda;
  }

  ngOnInit(): void { }

  CambiarEstadoStep(
    index: number,
    status: 'pending' | 'active' | 'completed' | 'error'
  ) {

    this.steps[index].status = status;

  }

  async OnEventoCancelar(): Promise<void> {
    try {
      this.Loading = true;
      this.CambiarEstadoStep(0, 'completed');
      this.CambiarEstadoStep(1, 'active');
      const response = await this.compraService.cancel(this.Compra.Id);
      if (!response.success) {
        this.CambiarEstadoStep(1, 'error');
        this.toastService.error(response.message);
        return;
      }

      this.CambiarEstadoStep(1, 'completed');
      this.CambiarEstadoStep(2, 'active');
      await new Promise(resolve => setTimeout(resolve, 800));
      this.CambiarEstadoStep(2, 'completed');
      this.toastService.success(response.message);
      this.dialogRef.close(true);
    } catch (error: any) {
      this.CambiarEstadoStep(1, 'error');
      this.toastService.error(error?.message ?? 'Error inesperado al cancelar compra');
    } finally {
      this.Loading = false;
    }
  }
}
