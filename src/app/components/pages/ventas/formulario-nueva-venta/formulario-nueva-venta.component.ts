import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { SaleService } from 'src/app/shared/services/sale.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';
import { ModalClienteComponent } from '../modals/modal-cliente/modal-cliente.component';
import { ModalProductoComponent } from '../../almacen/modals/modal-producto/modal-producto.component';

@Component({
  selector: 'app-formulario-nueva-venta',
  templateUrl: './formulario-nueva-venta.component.html',
  styleUrls: ['./formulario-nueva-venta.component.scss']
})
export class FormularioNuevaVentaComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;
  Loading = false;
  LoadingToast: any;

  ListaClientes: ECliente[] = [];
  ListaProductos: EProducto[] = [];

  clientesFiltrados: ECliente[] = [];
  productosFiltrados: EProducto[] = [];
  textoCliente = '';
  textoProducto = '';
  ClienteSeleccionado: any = null;
  ProductoSeleccionado: any = null;

  DetallesVenta: any[] = [];
  columnas = ['producto', 'cantidad', 'precio', 'total', 'accion'];

  venta: any = {
    customer_id: null,
    customer_document: '',
    customer_name: '',
    sale_date: new Date(),
    voucher_type: '',
    voucher_series: '',
    voucher_number: '',
    payment_method: '',
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
  };

  productoTemporal: any = {
    quantity: 1,
    sale_price: 0,
    code: '',
    name: '',
    stock: 0,
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
    public productoService: ProductService
  ) { super('formulario-nueva-venta', dialog, route, router, spinner); }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.clienteService.adm(),
      this.productoService.adm()
    ]).then(([resultadoUsuario, resultadoRol, resultadoClientes, resultadoProductos]) => {

      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRol;
      this.ListaClientes = resultadoClientes;
      this.ListaProductos = resultadoProductos;
      this.clientesFiltrados = this.ListaClientes;
      this.productosFiltrados = this.ListaProductos;
      const tienePermiso = this.validarPermisos(this.Role, ['administrator'], this.router, this.toastService);
      if (tienePermiso) {
        // this.cargarClientes();
      }
    });
  }

  async cargarClientes() {
    this.ListaClientes = await this.clienteService.adm();
    this.clientesFiltrados = [...this.ListaClientes];
  }

  cambiarSerie() {
    switch (this.venta.voucher_type) {
      case 'FACTURA': this.venta.voucher_series = 'FA';
        break;
      case 'BOLETA': this.venta.voucher_series = 'BO';
        break;
      case 'NOTA': this.venta.voucher_series = 'NT';
        break;
      case 'TICKET': this.venta.voucher_series = 'TK';
        break;
      default: this.venta.voucher_series = '';
        break;
    }
  }

  filtrarCliente() {
    const texto = this.textoCliente.toLowerCase();
    this.clientesFiltrados = this.ListaClientes.filter((x: any) =>
      x.NombreCliente.toLowerCase().includes(texto) || x.NumeroDocumento.toLowerCase().includes(texto));
  }

  seleccionarCliente(cliente: any) {
    this.ClienteSeleccionado = cliente;
    this.venta.customer_id = cliente.Id;
    this.venta.customer_document = cliente.NumeroDocumento;
    this.venta.customer_name = cliente.NombreCliente;
  }

  mostrarCliente(cliente: any): string {
    return cliente ? `${cliente.NumeroDocumento} - ${cliente.NombreCliente}` : '';
  }

  filtrarProducto() {
    const texto = this.textoProducto.toLowerCase();
    this.productosFiltrados = this.ListaProductos.filter((x: any) =>
      x.Nombre.toLowerCase().includes(texto) ||
      x.Codigo.toLowerCase().includes(texto)
    );
  }

  seleccionarProducto(producto: any) {
    this.ProductoSeleccionado = producto;
    // this.productoTemporal.sale_price = producto.PrecioVenta ?? 0;
    this.productoTemporal.product_id = producto.Id;
    this.productoTemporal.code = producto.Codigo;
    this.productoTemporal.name = producto.Nombre;
    this.productoTemporal.stock = producto.StockActual;
    this.productoTemporal.sale_price = producto.PrecioVenta;
  }

  mostrarProducto(producto: any): string {
    return producto ? `${producto.Codigo} - ${producto.Nombre}` : '';
  }

  OnEventoAgregarProducto() {
    if (!this.ProductoSeleccionado) {
      this.toastService.warning('Seleccione un producto');
      return;
    }

    const detalle = {
      product_id: this.ProductoSeleccionado.Id,
      name: this.ProductoSeleccionado.Nombre,
      quantity: this.productoTemporal.quantity,
      sale_price: this.productoTemporal.sale_price,
      discount: 0,
      tax: 0,
      subtotal: this.productoTemporal.quantity * this.productoTemporal.sale_price,
      total: this.productoTemporal.quantity * this.productoTemporal.sale_price
    };

    this.DetallesVenta = [...this.DetallesVenta, detalle];
    this.OnEventoCalcularTotales();
    this.ProductoSeleccionado = null;
    this.textoProducto = '';
    this.productoTemporal = { quantity: 1, sale_price: 0 };
  }

  OnEventoEliminarProducto(index: number) {
    this.DetallesVenta = this.DetallesVenta.filter((_, i) => i !== index);
    this.OnEventoCalcularTotales();
  }

  OnEventoCalcularTotales() {
    this.venta.subtotal = this.DetallesVenta.reduce((total, item) => total + item.subtotal, 0);
    this.venta.tax = 0;
    this.venta.total = this.venta.subtotal + this.venta.tax - this.venta.discount;
  }

  async OnEventoGuardarVenta(): Promise<void> {

    if (this.Loading) return;
    if (!this.venta.customer_id) {
      this.toastService.warning('Seleccione un cliente');
      return;
    }

    if (this.DetallesVenta.length === 0) {
      this.toastService.warning('Agregue productos');
      return;
    }

    const formData = new FormData();
    formData.append('customer_id', String(this.venta.customer_id));
    formData.append('sale_date', this.onEventoFormatearFecha(this.venta.sale_date));
    formData.append('voucher_type', this.venta.voucher_type);
    formData.append('voucher_series', this.venta.voucher_series);
    formData.append('voucher_number', this.venta.voucher_number);
    formData.append('subtotal', String(this.venta.subtotal));
    formData.append('tax', String(this.venta.tax));
    formData.append('discount', String(this.venta.discount));
    formData.append('total', String(this.venta.total));
    formData.append('payment_method', this.venta.payment_method);
    formData.append('details', JSON.stringify(this.DetallesVenta));

    const confirmToast = this.toastService.show(
      '¿Estas seguro de registrar esta venta?', 'Confirmación',
      { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
    );

    confirmToast.onAction.subscribe(async () => {
      this.toastService.clear();
      this.Loading = true;
      this.LoadingToast = this.toastService.show(
        `<div>
              <strong>Registrando venta...</strong><br>
              Actualizando inventario...
           </div>`,
        '',
        { toastComponent: ToastLoadingComponent, positionClass: 'toast-center-center', disableTimeOut: true, tapToDismiss: false, closeButton: false, enableHtml: true }
      );

      try {
        const response = await this.ventaService.store(formData);
        this.Loading = false;
        this.toastService.clear();
        if (response.success) {
          this.toastService.success(response.message);
          this.router.navigate(['/bandeja-ventas']);
        } else {
          this.toastService.error(response.message);
        }
      } catch (error: any) {
        this.Loading = false;
        this.toastService.clear();
        this.toastService.error(error.message ?? 'Ocurrió un error al registrar la venta.');
      }
    });
  }

  async eventoMostrarPopupRegistrarCliente(): Promise<void> {
    const dialogRef = this.dialog.open(ModalClienteComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.cargarClientes();
    }
  }
}
