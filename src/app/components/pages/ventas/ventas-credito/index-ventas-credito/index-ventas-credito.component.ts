import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import { SalePaymenteService } from 'src/app/shared/services/salepayement.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-index-ventas-credito',
  templateUrl: './index-ventas-credito.component.html',
  styleUrls: ['./index-ventas-credito.component.scss']
})
export class IndexVentasCreditoComponent extends FormularioBase implements OnInit {

  ListPagos: any[] = [];
  ListaSucursales: ESucursal[] = [];
  IdVenta: number = 0;

  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;

  Loading: boolean = false;


  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public pagosService: SalePaymenteService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public sucursalService: BranchService
  ) {
    super('bandeja-ventas', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany(),
      this.sucursalService.adm(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoCompania, resultadoScur]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompania;
      this.ListaSucursales = resultadoScur;
      const tienePermiso = this.validarPermisos(
        this.Role,
        ['administrator', 'seller'],
        this.router,
        this.toastService
      );

      if (tienePermiso) {
        this.initialize();
      }
    });
  }

  async initialize() {
    this.IdVenta = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    this.Loading = true;
    const data = await this.pagosService.payments(this.IdVenta);
    this.ListPagos = data.data;
    this.Loading = false;
  }

} 
