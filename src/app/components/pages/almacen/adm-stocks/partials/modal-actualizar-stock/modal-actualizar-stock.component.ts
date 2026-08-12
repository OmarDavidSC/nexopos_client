import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { ProductStockService } from 'src/app/shared/services/productstock.service';
import { FormHelper } from 'src/app/utils/form-helper';

@Component({
  selector: 'app-modal-actualizar-stock',
  templateUrl: './modal-actualizar-stock.component.html',
  styleUrls: ['./modal-actualizar-stock.component.scss']
})
export class ModalActualizarStockComponent implements OnInit {

  public TituloPopup: string;
  public TituloButton: string;
  public Form: FormGroup;

  Loading: boolean = false;
  LoadingToast: any;

  IdSucursal: number;
  IdProducto: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private stockService: ProductStockService,
    private spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
    public dialogRef: MatDialogRef<ModalActualizarStockComponent>,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

    this.Loading = true;
    this.IdSucursal = this.data.idSucursal;
    this.IdProducto = this.data.stock.IdProducto;
    this.Loading = false;

    const stock = this.data.stock;

    this.TituloPopup = 'Actualizar Stock del Producto';
    this.TituloButton = 'Actualizar';

    this.Form = this.formBuilder.group({
      current_stock: new FormControl(stock.StockActual, [Validators.required]),
      minimum_stock: new FormControl(stock.StockMinimo, [Validators.required]),
    });
  }

  async eventoGuardar(): Promise<void> {
    if (this.Loading) return;
    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    const item = this.Form.value;
    const formData = new FormData();
    formData.append('branch_id', String(this.IdSucursal));
    formData.append('product_id', String(this.IdProducto));
    formData.append('current_stock', item.current_stock);
    formData.append('minimum_stock', item.minimum_stock);

    const confirmToast = this.toastService.show('¿Deseas actualizar el stock del producto?', 'Confirmación',
      { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
    );
    confirmToast.onAction.subscribe(async () => {
      this.toastService.clear();
      this.Loading = true;
      this.LoadingToast = this.toastService.show('Procesando todos los datos...', '',
        { toastComponent: ToastLoadingComponent, positionClass: 'toast-center-center', disableTimeOut: true, tapToDismiss: false, closeButton: false, enableHtml: true }
      );
      try {
        const response = await this.stockService.store(formData);
        this.Loading = false;
        this.toastService.clear();
        if (!this.Loading) {
          if (response.success) {
            this.toastService.success(response.message);
            this.dialogRef.close(true);
          } else {
            this.toastService.error(response.message);
          }
        }
      } catch (error: any) {
        this.Loading = false;
        this.toastService.clear();
        if (!this.Loading) {
          this.toastService.error(error);
        }
      }
    });
  }
}
