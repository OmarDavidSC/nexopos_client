import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { FormHelper } from 'src/app/utils/form-helper';

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss']
})
export class ModalClienteComponent implements OnInit {

  public TituloPopup: string;
  public TituloButton: string;
  public Form: FormGroup;
  Loading: boolean = false;
  LoadingToast: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ECliente,
    private formBuilder: FormBuilder,
    private clienteService: CustomerService,
    private spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
    public dialogRef: MatDialogRef<ModalClienteComponent>,
    private dialog: MatDialog
  ) {
    this.TituloPopup = this.data ? 'Editar Cliente' : 'Nueva Cliente';
    this.TituloButton = this.data ? 'Actualizar' : 'Registrar';

    this.Form = this.formBuilder.group({
      id: new FormControl(this.data?.Id, []),
      document_type: new FormControl(this.data?.TipoDocumento, [Validators.required]),
      document_number: new FormControl(this.data?.NumeroDocumento, [Validators.required]),
      name: new FormControl(this.data?.NombreCliente, [Validators.required]),
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
    formData.append('document_type', item.document_type);
    formData.append('document_number', item.document_number);
    formData.append('name', item.name);
    formData.append('phone', item.phone);
    formData.append('email', item.email);
    formData.append('address', item.address);

    const confirmToast = this.toastService.show(
      this.data ? '¿Deseas actualizar el cliente?' : '¿Deseas registrar el cliente?', 'Confirmación',
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
          response = await this.clienteService.update(formData);
        } else {
          response = await this.clienteService.store(formData);
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
