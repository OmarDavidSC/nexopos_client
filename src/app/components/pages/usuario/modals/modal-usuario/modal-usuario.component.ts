import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { UserService } from 'src/app/shared/services/user.service';
import { FormHelper } from 'src/app/utils/form-helper';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit {

  public TituloPopup: string;
  public TituloButton: string;
  public Form: FormGroup;

  Loading: boolean = false;
  LoadingToast: any;

  ListaSucursales: ESucursal[] = [];
  ListaRoles: ERol[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private usuarioService: UserService,
    private spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
    public dialogRef: MatDialogRef<ModalUsuarioComponent>,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

    this.Loading = true;
    this.ListaSucursales = this.data.sucursales;
    this.ListaRoles = this.data.roles;
    this.Loading = false;

    const usuario = this.data.usuario;
    const isEdit = !!usuario;

    this.TituloPopup = usuario ? 'Editar Usuario' : 'Nuevo Usuario';
    this.TituloButton = usuario ? 'Actualizar' : 'Registrar';

    this.Form = this.formBuilder.group({
      id: new FormControl(usuario?.Id, []),
      name: new FormControl(usuario?.Nombre, [Validators.required]),
      paternal_surname: new FormControl(usuario?.ApellidoPaterno, [Validators.required]),
      maternal_surname: new FormControl(usuario?.ApellidoMaterno, [Validators.required]),
      username: new FormControl(usuario?.Usuario, [Validators.required]),
      email: new FormControl(usuario?.Email, [Validators.required, Validators.email]),
      password: new FormControl('', isEdit ? [] : [Validators.required]),
      branch_id: new FormControl(usuario?.IdSucursal, [Validators.required]),
      role_id: new FormControl(usuario?.IdRol, [Validators.required])
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
    formData.append('id', item.id ?? '');
    formData.append('name', item.name);
    formData.append('paternal_surname', item.paternal_surname);
    formData.append('maternal_surname', item.maternal_surname);
    formData.append('username', item.username);
    formData.append('email', item.email);
    formData.append('password', item.password);
    formData.append('branch_id', item.branch_id);
    formData.append('role_id', item.role_id);

    const confirmToast = this.toastService.show(
      this.Form.get('id')?.value
        ? '¿Deseas actualizar el usuario?'
        : '¿Deseas registrar el usuario?',
      'Confirmación',
      {
        toastComponent: ToastConfirmComponent,
        positionClass: 'toast-center-center',
        disableTimeOut: true
      }
    );

    confirmToast.onAction.subscribe(async () => {

      this.toastService.clear();
      this.Loading = true;
      this.LoadingToast = this.toastService.show(
        'Procesando todos los datos...',
        '',
        {
          toastComponent: ToastLoadingComponent,
          positionClass: 'toast-center-center',
          disableTimeOut: true,
          tapToDismiss: false,
          closeButton: false,
          enableHtml: true
        }
      );

      try {
        let response;
        if (this.Form.get('id')?.value) {
          response = await this.usuarioService.update(formData);
        } else {
          response = await this.usuarioService.store(formData);
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
