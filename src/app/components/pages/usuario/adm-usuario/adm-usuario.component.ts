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
import { UserService } from 'src/app/shared/services/user.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalUsuarioComponent } from '../modals/modal-usuario/modal-usuario.component';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';

@Component({
  selector: 'app-adm-usuario',
  templateUrl: './adm-usuario.component.html',
  styleUrls: ['./adm-usuario.component.scss']
})
export class AdmUsuarioComponent extends FormularioBase implements OnInit {

  ListaUsuarios: Eusuario[] = [];
  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;

  displayedColumns: string[] = ['Nombre', 'ApellidoPaterno', 'ApellidoMaterno', 'Usuario', 'Email', 'Sucursal', 'Rol', 'Acciones'];

  PaginaActual: number = 1;
  TotalPaginas: number = 1;
  TotalRegistros: number = 0;

  Loading: boolean = false;

  ListaSucursales: ESucursal[] = [];
  ListaRoles: ERol[] = [];

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public usuarioService: UserService,
    public sucursalService: BranchService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
  ) {
    super('administracion-usuarios', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.sucursalService.adm(),
      this.usuarioService.role(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoSucursal, resultadoRoles]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.ListaSucursales = resultadoSucursal;
      this.ListaRoles = resultadoRoles;
      const tienePermiso = this.validarPermisos(this.Role, ['administrator',], this.router, this.toastService);
      if (tienePermiso) {
        this.initialize();
      }
    });
  }

  async initialize() {
    this.obtenerMaestro();
  }

  async obtenerMaestro() {
    this.Loading = true;
    const response = await this.usuarioService.index(this.PaginaActual);
    this.ListaUsuarios = Eusuario.parseJsonList(response.data);
    this.PaginaActual = response.page;
    this.TotalPaginas = response.total_pages;
    this.TotalRegistros = response.total;

    this.Loading = false;
  }

  async OnchangedPage(page: number) {
    if (page < 1) return;
    if (page > this.TotalPaginas) return;

    this.PaginaActual = page;
    await this.obtenerMaestro();
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '600px',
      disableClose: true,
      data: {
        usuario: null,
        sucursales: this.ListaSucursales,
        roles: this.ListaRoles
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }

  async eventoMostrarPopupEditar(item: Eusuario): Promise<void> {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      width: '600px',
      disableClose: true,
      data: {
        usuario: item,
        sucursales: this.ListaSucursales,
        roles: this.ListaRoles
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }

  async eventoEliminar(item: Eusuario): Promise<void> {
    const confirmToast = this.toastService.show(
      '¿Confirmas la eliminación del usuario?',
      'Eliminar usuario',
      {
        toastComponent: ToastConfirmComponent,
        positionClass: 'toast-center-center',
        disableTimeOut: true
      }
    );
    confirmToast.onAction.subscribe(async () => {

      this.toastService.clear();

      const loadingToast = this.toastService.show(
        'Eliminando usuario...',
        '',
        {
          toastComponent: ToastLoadingComponent,
          positionClass: 'toast-center-center',
          disableTimeOut: true,
          tapToDismiss: false
        }
      );

      try {
        const response = await this.usuarioService.remove(item.Id);
        this.toastService.clear();

        if (response.success) {
          this.toastService.success(response.message);
          await this.initialize();
        } else {
          this.toastService.error(response.message);
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
