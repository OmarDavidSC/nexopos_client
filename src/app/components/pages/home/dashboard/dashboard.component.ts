import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;

  Loading: boolean = false;

  Resumen: any;
  Inventario: any;
  Alertas: any[] = [];
  VentasDeHoy: any = null;
  ComprasDeHoy: any = null;
  GraficoDeVentas: any[] = [];
  ProductosDestacados: any[] = [];
  CategoriasDestacadas: any[] = [];
  RendiemientoPorSucursal: any[] = [];

  AccesosRapidos = [
    { nombre: 'Nueva Venta', icono: 'point_of_sale', ruta: '/bandeja-ventas/nueva-venta' },
    { nombre: 'Nueva Compra', icono: 'shopping_cart', ruta: '/bandeja-compras/nueva-compra' },
    { nombre: 'Productos', icono: 'add_box', ruta: '/administracion-productos' },
    { nombre: 'Usuarios', icono: 'person_add', ruta: '/mis-usuarios' },

    { nombre: 'Inventario', icono: 'warehouse', ruta: '/stock-sucursales' },
    { nombre: 'Mi Empresa', icono: 'business', ruta: '/mi-compania' },
    { nombre: 'Mi Perfil', icono: 'account_circle', ruta: '/mi-perfil' },
    { nombre: 'Ventas', icono: 'receipt_long', ruta: '/bandeja-ventas' }
  ];

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public dashboardService: DashboardService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
  ) {
    super('dashboard', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoComopany]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoComopany;
      // const tienePermiso = this.validarPermisos(this.Role, ['administrator'], this.router, this.toastService);
      // if (tienePermiso) {
      //   this.initialize();
      // }
      this.initialize();
    });
  }

  async initialize() {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    this.Loading = true;
    const data = await this.dashboardService.index()
    this.Resumen = data.summary;
    this.Inventario = data.inventory;
    this.Alertas = data.alerts;
    this.VentasDeHoy = data.sales_today;
    this.ComprasDeHoy = data.purchases_today;
    this.GraficoDeVentas = data.sales_chart;
    this.ProductosDestacados = data.top_products;
    this.CategoriasDestacadas = data.top_categories;
    this.RendiemientoPorSucursal = data.branch_performance;
    this.Loading = false;
  }
}
