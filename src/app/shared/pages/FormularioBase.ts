import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material/dialog";
import { IDialogData, ModalDialog } from "../components/modal/modal.component";
import { ModalType } from "src/app/utils/Enumeradores";
import { ERol } from "../models/entidades/ERol";
import { ToastrService } from "ngx-toastr";


export class FormularioBase {
  nombrePagina: string;
  submitted: boolean

  constructor(nombrePagina: string, public dialog: MatDialog, public route: ActivatedRoute, public router: Router, public spinner: NgxSpinnerService) {
    this.nombrePagina = nombrePagina;
    this.submitted = false;
  }

  mostrarProgreso() {
    this.spinner.show();
  }

  ocultarProgreso() {
    this.spinner.hide();
  }

  obtenerParametro(parametro: string): any {
    const valor = this.route.snapshot.params[parametro];

    if (!valor) {
      return null;
    }

    return valor;
  }

  mostrarModalError(mensaje: string, error: any, callback?: any): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = "¡Se encontró un error en el proceso!";
    dialogData.titulo = "";
    dialogData.tipoModal = ModalType.Error;

    //this.masterService.guardarLog(Log.setNuevoElemento(this.nombrePagina, mensaje, error));

    const dialogRef = this.dialog.open(ModalDialog, {
      width: "",
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (callback) {
        callback(result);
      }
    });
  }

  mostrarModalErrorTextoHtml(titulo: string, mensaje: string, callback?: any): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = mensaje;
    dialogData.titulo = titulo;
    dialogData.tipoModal = ModalType.ErrorTextHtml;

    //this.masterService.guardarLog(Log.setNuevoElemento(this.nombrePagina, mensaje, error));

    const dialogRef = this.dialog.open(ModalDialog, {
      width: "",
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (callback) {
        callback(result);
      }
    });
  }

  mostrarModalSuccess(titulo: string, mensaje: string, callback: any, textoBotonSi: string): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = mensaje;
    dialogData.titulo = titulo;
    dialogData.tipoModal = ModalType.Success;
    dialogData.textoBotonSi = textoBotonSi;

    const dialogRef = this.dialog.open(ModalDialog, {
      width: "",
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (callback) {
        callback(result);
      }
    });
  }

  mostrarModalInformativo(titulo: string, mensaje: string): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = mensaje;
    dialogData.titulo = titulo;
    dialogData.tipoModal = ModalType.Warning;

    const dialogRef = this.dialog.open(ModalDialog, {
      width: "",
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  mostrarModalConfirmacion(mensaje: string, callback: any, textoBotonSi: string, textoBotonNo: string): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = mensaje;
    dialogData.titulo = "";
    dialogData.tipoModal = ModalType.Confirm;
    dialogData.textoBotonSi = textoBotonSi;
    dialogData.textoBotonNo = textoBotonNo;

    const dialogRef = this.dialog.open(ModalDialog, {
      width: "",
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (callback) {
        callback(result);
      }
    });
  }

  mostrarModalInformativoConAccion(titulo: string, mensaje: string, callback: any, textoBotonSi: string): void {
    this.ocultarProgreso();

    const dialogData = <IDialogData>{};
    dialogData.mensaje = mensaje;
    dialogData.titulo = titulo;
    dialogData.tipoModal = ModalType.Warning;
    dialogData.textoBotonSi = textoBotonSi;

    const dialogRef = this.dialog.open(ModalDialog, {
      width: "",
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (callback) {
        callback(result);
      }
    });
  }

  validarPermisos(
    role: ERol | null,
    permisosPermitidos: string[],
    router: Router,
    toastService: ToastrService
  ): boolean {
    if (!role) {
      toastService.warning(
        'No tienes permisos para acceder a esta página.',
        'Acceso denegado'
      );
      setTimeout(() => {
        router.navigate(['/inicio']);
      }, 1000);
      return false;
    }
    const tieneAcceso = role.Permisos?.some(
      x => permisosPermitidos.includes(x.Key)
    );
    if (!tieneAcceso) {
      toastService.warning(
        'No tienes permisos para acceder a esta página.',
        'Acceso denegado'
      );
      setTimeout(() => {
        router.navigate(['']);
      }, 1000);
      return false;
    }
    return true;
  }

  tienePermiso(
    role: ERol | null,
    permisos: string[]
  ): boolean {

    if (!role) return false;

    return role.Permisos?.some(
      x => permisos.includes(x.Key)
    ) || false;
  }

  onEventoFormatearFecha(fecha: any) {
    const f = new Date(fecha);
    return `${f.getFullYear()}-${(f.getMonth() + 1).toString().padStart(2, '0')}-${f.getDate().toString().padStart(2, '0')}`;
  }

  public Navegar(site: string): void {
    const tieneAspx = site.indexOf('.aspx') !== -1;
    if (tieneAspx) {
      location.href = ``;
    } else {
      this.router.navigate([site]);
    }
  }

}
