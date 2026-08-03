import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { QuotationFilter } from 'src/app/shared/models/base/QuotationFilter';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { ECotizacion } from 'src/app/shared/models/entidades/ECotizacion';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { QuotationService } from 'src/app/shared/services/quotation.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ConvertQuotationDialogComponent } from '../widzard/convert-quotation-dialog/convert-quotation-dialog.component';

@Component({
  selector: 'app-bandeja-cotizaciones',
  templateUrl: './bandeja-cotizaciones.component.html',
  styleUrls: ['./bandeja-cotizaciones.component.scss']
})
export class BandejaCotizacionesComponent extends FormularioBase implements OnInit {

  ListaCotizaciones: ECotizacion[] = [];
  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;

  PaginaActual: number = 1;
  TotalPaginas: number = 1;
  TotalRegistros: number = 0;
  RegistrosPorPagina: number = 10;

  Loading: boolean = false;
  LoadingToast: any;

  ListaClientes: ECliente[] = [];
  ListaSucursales: ESucursal[] = [];
  Resumen: any;

  Filtro: QuotationFilter = {
    page: 1,
    search: '',
    customer_id: null,
    branch_id: null,
    status: null,
    issue_date_start: null,
    issue_date_end: null,
    expiration_date_start: null,
    expiration_date_end: null
  }

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public cotizacionService: QuotationService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public clienteService: CustomerService,
    public sucursalService: BranchService
  ) {
    super('bandeja-cotizaciones', dialog, route, router, spinner)
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
      const tienePermiso = this.validarPermisos(this.Role, ['administrator', 'seller'], this.router, this.toastService);
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
    const data = await this.cotizacionService.index(this.Filtro)
    this.ListaCotizaciones = ECotizacion.parseJsonList(data.data);
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
      customer_id: null,
      branch_id: null,
      status: null,
      issue_date_start: null,
      issue_date_end: null,
      expiration_date_start: null,
      expiration_date_end: null
    }
    this.PaginaActual = 1;
    await this.obtenerMaestros();
  }

  OnEventoVerDetalle(cotizacion: ECotizacion): void {
    this.router.navigate([`bandeja-cotizaciones/${cotizacion.Id}/detalle-cotizacion`]);
  }

  OnEventoVerDetalleVenta(cotizacion: ECotizacion): void {
    this.router.navigate([`bandeja-ventas/${cotizacion.IdVenta}/detalle-venta`]);
  }

  async OnEventoEnviar(cotizacion: ECotizacion): Promise<void> {
    if (this.Loading) {
      return;
    }

    const telefono = this.obtenerNumeroWhatsApp(cotizacion.TelefonoCliente);
    if (!telefono) {
      this.toastService.warning('El cliente no tiene un número de teléfono registrado.');
      return;
    }

    const confirmToast =
      this.toastService.show(`¿Deseas enviar la cotización ${cotizacion.Cotizacion} por WhatsApp?`,
        'Enviar cotización',
        { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
      );

    confirmToast.onAction.subscribe(
      async () => {
        this.toastService.clear();
        this.Loading = true;
        try {
          const response = await this.cotizacionService.sent(cotizacion.Id);
          this.toastService.clear();
          if (!response.success) {
            this.toastService.warning(response.message);
            return;
          }

          const mensaje = this.crearMensajeWhatsApp(cotizacion);
          const urlWhatsApp = `https://wa.me/${telefono}` + `?text=${encodeURIComponent(mensaje)}`;
          window.open(urlWhatsApp, '_blank', 'noopener,noreferrer');
          this.toastService.success('Cotización marcada como enviada. Completa el envío desde WhatsApp.');
          await this.obtenerMaestros();
        } catch (error: any) {
          this.toastService.clear();
          this.toastService.error(error?.message || 'Ocurrió un error al enviar la cotización.');
        } finally {
          this.Loading = false;
        }
      }
    );
  }

  async OnEventoAceptar(cotizacion: ECotizacion): Promise<void> {
    const response = await this.cotizacionService.accept(cotizacion.Id);
    if (!response.success) {
      this.toastService.warning(response.message);
      return;
    }
    this.toastService.success(response.message);
    await this.obtenerMaestros();
  }

  async OnEventoRechazar(cotizacion: ECotizacion): Promise<void> {
    const response = await this.cotizacionService.reject(cotizacion.Id);
    if (!response.success) {
      this.toastService.warning(response.message);
      return;
    }
    this.toastService.success(response.message);
    await this.obtenerMaestros();
  }

  async OnEventoConvertirVenta(cotizacion: ECotizacion): Promise<void> {

    if (this.Loading) {
      return;
    }
    const dialogRef = this.dialog.open(ConvertQuotationDialogComponent,
      {
        width: '820px', maxWidth: '96vw', disableClose: true, autoFocus: false,
        data: { cotizacion, simboloMoneda: this.CompaniaActual?.SimboloMoneda || 'S/' }
      }
    );

    const formulario = await dialogRef.afterClosed().toPromise();
    if (!formulario) {
      return;
    }

    const confirmToast =
      this.toastService.show(`¿Deseas convertir la cotización ${cotizacion.Cotizacion} en una venta?`,
        'Confirmar conversión',
        { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
      );

    confirmToast.onAction.subscribe(
      async () => {
        this.toastService.clear();
        this.Loading = true;
        this.LoadingToast = this.toastService.show('Convirtiendo cotización...',
          'Creando venta y actualizando inventario...',
          {
            toastComponent: ToastLoadingComponent,
            positionClass: 'toast-center-center',
            disableTimeOut: true,
            tapToDismiss: false,
            closeButton: false,
            enableHtml: true
          }
        );
        try {
          const formData = new FormData();
          formData.append('id', String(cotizacion.Id));
          formData.append('sale_date', this.onEventoFormatearFecha(formulario.sale_date));
          formData.append('voucher_type', formulario.voucher_type);
          formData.append('voucher_series', formulario.voucher_series);
          formData.append('voucher_number', '')
          formData.append('payment_condition', formulario.payment_condition);
          formData.append('payment_method', formulario.payment_method);
          formData.append('amount_paid', String(formulario.amount_paid || 0));
          formData.append('due_date', formulario.due_date ? this.onEventoFormatearFecha(formulario.due_date) : '');

          const response = await this.cotizacionService.convert(formData);
          this.toastService.clear();
          if (!response.success) {
            this.toastService.error(response.message);
            return;
          }
          this.toastService.success(response.message || 'Cotización convertida en venta correctamente.');
          const ventaGenerada = response.data?.sale;
          await this.obtenerMaestros();
          if (ventaGenerada?.id) {
            this.router.navigate([`bandeja-ventas/${ventaGenerada.id}/detalle-venta`]);
          }
        } catch (error: any) {
          this.toastService.clear();
          this.toastService.error(error?.error?.message || error?.message || 'Ocurrió un error al convertir la cotización.');
        } finally {
          this.Loading = false;
        }
      }
    );
  }

  async OnEventoCancelar(cotizacion: ECotizacion): Promise<void> {
    const response = await this.cotizacionService.cancel(cotizacion.Id);
    if (!response.success) {
      this.toastService.warning(response.message);
      return;
    }
    this.toastService.success(response.message);
    await this.obtenerMaestros();
  }

  private obtenerNumeroWhatsApp(numero: string): string {
    let telefono = String(numero || '').replace(/\D/g, '');
    if (!telefono) {
      return '';
    }
    if (telefono.length === 9) {
      telefono = `51${telefono}`;
    }
    return telefono;
  }

  private crearMensajeWhatsApp(cotizacion: ECotizacion): string {
    const moneda = this.CompaniaActual?.SimboloMoneda || 'S/';
    const mensaje = [
      `Hola ${cotizacion.NombreCliente || 'cliente'},`,
      '',
      `Te compartimos la cotización *${cotizacion.Cotizacion}*.`,
      '',
      `📄 *COTIZACIÓN*`,
      `• Número: ${cotizacion.Cotizacion}`,
      `• Fecha de emisión: ${cotizacion.FechaAsunto}`,
      `• Fecha de vencimiento: ${cotizacion.FechaExpiracion}`,
      `• Productos: ${cotizacion.CantidadItems}`,
      `• Subtotal: ${moneda} ${Number(cotizacion.SubTotal || 0).toFixed(2)}`,
      `• Descuento: ${moneda} ${Number(cotizacion.Descuento || 0).toFixed(2)}`,
      `• Total: *${moneda} ${Number(cotizacion.Total || 0).toFixed(2)}*`,
      '',
      `La cotización es válida hasta la fecha de vencimiento indicada.`,
      '',
      `Quedamos atentos a tu confirmación.`
    ];
    return mensaje.join('\n');
  }
}
