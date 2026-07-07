import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalProveedorComponent } from '../modals/modal-proveedor/modal-proveedor.component';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-proovedor',
  templateUrl: './proovedor.component.html',
  styleUrls: ['./proovedor.component.scss']
})
export class ProovedorComponent extends FormularioBase implements OnInit {

  ListaProveedores: EProveedor[] = [];
  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;

  displayedColumns: string[] = ['NumeroDocumento', 'NombreEmpresa', 'Contacto', 'Telefono', 'Correo', 'Direccion', 'Acciones'];

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
    public proovedorService: SupplierService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
  ) {
    super('proveedores', dialog, route, router, spinner)
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
    const data = await this.proovedorService.index(this.PaginaActual)
    this.ListaProveedores = EProveedor.parseJsonList(data.data);
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
    const dialogRef = this.dialog.open(ModalProveedorComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }

  async eventoMostrarPopupEditar(item: EProveedor): Promise<void> {
    const dialogRef = this.dialog.open(ModalProveedorComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }

  async eventoEliminar(item: EProveedor): Promise<void> {
    const confirmToast = this.toastService.show(
      '¿Confirmas la eliminación del proveedor?', 'Eliminar proveedor',
      { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
    );
    confirmToast.onAction.subscribe(async () => {
      this.toastService.clear();
      const loadingToast = this.toastService.show(
        'Eliminando proveedor...', '',
        { toastComponent: ToastLoadingComponent, positionClass: 'toast-center-center', disableTimeOut: true, tapToDismiss: false }
      );
      try {
        const { success, data, message } = await this.proovedorService.remove(item.Id);
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
