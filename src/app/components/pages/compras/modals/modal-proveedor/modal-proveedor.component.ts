import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { FormHelper } from 'src/app/utils/form-helper';

@Component({
  selector: 'app-modal-proveedor',
  templateUrl: './modal-proveedor.component.html',
  styleUrls: ['./modal-proveedor.component.scss']
})
export class ModalProveedorComponent implements OnInit {

  public TituloPopup: string;
  public TituloButton: string;
  public Form: FormGroup;
  Loading: boolean = false;
  LoadingToast: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EProveedor,
    private formBuilder: FormBuilder,
    private proveedorService: SupplierService,
    private spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
    public dialogRef: MatDialogRef<ModalProveedorComponent>,
    private dialog: MatDialog
  ) {
    this.TituloPopup = this.data ? 'Editar Proveedor' : 'Nueva Proveedor';
    this.TituloButton = this.data ? 'Actualizar' : 'Registrar';

    this.Form = this.formBuilder.group({
      id: new FormControl(this.data?.Id, []),
      document_number: new FormControl(this.data?.NumeroDocumento, [Validators.required]),
      business_name: new FormControl(this.data?.NombreEmpresa, [Validators.required]),
      contact: new FormControl(this.data?.Contacto, [Validators.required]),
      phone: new FormControl(this.data?.Telefono, [Validators.required]),
      email: new FormControl(this.data?.Correo, [Validators.required]),
      address: new FormControl(this.data?.Direccion, [Validators.required]),
    });
  }

  ngOnInit(): void { }

  async eventoGuardar(): Promise<void> {
    if (this.Loading) return;
    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    const item = this.Form.value;
    const formData = new FormData();
    formData.append('id', this.data ? this.data.Id : '');
    formData.append('document_number', item.document_number);
    formData.append('business_name', item.business_name);
    formData.append('contact', item.contact);
    formData.append('phone', item.phone);
    formData.append('email', item.email);
    formData.append('address', item.address);

    const confirmToast = this.toastService.show(
      this.data ? '¿Deseas actualizar la proveedor?' : '¿Deseas registrar la proveedor?', 'Confirmación',
      { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
    );

    confirmToast.onAction.subscribe(async () => {
      this.toastService.clear();
      this.Loading = true;
      this.LoadingToast = this.toastService.show(
        'Procesando todos los datos...', '',
        { toastComponent: ToastLoadingComponent, positionClass: 'toast-center-center', disableTimeOut: true, tapToDismiss: false, closeButton: false, enableHtml: true }
      );
      try {
        let response;
        if (this.data) {
          response = await this.proveedorService.update(formData);
        } else {
          response = await this.proveedorService.store(formData);
        }
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
