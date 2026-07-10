import { Component, Inject, OnInit } from '@angular/core';
import { StepVertical } from '../../../widzard/step-vertical/step-vertical.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SaleService } from 'src/app/shared/services/sale.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-anular-venta',
  templateUrl: './modal-anular-venta.component.html',
  styleUrls: ['./modal-anular-venta.component.scss']
})
export class ModalAnularVentaComponent implements OnInit {

  public TituloPopup: string;
  Loading: boolean = false;
  LoadingToast: any;

  Venta: any;

  steps: StepVertical[] = [
    {
      title: 'Confirmación',
      description: 'Esperando confirmación de anulación',
      status: 'active'
    },
    {
      title: 'Validación',
      description: 'Validando información de la venta',
      status: 'pending'
    },
    {
      title: 'Finalizado',
      description: 'Venta anulada correctamente',
      status: 'pending'
    }
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ventaService: SaleService,
    private spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
    public dialogRef: MatDialogRef<ModalAnularVentaComponent>,
    private dialog: MatDialog
  ) {
    this.TituloPopup = 'Anular Venta';
    this.Venta = data.venta;
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
      const response = await this.ventaService.cancel(this.Venta.Id);
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
      this.toastService.error(error?.message ?? 'Error inesperado al anular la venta');
    } finally {
      this.Loading = false;
    }
  }
}
