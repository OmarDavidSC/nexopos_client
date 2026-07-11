import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PurchaseFiltre } from 'src/app/shared/models/base/PurchaseFiltre';
import { ECompra } from 'src/app/shared/models/entidades/ECompra';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PurchaseService } from 'src/app/shared/services/purchase.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalCancelarCompraComponent } from '../modals/modal-cancelar-compra/modal-cancelar-compra.component';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';

@Component({
  selector: 'app-bandeja-compras',
  templateUrl: './bandeja-compras.component.html',
  styleUrls: ['./bandeja-compras.component.scss']
})
export class BandejaComprasComponent extends FormularioBase implements OnInit {

  ListaCompras: ECompra[] = [];
  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;

  PaginaActual: number = 1;
  TotalPaginas: number = 1;
  TotalRegistros: number = 0;

  Loading: boolean = false;

  ListaProveedores: EProveedor[] = [];

  Resumen: any;
  Filtro: PurchaseFiltre = {
    page: 1,
    search: '',
    supplier_id: null,
    status: null
  };

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public compraService: PurchaseService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public proveedorService: SupplierService
  ) {
    super('bandeja-compras', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.proveedorService.adm(),
      this.auhtStore.getCompany(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoProveedores, resultadoCompania]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.ListaProveedores = resultadoProveedores;
      this.CompaniaActual = resultadoCompania;
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
    const data = await this.compraService.index(this.Filtro)
    this.ListaCompras = ECompra.parseJsonList(data.data);
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

  async OnSupplierChange() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();
  }

  async onStatusChange() {
    this.PaginaActual = 1;
    this.Filtro.page = 1;
    await this.obtenerMaestros();
  }

  async clearFilters() {
    this.Filtro = {
      page: 1,
      search: '',
      supplier_id: null,
      status: null
    };
    this.PaginaActual = 1;
    await this.obtenerMaestros();
  }

  async OnEventoVerDetalle(compra: ECompra) {
    this.Navegar(`bandeja-compras/${compra.Id}/detalle-compra`);
  }

  async OnEventoCancelar(compra: ECompra) {
    const dialogRef = this.dialog.open(ModalCancelarCompraComponent, {
      width: '900px',
      disableClose: true,
      data: {
        compra: compra,
        moneda: this.CompaniaActual.SimboloMoneda
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.initialize();
    }
  }
}
