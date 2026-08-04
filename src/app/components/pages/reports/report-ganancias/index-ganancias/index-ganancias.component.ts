import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReportProfitData, ReportProfitFilter } from 'src/app/shared/models/base/ReportProfitFilter';
import { ECategoria } from 'src/app/shared/models/entidades/ECategoria';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { ReportProfitService } from 'src/app/shared/services/reportprofit.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-index-ganancias',
  templateUrl: './index-ganancias.component.html',
  styleUrls: ['./index-ganancias.component.scss']
})
export class IndexGananciasComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;
  Loading: boolean = false;
  RangoPersonalizadoAplicado: boolean = false;

  ListaSucursales: ESucursal[] = [];
  // ListaProductos: EProducto[] = [];
  // ListaCategorias: ECategoria[] = [];

  Data: ReportProfitData | null = null;

  Filtro: ReportProfitFilter = {
    branch_id: null,
    product_id: null,
    category_id: null,
    date_start: null,
    date_end: null,
  }

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public reporteService: ReportProfitService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public sucursalService: BranchService,
    public productService: ProductService,
    public categoriaService: CategoryService
  ) {
    super('index-compras', dialog, route, router, spinner)
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
      // this.ListaProductos = resultadoPro;
      // this.ListaCategorias = resultadoCat;
      const tienePermiso = this.validarPermisos(this.Role, ['administrator'], this.router, this.toastService);
      if (tienePermiso) {
        this.initialize();
      }
    });
  }

  async initialize(): Promise<void> {
    this.obtenerMaestros();
  }

  async obtenerMaestros(): Promise<void> {
    this.Loading = true;
    try {
      this.Data = await this.reporteService.index(this.Filtro);
    } catch (error) {
      this.Data = null;
      this.toastService.error('No se pudo obtener el reporte de ganancias.');
    } finally {
      this.Loading = false;
    }
  }

  async aplicarFiltros(filtro: ReportProfitFilter): Promise<void> {
    this.Filtro = { ...filtro };
    this.RangoPersonalizadoAplicado = !!filtro.date_start && !!filtro.date_end;
    await this.obtenerMaestros();
  }

  async clearFilters(): Promise<void> {
    this.RangoPersonalizadoAplicado = false;
    this.Filtro = {
      branch_id: null,
      product_id: null,
      category_id: null,
      date_start: null,
      date_end: null,
    }
    await this.obtenerMaestros();
  }

}
