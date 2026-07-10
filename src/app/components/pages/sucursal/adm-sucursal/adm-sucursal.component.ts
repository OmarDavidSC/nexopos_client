import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalSucursalComponent } from '../modals/modal-sucursal/modal-sucursal.component';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';

@Component({
  selector: 'app-adm-sucursal',
  templateUrl: './adm-sucursal.component.html',
  styleUrls: ['./adm-sucursal.component.scss']
})
export class AdmSucursalComponent extends FormularioBase implements OnInit {

  ListaSucursales: ESucursal[] = [];
  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;

  displayedColumns: string[] = ['Nombre', 'Codigo', 'Telefono', 'Correo', 'Direccion', 'Acciones'];

  PaginaActual: number = 1;
  TotalPaginas: number = 1;
  TotalRegistros: number = 0;

  Loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public sucursalService: BranchService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
  ) {
    super('adm-sucursales', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
    ]
    ).then(([resultadoUsuario, resultadoRole]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      const tienePermiso = this.validarPermisos(
        this.Role,
        ['administrator'],
        this.router,
        this.toastService
      );

      if (tienePermiso) {
        this.initialize();
      }
    });
  }

  async initialize() {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    this.Loading = true;
    const data = await this.sucursalService.index(this.PaginaActual)
    this.ListaSucursales = ESucursal.parseJsonList(data.data);
    this.PaginaActual = data.page;
    this.TotalPaginas = data.total_pages;
    this.TotalRegistros = data.total;
    this.Loading = false;
  }

  async OnchangedPage(page: number) {
    if (page < 1) return;
    if (page > this.TotalPaginas) return;

    this.PaginaActual = page;
    await this.obtenerMaestros();
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalSucursalComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }

  async eventoMostrarPopupEditar(item: ESucursal): Promise<void> {
    const dialogRef = this.dialog.open(ModalSucursalComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }

  async eventoEliminar(item: ESucursal): Promise<void> {
    const confirmToast = this.toastService.show(
      '¿Confirmas la eliminación de la sucursal?', 'Eliminar sucursal',
      { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
    );
    confirmToast.onAction.subscribe(async () => {
      this.toastService.clear();
      const loadingToast = this.toastService.show(
        'Eliminando sucursal...', '',
        { toastComponent: ToastLoadingComponent, positionClass: 'toast-center-center', disableTimeOut: true, tapToDismiss: false }
      );
      try {
        const { success, data, message } = await this.sucursalService.remove(item.Id);
        this.toastService.clear();
        if (success) {
          this.toastService.success(message);
          await this.initialize();
        } else {
          this.toastService.error(message);
        }
      } catch (error: any) {
        this.toastService.clear();
        this.toastService.error(error);
      }
    });
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
