import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportPurchaseFilter } from 'src/app/shared/models/base/ReportPurchaseFilter';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import { ReportPurchaseService } from 'src/app/shared/services/reporpurchase.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-index-compras',
  templateUrl: './index-compras.component.html',
  styleUrls: ['./index-compras.component.scss']
})
export class IndexComprasComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;
  Loading: boolean = false;

  ListaSucursales: ESucursal[] = [];
  ListaProveedores: EProveedor[] = [];
  ListaUsuarios: Eusuario[] = [];

  Resumen: any;
  ComprasPorDia: [] = [];
  ComprasPorMes: [] = [];
  TopProductos: [] = [];
  TopProveedores: [] = [];
  TipoDeVoucher: [] = [];
  CompraEstado: [] = [];

  Filtro: ReportPurchaseFilter = {
    branch_id: null,
    supplier_id: null,
    user_id: null,
    voucher_type: null,
    status: null,
    date_start: null,
    date_end: null,
  }

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public reporteService: ReportPurchaseService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public provedorService: SupplierService,
    public sucursalService: BranchService,
    public usurioService: UserService
  ) {
    super('index-compras', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany(),
      this.provedorService.adm(),
      this.sucursalService.adm(),
      this.usurioService.adm(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoCompania, resultadoClientes, resultadoScur, rusuarios]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompania;
      this.ListaProveedores = resultadoClientes;
      this.ListaSucursales = resultadoScur;
      this.ListaUsuarios = rusuarios;
      const tienePermiso = this.validarPermisos(this.Role, ['administrator'], this.router, this.toastService);
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
    const data = await this.reporteService.index(this.Filtro)
    this.Resumen = data.summary;
    this.ComprasPorDia = data.purchases_by_day;
    this.ComprasPorMes = data.purchases_by_month;
    this.TopProductos = data.top_products;
    this.TopProveedores = data.top_suppliers;
    this.TipoDeVoucher = data.voucher_types;
    this.CompraEstado = data.purchase_status;
    this.Loading = false;
  }

  async clearFilters() {
    this.Filtro = {
      branch_id: null,
      supplier_id: null,
      user_id: null,
      voucher_type: null,
      status: null,
      date_start: null,
      date_end: null,
    }
    await this.obtenerMaestros();
  }
}
