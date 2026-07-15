import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@auth0/auth0-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportSaleFilter } from 'src/app/shared/models/base/ReportSaleFilter';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ReportSaleService } from 'src/app/shared/services/reportsale.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-index-ventas',
  templateUrl: './index-ventas.component.html',
  styleUrls: ['./index-ventas.component.scss']
})
export class IndexVentasComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;
  Loading: boolean = false;

  ListaSucursales: ESucursal[] = [];
  ListaClientes: ECliente[] = [];
  ListaUsuarios: Eusuario[] = [];

  Resumen: any;
  VentasPorDia: any[] = [];
  VentasPorMes: any[] = [];
  TopProductos: any[] = [];
  TopClientes: any[] = [];
  MetodosDePago: any[] = [];
  TiposDeVoucher: any[] = [];
  // Ventas: any[] = [];

  Filtro: ReportSaleFilter = {
    branch_id: null,
    customer_id: null,
    user_id: null,
    payment_method: null,
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
    public reporteService: ReportSaleService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public clienteService: CustomerService,
    public sucursalService: BranchService,
    public usurioService: UserService
  ) {
    super('index-ventas', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany(),
      this.clienteService.adm(),
      this.sucursalService.adm(),
      this.usurioService.adm(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoCompania, resultadoClientes, resultadoScur, rusuarios]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompania;
      this.ListaClientes = resultadoClientes;
      this.ListaSucursales = resultadoScur;
      this.ListaUsuarios = rusuarios;
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
    const data = await this.reporteService.index(this.Filtro)
    this.Resumen = data.summary;
    this.VentasPorDia = data.sales_by_day;
    this.VentasPorMes = data.sales_by_month;
    this.TopProductos = data.top_products;
    this.TopClientes = data.top_customers;
    this.MetodosDePago = data.payment_methods;
    this.TiposDeVoucher = data.voucher_types;
    // this.Ventas = data.sales;
    this.Loading = false;
  }

  async clearFilters() {
    this.Filtro = {
      branch_id: null,
      customer_id: null,
      user_id: null,
      payment_method: null,
      voucher_type: null,
      status: null,
      date_start: null,
      date_end: null,
    }
    await this.obtenerMaestros();
  }
}
