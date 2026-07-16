import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportInventoryFilter } from 'src/app/shared/models/base/ReportInventoryFilter';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ReportInventoryService } from 'src/app/shared/services/reportinventory.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { InventoryStock } from '../partials/inventory-stock/inventory-stock.component';
import { InventoryMovement } from '../partials/inventory-movements/inventory-movements.component';

@Component({
  selector: 'app-index-inventario',
  templateUrl: './index-inventario.component.html',
  styleUrls: ['./index-inventario.component.scss']
})
export class IndexInventarioComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;
  Loading: boolean = false;

  ListaSucursales: ESucursal[] = [];
  ListaProductos: EProducto[] = [];

  Filtro: ReportInventoryFilter = {
    branch_id: null,
    product_id: null,
    date_start: null,
    date_end: null,
  }

  Resumen: any
  Stock: InventoryStock[] = [];
  Movimientos: InventoryMovement[] = [];
  Productos: any[] = [];
  BajoStock: any[] = [];
  PorCategoria: any[] = [];
  PorSucursal: any[] = [];

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public reporteService: ReportInventoryService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public productoService: ProductService,
    public sucursalService: BranchService,
  ) {
    super('index-ventas', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany(),
      this.sucursalService.adm(),
      this.productoService.adm(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoCompania, resultadoScur, rproductos]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompania;
      this.ListaSucursales = resultadoScur;
      this.ListaProductos = rproductos;
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
    this.Stock = data.stock;
    this.Movimientos = data.movements;
    this.Productos = data.products;
    this.BajoStock = data.low_stock;
    this.PorCategoria = data.by_category;
    this.PorSucursal = data.by_branch;
    this.Loading = false;
  }

  async aplicarFiltros(filtro: ReportInventoryFilter): Promise<void> {
    this.Filtro = { ...filtro };
    await this.obtenerMaestros();
  }

  async clearFilters(): Promise<void> {
    this.Filtro = {
      branch_id: null,
      product_id: null,
      date_start: null,
      date_end: null
    };
    await this.obtenerMaestros();
  }
}
