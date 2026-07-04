import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { FormHelper } from 'src/app/utils/form-helper';
import { sweet2 } from 'src/app/utils/sweet2';

@Component({
  selector: 'app-modal-editar-perfil',
  templateUrl: './modal-editar-perfil.component.html',
  styleUrls: ['./modal-editar-perfil.component.scss']
})
export class ModalEditarPerfilComponent implements OnInit {

  public TituloPopup = 'Editar Perfil';
  public TituloButton = 'Guardar Cambios';
  public Form: FormGroup;
  public isLoading = false;
  LoadingToast: any;
  public FotoSeleccionada: File | null = null;
  public FotoPreview!: string;

  @ViewChild('inputFoto') inputFoto!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Eusuario,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private spinnerService: NgxSpinnerService,
    public toastService: ToastrService,
    public dialogRef: MatDialogRef<ModalEditarPerfilComponent>
  ) {

  };

  ngOnInit(): void {
    this.FotoPreview = this.data?.Foto || 'assets/icons/user.svg';

    this.Form = this.formBuilder.group({
      id: new FormControl(this.data?.Id),
      name: new FormControl(this.data?.Nombre, Validators.required),
      paternal_surname: new FormControl(this.data?.ApellidoPaterno, Validators.required),
      maternal_surname: new FormControl(this.data?.ApellidoMaterno),
      username: new FormControl(this.data?.Usuario, Validators.required),
    });
  }

  seleccionarFoto(): void {
    this.inputFoto.nativeElement.click();
  }

  eliminarFoto(): void {
    this.FotoSeleccionada = null;
    this.FotoPreview = 'assets/icons/user.svg';
    this.inputFoto.nativeElement.value = '';
  }


  onFotoSeleccionada(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.FotoSeleccionada = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.FotoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async eventoGuardar(): Promise<void> {
    if (this.isLoading) return;
    if (this.Form.invalid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    const formData = new FormData();

    formData.append('id', this.data.Id);
    formData.append('name', this.Form.value.name);
    formData.append('paternal_surname', this.Form.value.paternal_surname);
    formData.append('maternal_surname', this.Form.value.maternal_surname);
    formData.append('username', this.Form.value.username);
    if (this.FotoSeleccionada) {
      formData.append('foto', this.FotoSeleccionada);
    }
    const confirmToast =
      this.toastService.show(
        '¿Deseas guardar los cambios del perfil?',
        'Actualizar perfil',
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
            'Actualizando perfil...',
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
          const { success, data, message } = await this.profileService.update(formData);
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
