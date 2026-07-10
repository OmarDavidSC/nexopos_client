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

@Component({
  selector: 'app-bandeja-ventas',
  templateUrl: './bandeja-ventas.component.html',
  styleUrls: ['./bandeja-ventas.component.scss']
})
export class BandejaVentasComponent extends FormularioBase implements OnInit {

  ListaVentas: EVenta[] = [];
  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;

  PaginaActual: number = 1;
  TotalPaginas: number = 1;
  TotalRegistros: number = 0;

  Loading: boolean = false;

  ListaClientes: ECliente[] = [];

  Resumen: any;
  Filtro: SaleFiltre = {
    page: 1,
    search: '',
    customer_id: null,
    status: null,
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
    public clienteService: CustomerService
  ) {
    super('bandeja-ventas', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.clienteService.adm(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoClientes]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.ListaClientes = resultadoClientes;
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

  async OnchangedPage(page: number) {
    if (page < 1) return;
    if (page > this.TotalPaginas) return;

    this.PaginaActual = page;
    await this.obtenerMaestros();
  }

  async OnSearchFiltro() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();

  }

  async OnCustomerChange() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();
  }

  async onStatusChange() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();
  }

   async onPayMethodChange() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();
  }

  async clearFilters() {
    this.Filtro = {
      page: 1,
      search: '',
      customer_id: null,
      status: null,
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
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }
}
