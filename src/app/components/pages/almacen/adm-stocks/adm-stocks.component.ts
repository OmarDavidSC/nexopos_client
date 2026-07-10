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

@Component({
  selector: 'app-adm-stocks',
  templateUrl: './adm-stocks.component.html',
  styleUrls: ['./adm-stocks.component.scss']
})
export class AdmStocksComponent extends FormularioBase implements OnInit {

  ListaSucursales: ESucursal[] = [];
  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;

  Loading: boolean = false;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public sucursalService: BranchService
  ) {
    super('adm-stocks', dialog, route, router, spinner)
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
    const data = await this.sucursalService.adm()
    this.ListaSucursales = data;
    this.Loading = false;
  }

  OnEventoAbrirSucursal(item: ESucursal) {
    this.router.navigate(['/stock-sucursales', item.Id, 'detalle-productos']);
  }
}
