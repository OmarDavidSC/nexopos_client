import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { QuotationService } from 'src/app/shared/services/quotation.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalClienteComponent } from '../../ventas/modals/modal-cliente/modal-cliente.component';

@Component({
  selector: 'app-formulario-cotizacion',
  templateUrl: './formulario-cotizacion.component.html',
  styleUrls: ['./formulario-cotizacion.component.scss'],
})
export class FormularioCotizacionComponent extends FormularioBase implements OnInit {
  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;

  Loading: boolean = false;
  LoadingToast: any;
  PasoActual: number = 1;
  TotalPasos: number = 4;

  ListaClientes: ECliente[] = [];
  ListaProductos: EProducto[] = [];
  clientesFiltrados: ECliente[] = [];
  productosFiltrados: EProducto[] = [];
  textoCliente: string = '';
  ClienteSeleccionado: ECliente | null = null;
  textoProducto: string = '';
  ProductoSeleccionado: EProducto | null = null;
  DetallesCotizacion: any[] = [];

  cotizacion: any = {
    customer_id: null,
    customer_document: '',
    customer_name: '',
    quotation_series: 'COT',
    issue_date: new Date(),
    expiration_date: this.agregarDias(new Date(), 15),
    status: 'DRAFT',
    observations: '',
    terms: '',
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  };

  productoTemporal: any = {
    product_id: null,
    code: '',
    name: '',
    quantity: 1,
    unit_price: 0,
    discount_percentage: 0,
    discount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    description: '',
    stock: 0,
  };

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
    public productoService: ProductService,
  ) {
    super('formulario-cotizacion', dialog, route, router, spinner);
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany(),
      this.clienteService.adm(),
      this.productoService.adm(),
    ]).then(([resultadoUsuario, resultadoRol, resultadoCompania, resultadoClientes, resultadoProductos,]) => {

      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRol;
      this.CompaniaActual = resultadoCompania;
      this.ListaClientes = resultadoClientes || [];
      this.ListaProductos = resultadoProductos || [];
      this.clientesFiltrados = [...this.ListaClientes];
      this.productosFiltrados = [...this.ListaProductos];
      const tienePermiso = this.validarPermisos(this.Role, ['administrator', 'seller'], this.router, this.toastService,);
      if (!tienePermiso) {
        return;
      }
    });
  }

  OnEventoSiguientePaso(): void {
    if (!this.validarPasoActual()) {
      return;
    }
    if (this.PasoActual < this.TotalPasos) {
      this.PasoActual++;
    }
  }

  OnEventoPasoAnterior(): void {
    if (this.PasoActual > 1) {
      this.PasoActual--;
    }
  }

  OnEventoIrPaso(paso: number): void {
    if (paso < 1 || paso > this.TotalPasos) {
      return;
    }
    if (paso > this.PasoActual) {
      return;
    }
    this.PasoActual = paso;
  }

  validarPasoActual(): boolean {
    switch (this.PasoActual) {
      case 1: return this.validarDatosGenerales();
      case 2: return this.validarCliente();
      case 3: return this.validarProductos();
      default: return true;
    }
  }

  validarDatosGenerales(): boolean {
    if (!this.cotizacion.issue_date) {
      this.toastService.warning('Seleccione la fecha de emisión.');
      return false;
    }

    if (!this.cotizacion.expiration_date) {
      this.toastService.warning('Seleccione la fecha de vencimiento.');
      return false;
    }
    const fechaEmision = new Date(this.cotizacion.issue_date);
    const fechaVencimiento = new Date(this.cotizacion.expiration_date);
    fechaEmision.setHours(0, 0, 0, 0);
    fechaVencimiento.setHours(0, 0, 0, 0);
    if (fechaVencimiento.getTime() < fechaEmision.getTime()) {
      this.toastService.warning('La fecha de vencimiento no puede ser menor que la fecha de emisión.', 'Advertencia');
      return false;
    }
    return true;
  }

  validarCliente(): boolean {
    if (!this.cotizacion.customer_id) {
      this.toastService.warning('Seleccione un cliente.', 'Advertencia');
      return false;
    }
    return true;
  }

  validarProductos(): boolean {
    if (this.DetallesCotizacion.length === 0) {
      this.toastService.warning('Agregue al menos un producto.', 'Advertencia');
      return false;
    }
    return true;
  }

  get PasoGeneralCompleto(): boolean {
    return Boolean(this.cotizacion.issue_date && this.cotizacion.expiration_date,);
  }

  get PasoClienteCompleto(): boolean {
    return Number(this.cotizacion.customer_id) > 0;
  }

  get PasoProductosCompleto(): boolean {
    return this.DetallesCotizacion.length > 0;
  }

  get FormularioCompleto(): boolean {
    return (this.PasoGeneralCompleto && this.PasoClienteCompleto && this.PasoProductosCompleto && Number(this.cotizacion.total) > 0);
  }

  OnEventoActualizarDatosGenerales(datos: any): void {
    this.cotizacion = { ...this.cotizacion, ...datos, };
  }

  OnEventoCambiarFechaEmision(): void {
    if (!this.cotizacion.issue_date) {
      return;
    }

    const fechaEmision = new Date(this.cotizacion.issue_date);
    const fechaVencimiento = new Date(this.cotizacion.expiration_date);
    fechaEmision.setHours(0, 0, 0, 0);
    fechaVencimiento.setHours(0, 0, 0, 0);
    if (fechaVencimiento.getTime() < fechaEmision.getTime()) {
      this.cotizacion.expiration_date = this.agregarDias(fechaEmision, 15);
    }
  }

  filtrarCliente(): void {
    const texto = this.textoCliente.trim().toLowerCase();
    if (!texto) {
      this.clientesFiltrados = [...this.ListaClientes];
      return;
    }

    this.clientesFiltrados = this.ListaClientes.filter((cliente: any) => {
      const nombre = String(cliente.NombreCliente || '').toLowerCase();
      const documento = String(cliente.NumeroDocumento || '').toLowerCase();
      return nombre.includes(texto) || documento.includes(texto);
    });
  }

  seleccionarCliente(cliente: ECliente): void {
    if (!cliente) {
      return;
    }
    this.ClienteSeleccionado = cliente;
    this.cotizacion.customer_id = (cliente as any).Id;
    this.cotizacion.customer_document = (cliente as any).NumeroDocumento;
    this.cotizacion.customer_name = (cliente as any).NombreCliente;
  }

  limpiarCliente(): void {
    this.ClienteSeleccionado = null;
    this.textoCliente = '';
    this.cotizacion.customer_id = null;
    this.cotizacion.customer_document = '';
    this.cotizacion.customer_name = '';
    this.clientesFiltrados = [...this.ListaClientes];
  }

  mostrarCliente(cliente: any): string {
    return cliente ? `${cliente.NumeroDocumento} - ${cliente.NombreCliente}` : '';
  }

  async cargarClientes(): Promise<void> {
    this.ListaClientes = await this.clienteService.adm();
    this.clientesFiltrados = [...this.ListaClientes];
  }

  async eventoMostrarPopupRegistrarCliente(): Promise<void> {
    const dialogRef = this.dialog.open(ModalClienteComponent, {
      width: '600px',
      maxWidth: '95vw',
      disableClose: true,
      data: null,
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.cargarClientes();
    }
  }

  filtrarProducto(): void {
    const texto = this.textoProducto.trim().toLowerCase();
    if (!texto) {
      this.productosFiltrados = [...this.ListaProductos];
      return;
    }

    this.productosFiltrados = this.ListaProductos.filter((producto: any) => {
      const nombre = String(producto.Nombre || '').toLowerCase();
      const codigo = String(producto.Codigo || '').toLowerCase();
      return nombre.includes(texto) || codigo.includes(texto);
    });
  }

  seleccionarProducto(producto: EProducto): void {
    if (!producto) {
      return;
    }

    this.ProductoSeleccionado = producto;
    this.productoTemporal = {
      product_id: (producto as any).Id,
      code: (producto as any).Codigo,
      name: (producto as any).Nombre,
      quantity: 1,
      unit_price: Number((producto as any).PrecioVenta || 0),
      discount_percentage: 0,
      discount: 0,
      subtotal: Number((producto as any).PrecioVenta || 0),
      tax: 0,
      total: Number((producto as any).PrecioVenta || 0),
      stock: Number((producto as any).StockActual || 0),
      description: '',
    };
  }

  mostrarProducto(producto: any): string {
    return producto ? `${producto.Codigo} - ${producto.Nombre}` : '';
  }

  OnEventoCalcularProductoTemporal(): void {
    const cantidad = Number(this.productoTemporal.quantity || 0);
    const precio = Number(this.productoTemporal.unit_price || 0);
    const porcentajeDescuento = Number(this.productoTemporal.discount_percentage || 0,);
    const subtotalBruto = cantidad * precio;
    const descuento = subtotalBruto * (porcentajeDescuento / 100);
    const subtotal = subtotalBruto - descuento;
    this.productoTemporal.discount = this.redondear(descuento);
    this.productoTemporal.subtotal = this.redondear(subtotal);
    this.productoTemporal.tax = 0;
    this.productoTemporal.total = this.redondear(subtotal);
  }

  OnEventoAgregarProducto(): void {
    if (!this.ProductoSeleccionado) {
      this.toastService.warning('Seleccione un producto.', 'Advertencia');
      return;
    }
    if (Number(this.productoTemporal.quantity) <= 0) {
      this.toastService.warning('La cantidad debe ser mayor a cero.', 'Advertencia');
      return;
    }
    if (Number(this.productoTemporal.unit_price) <= 0) {
      this.toastService.warning('El precio debe ser mayor a cero.');
      return;
    }

    const existe = this.DetallesCotizacion.some((detalle) => Number(detalle.product_id) === Number((this.ProductoSeleccionado as any).Id),);
    if (existe) {
      this.toastService.warning('El producto ya fue agregado.', 'Advertencia');
      return;
    }

    this.OnEventoCalcularProductoTemporal();
    const detalle = {
      product_id: this.productoTemporal.product_id,
      code: this.productoTemporal.code,
      name: this.productoTemporal.name,
      quantity: Number(this.productoTemporal.quantity),
      unit_price: Number(this.productoTemporal.unit_price),
      discount_percentage: Number(this.productoTemporal.discount_percentage || 0,),
      discount: Number(this.productoTemporal.discount || 0),
      subtotal: Number(this.productoTemporal.subtotal || 0),
      tax: 0,
      total: Number(this.productoTemporal.total || 0),
      description: this.productoTemporal.description || '',
    };
    this.DetallesCotizacion = [...this.DetallesCotizacion, detalle];
    this.OnEventoCalcularTotales();
    this.limpiarProductoTemporal();
  }

  OnEventoEliminarProducto(index: number): void {
    this.DetallesCotizacion = this.DetallesCotizacion.filter((_, itemIndex) => itemIndex !== index,);
    this.OnEventoCalcularTotales();
  }

  OnEventoActualizarDetalle(evento: { index: number; detalle: any }): void {
    if (evento.index < 0 || evento.index >= this.DetallesCotizacion.length) {
      return;
    }

    const detalles = [...this.DetallesCotizacion];
    detalles[evento.index] = { ...detalles[evento.index], ...evento.detalle, };
    this.DetallesCotizacion = detalles;
    this.OnEventoCalcularTotales();
  }

  limpiarProductoTemporal(): void {
    this.ProductoSeleccionado = null;
    this.textoProducto = '';
    this.productoTemporal = {
      product_id: null,
      code: '',
      name: '',
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
      discount: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
      description: '',
      stock: 0,
    };
    this.productosFiltrados = [...this.ListaProductos];
  }

  OnEventoCalcularTotales(): void {
    this.DetallesCotizacion = this.DetallesCotizacion.map((detalle) => {
      const cantidad = Number(detalle.quantity || 0);
      const precio = Number(detalle.unit_price || 0);
      const porcentajeDescuento = Number(detalle.discount_percentage || 0);
      const subtotalBruto = cantidad * precio;
      const descuento = subtotalBruto * (porcentajeDescuento / 100);
      const subtotal = subtotalBruto - descuento;
      return { ...detalle, discount: this.redondear(descuento), subtotal: this.redondear(subtotal), tax: 0, total: this.redondear(subtotal), };
    });

    this.cotizacion.subtotal = this.redondear(this.DetallesCotizacion.reduce((total, detalle) => total + Number(detalle.quantity) * Number(detalle.unit_price), 0,),);
    this.cotizacion.discount = this.redondear(this.DetallesCotizacion.reduce((total, detalle) => total + Number(detalle.discount || 0), 0,),);
    this.cotizacion.tax = 0;
    this.cotizacion.total = this.redondear(this.cotizacion.subtotal - this.cotizacion.discount + this.cotizacion.tax,);
  }

  async OnEventoGuardarCotizacion(): Promise<void> {
    if (this.Loading) {
      return;
    }
    if (!this.validarDatosGenerales()) {
      this.PasoActual = 1;
      return;
    }
    if (!this.validarCliente()) {
      this.PasoActual = 2;
      return;
    }
    if (!this.validarProductos()) {
      this.PasoActual = 3;
      return;
    }

    const formData = new FormData();
    formData.append('customer_id', String(this.cotizacion.customer_id));
    formData.append('quotation_series', this.cotizacion.quotation_series);
    formData.append('issue_date', this.onEventoFormatearFecha(this.cotizacion.issue_date),);
    formData.append('expiration_date', this.onEventoFormatearFecha(this.cotizacion.expiration_date),);
    formData.append('status', this.cotizacion.status);
    formData.append('observations', this.cotizacion.observations || '');
    formData.append('terms', this.cotizacion.terms || '');
    formData.append('details', JSON.stringify(this.DetallesCotizacion.map((detalle) => ({
      product_id: Number(detalle.product_id),
      quantity: Number(detalle.quantity),
      unit_price: Number(detalle.unit_price),
      discount_percentage: Number(detalle.discount_percentage || 0),
      description: detalle.description || null,
    })),),);

    const confirmToast = this.toastService.show('¿Estás seguro de registrar esta cotización?', 'Confirmación',
      { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true, },
    );

    confirmToast.onAction.subscribe(async () => {
      this.toastService.clear();
      this.Loading = true;
      this.LoadingToast = this.toastService.show('Registrando cotización...', 'Guardando información...',
        { toastComponent: ToastLoadingComponent, positionClass: 'toast-center-center', disableTimeOut: true, tapToDismiss: false, closeButton: false, enableHtml: true, },
      );
      try {
        const response = await this.cotizacionService.store(formData);
        this.toastService.clear();
        if (response.success) {
          this.toastService.success(response.message);
          this.router.navigate(['/bandeja-cotizaciones']);
        } else {
          this.toastService.error(response.message);
        }
      } catch (error: any) {
        this.toastService.clear();
        this.toastService.error(error?.message || 'Ocurrió un error al registrar la cotización.',);
      } finally {
        this.Loading = false;
      }
    });
  }

  agregarDias(fecha: Date, dias: number): Date {
    const resultado = new Date(fecha);
    resultado.setDate(resultado.getDate() + dias);
    return resultado;
  }

  redondear(valor: number): number {
    return Math.round((Number(valor || 0) + Number.EPSILON) * 100) / 100;
  }
}
