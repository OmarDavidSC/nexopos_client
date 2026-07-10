import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalProductoComponent } from '../modals/modal-producto/modal-producto.component';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { ProductFilter } from 'src/app/shared/models/base/ProductFilter';
import { EMarca } from 'src/app/shared/models/entidades/EMarca';
import { ECategoria } from 'src/app/shared/models/entidades/ECategoria';
import { CategoryService } from 'src/app/shared/services/category.service';
import { BrandService } from 'src/app/shared/services/brand.service';
import { UnitService } from 'src/app/shared/services/unit.service';
import { EUnidad } from 'src/app/shared/models/entidades/EUnidad';

@Component({
  selector: 'app-adm-productos',
  templateUrl: './adm-productos.component.html',
  styleUrls: ['./adm-productos.component.scss']
})
export class AdmProductosComponent extends FormularioBase implements OnInit {

  ListaProductos: EProducto[] = [];
  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;

  PaginaActual: number = 1;
  TotalPaginas: number = 1;
  TotalRegistros: number = 0;

  Loading: boolean = false;

  Filtro: ProductFilter = {
    page: 1,
    search: '',
    category_id: null,
    brand_id: null,
    status: null
  };

  ListaCategorias: ECategoria[] = [];
  ListaMarcas: EMarca[] = [];
  ListaUnidades: EUnidad[] = [];

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public productoService: ProductService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public categoriaService: CategoryService,
    public marcaService: BrandService,
    public unidadService: UnitService
  ) {
    super('adm-productos', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),

      this.auhtStore.getRole(),
      this.categoriaService.adm(),
      this.marcaService.adm(),
      this.unidadService.adm()
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoCategorias, resultadoMarcas, resultadoUnidades]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.ListaCategorias = resultadoCategorias;
      this.ListaMarcas = resultadoMarcas;
      this.ListaUnidades = resultadoUnidades;
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
    const data = await this.productoService.index(this.Filtro)
    this.ListaProductos = EProducto.parseJsonList(data.data);
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

  async onSearch() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();

  }

  async onCategoryChange() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();
  }

  async onBrandChange() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();
  }

  async onStatusChange() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalProductoComponent, {
      width: '600px',
      disableClose: true,
      data: {
        producto: null,
        categorias: this.ListaCategorias,
        marcas: this.ListaMarcas,
        unidades: this.ListaUnidades,
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }

  async eventoMostrarPopupEditar(item: EProducto): Promise<void> {
    const dialogRef = this.dialog.open(ModalProductoComponent, {
      width: '600px',
      disableClose: true,
      data: {
        producto: item,
        categorias: this.ListaCategorias,
        marcas: this.ListaMarcas,
        unidades: this.ListaUnidades,
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }

  async eventoEliminar(item: EProducto): Promise<void> {
    const confirmToast = this.toastService.show(
      '¿Confirmas la eliminación del producto?', 'Eliminar producto',
      { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
    );
    confirmToast.onAction.subscribe(async () => {
      this.toastService.clear();
      const loadingToast = this.toastService.show(
        'Eliminando producto...', '',
        { toastComponent: ToastLoadingComponent, positionClass: 'toast-center-center', disableTimeOut: true, tapToDismiss: false }
      );
      try {
        const { success, data, message } = await this.productoService.remove(item.Id);
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

  async clearFilters() {
    this.Filtro = {
      page: 1,
      search: '',
      category_id: null,
      brand_id: null,
      status: null
    };
    this.PaginaActual = 1;
    await this.obtenerMaestros();
  }
}
