import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SaleFiltre } from 'src/app/shared/models/base/SaleFiltre';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { EVenta } from 'src/app/shared/models/entidades/EVenta';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { SaleService } from 'src/app/shared/services/sale.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalAnularVentaComponent } from '../modals/modal-anular-venta/modal-anular-venta.component';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { BranchService } from 'src/app/shared/services/branch.service';

@Component({
  selector: 'app-bandeja-ventas',
  templateUrl: './bandeja-ventas.component.html',
  styleUrls: ['./bandeja-ventas.component.scss']
})
export class BandejaVentasComponent extends FormularioBase implements OnInit {

  ListaVentas: EVenta[] = [];
  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;

  PaginaActual: number = 1;
  TotalPaginas: number = 1;
  TotalRegistros: number = 0;
  RegistrosPorPagina: number = 10;

  Loading: boolean = false;

  ListaClientes: ECliente[] = [];
  ListaSucursales: ESucursal[] = [];

  Resumen: any;
  Filtro: SaleFiltre = {
    page: 1,
    search: '',
    branch_id: null,
    customer_id: null,
    status: null,
    sunat_status: null,
    payment_method: null
  };

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public ventaService: SaleService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public clienteService: CustomerService,
    public sucursalService: BranchService
  ) {
    super('bandeja-ventas', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany(),
      this.clienteService.adm(),
      this.sucursalService.adm(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoCompania, resultadoClientes, resultadoScur]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompania;
      this.ListaClientes = resultadoClientes;
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
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    this.Loading = true;
    const data = await this.ventaService.index(this.Filtro)
    this.ListaVentas = EVenta.parseJsonList(data.data);
    this.PaginaActual = data.page;
    this.TotalPaginas = data.total_pages;
    this.TotalRegistros = data.total;
    this.Resumen = data.summary;
    this.Loading = false;
  }

  async OnchangedPage(page: number): Promise<void> {
    if (page < 1 || page > this.TotalPaginas || page === this.PaginaActual) {
      return;
    }

    this.PaginaActual = page;
    this.Filtro.page = page;

    await this.obtenerMaestros();
  }

  async aplicarFiltro(): Promise<void> {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();
  }

  get PaginasVisibles(): number[] {
    const paginas: number[] = [];
    const maximoVisible = 5;

    if (this.TotalPaginas <= maximoVisible) {
      for (let pagina = 1; pagina <= this.TotalPaginas; pagina++) {
        paginas.push(pagina);
      }
      return paginas;
    }

    let inicio = Math.max(1, this.PaginaActual - 2);
    let fin = Math.min(this.TotalPaginas, inicio + maximoVisible - 1);

    if (fin - inicio < maximoVisible - 1) {
      inicio = Math.max(1, fin - maximoVisible + 1);
    }

    for (let pagina = inicio; pagina <= fin; pagina++) {
      paginas.push(pagina);
    }
    return paginas;
  }

  get DesdeRegistro(): number {
    if (this.TotalRegistros === 0) {
      return 0;
    }

    return ((this.PaginaActual - 1) * this.RegistrosPorPagina) + 1;
  }

  get HastaRegistro(): number {
    return Math.min(
      this.PaginaActual * this.RegistrosPorPagina,
      this.TotalRegistros
    );
  }

  async clearFilters(): Promise<void> {
    this.Filtro = {
      page: 1,
      search: '',
      branch_id: null,
      customer_id: null,
      status: null,
      sunat_status: null,
      payment_method: null
    };
    this.PaginaActual = 1;
    await this.obtenerMaestros();
  }

  async OnEventoVerDetalle(compra: EVenta) {
    this.Navegar(`bandeja-ventas/${compra.Id}/detalle-venta`);
  }

  async OnEventoCancelar(venta: EVenta) {
    const dialogRef = this.dialog.open(ModalAnularVentaComponent, {
      width: '900px',
      disableClose: true,
      data: {
        venta: venta,
        moneda: this.CompaniaActual.SimboloMoneda
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }
}
