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

  ngOnInit(): void {

    this.configurarValidacionDocumento();

    this.Form.get('document_type')?.valueChanges.subscribe(() => {
      this.Form.get('document_number')?.setValue('');
      this.configurarValidacionDocumento();
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

  private configurarValidacionDocumento(): void {
    const tipoDocumento: string = this.Form.get('document_type')?.value;
    const numeroDocumento = this.Form.get('document_number');
    if (!numeroDocumento) return;
    let validators = [Validators.required];

    switch (tipoDocumento) {
      case 'DNI':
        validators = [Validators.required, Validators.pattern(/^[0-9]{8}$/), Validators.minLength(8), Validators.maxLength(8)];
        break;
      case 'RUC':
        validators = [Validators.required, Validators.pattern(/^[0-9]{11}$/), Validators.minLength(11), Validators.maxLength(11)];
        break;
      case 'CE':
        validators = [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,12}$/), Validators.maxLength(12)];
        break;
      case 'PASSPORT':
        validators = [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,20}$/), Validators.maxLength(20)];
        break;
    }
    numeroDocumento.setValidators(validators);
    numeroDocumento.updateValueAndValidity();
  }

  getMaxLengthDocumento(): number {
    const tipoDocumento: string = this.Form.get('document_type')?.value;

    switch (tipoDocumento) {
      case 'DNI':
        return 8;
      case 'RUC':
        return 11;
      case 'CE':
        return 12;
      case 'PASSPORT':
        return 20;
      default:
        return 20;
    }
  }

  soloNumerosDocumento(event: KeyboardEvent): void {
    const tipoDocumento: string = this.Form.get('document_type')?.value;

    if (tipoDocumento !== 'DNI' && tipoDocumento !== 'RUC') return;
    const teclasPermitidas: string[] = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (teclasPermitidas.includes(event.key)) return;
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  limpiarDocumentoPegado(): void {
    const control = this.Form.get('document_number');
    const tipoDocumento: string = this.Form.get('document_type')?.value;
    let valor: string = control?.value ?? '';

    if (tipoDocumento === 'DNI') {
      valor = valor.replace(/\D/g, '').slice(0, 8);
    }

    if (tipoDocumento === 'RUC') {
      valor = valor.replace(/\D/g, '').slice(0, 11);
    }

    if (tipoDocumento === 'CE') {
      valor = valor.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    }

    if (tipoDocumento === 'PASSPORT') {
      valor = valor.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    }
    control?.setValue(valor, { emitEvent: false });
  }
}
