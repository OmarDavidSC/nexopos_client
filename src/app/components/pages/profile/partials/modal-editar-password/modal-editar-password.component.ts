import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { FormHelper } from 'src/app/utils/form-helper';

@Component({
  selector: 'app-modal-editar-password',
  templateUrl: './modal-editar-password.component.html',
  styleUrls: ['./modal-editar-password.component.scss']
})
export class ModalEditarPasswordComponent implements OnInit {

  public TituloPopup = 'Cambiar de Contraseña';
  public TituloButton = 'Guardar Cambios';
  public Form: FormGroup;

  public isLoading = false;
  LoadingToast: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Eusuario,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
    public dialogRef: MatDialogRef<ModalEditarPasswordComponent>
  ) {

  };

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      id: new FormControl(this.data?.Id),
      new_password: new FormControl('', Validators.required),
      repet_password: new FormControl('', Validators.required),
    });
  }

  async eventoGuardar(): Promise<void> {
    if (this.isLoading) return;
    if (this.Form.invalid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    const formData = new FormData();

    formData.append('id', this.data.Id);
    formData.append('new_password', this.Form.value.new_password);
    formData.append('repet_password', this.Form.value.repet_password);

    const confirmToast =
      this.toastService.show(
        '¿Deseas actualizar la contraseña?',
        'Actualizar contraseña',
        {
          toastComponent: ToastConfirmComponent,
          positionClass: 'toast-center-center',
          disableTimeOut: true
        }
      );

    confirmToast.onAction.subscribe(
      async () => {
        this.toastService.clear();
        this.isLoading = true;
        this.LoadingToast =
          this.toastService.show(
            'Actualizando contraseña...',
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
          const { success, data, message } = await this.profileService.password(formData);
          this.isLoading = false;
          this.toastService.clear();
          if (success) {
            this.toastService.success(message);
            this.dialogRef.close(true);
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          } else {
            this.toastService.error(message);
          }
        } catch (error: any) {
          this.isLoading = false;
          this.toastService.clear();
          this.toastService.error(error);
        }
      }
    );
  }
}
