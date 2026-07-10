import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ToastConfirmComponent } from 'src/app/shared/components/toast-confirm/toast-confirm.component';
import { ToastLoadingComponent } from 'src/app/shared/components/toast-loading/toast-loading.component';
import { EProducto } from 'src/app/shared/models/entidades/EProducto';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { PurchaseService } from 'src/app/shared/services/purchase.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-formulario-nueva-compra',
  templateUrl: './formulario-nueva-compra.component.html',
  styleUrls: ['./formulario-nueva-compra.component.scss']
})
export class FormularioNuevaCompraComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  Role: ERol | null = null;
  Loading = false;
  LoadingToast: any;

  ListaProveedores: EProveedor[] = [];
  ListaProductos: EProducto[] = [];
  proveedoresFiltrados: EProveedor[] = [];
  productosFiltrados: EProducto[] = [];
  textoProveedor = '';
  textoProducto = '';
  ProveedorSeleccionado: any = null;
  ProductoSeleccionado: any = null;

  DetallesCompra: any[] = [];
  columnas = ['producto', 'cantidad', 'precio', 'total', 'accion'];

  compra: any = {
    supplier_id: null,
    document_number: '',
    business_name: '',
    purchase_date: new Date(),
    voucher_type: 'FACTURA',
    voucher_series: 'FA',
    voucher_number: '',
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    observation: ''
  };

  productoTemporal: any = {
    quantity: 1,
    code: '',
    name: '',
    stock: 0,
    purchase_price: 0
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
    public proveedorService: SupplierService,
    public productoService: ProductService
  ) { super('formulario-nueva-compra', dialog, route, router, spinner); }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.proveedorService.adm(),
      this.productoService.adm()
    ]).then(([resultadoUsuario, resultadoRol, resultadoProveedores, resultadoProductos]) => {

      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRol;
      this.ListaProveedores = resultadoProveedores;
      this.ListaProductos = resultadoProductos;
      this.proveedoresFiltrados = this.ListaProveedores;
      this.productosFiltrados = this.ListaProductos;
      const tienePermiso = this.validarPermisos(this.Role, ['administrator'], this.router, this.toastService);
      if (tienePermiso) {
        this.initialize();
      }
    });
  }

  cambiarSerie() {
    switch (this.compra.voucher_type) {
      case 'FACTURA': this.compra.voucher_series = 'FA';
        break;
      case 'BOLETA': this.compra.voucher_series = 'BO';
        break;
      case 'NOTA': this.compra.voucher_series = 'NT';
        break;
      case 'TICKET': this.compra.voucher_series = 'TK';
        break;
      default: this.compra.voucher_series = '';
        break;
    }
  }

  initialize() {
  }

  filtrarProveedor() {
    const texto = this.textoProveedor.toLowerCase();
    this.proveedoresFiltrados = this.ListaProveedores.filter((x: any) =>
      x.NombreEmpresa.toLowerCase().includes(texto) || x.NumeroDocumento.toLowerCase().includes(texto));
  }

  seleccionarProveedor(proveedor: any) {
    this.ProveedorSeleccionado = proveedor;
    this.textoProveedor = '';
    this.compra.supplier_id = proveedor.Id;
    this.compra.document_number = proveedor.NumeroDocumento;
    this.compra.business_name = proveedor.NombreEmpresa;
  }

  mostrarProveedor(proveedor: any): string {
    return proveedor ? `${proveedor.NumeroDocumento} - ${proveedor.NombreEmpresa}` : '';
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
    this.textoProducto = '';
    this.productoTemporal.code = producto.Codigo;
    this.productoTemporal.name = producto.Nombre;
    this.productoTemporal.stock = producto.StockActual;
    this.productoTemporal.purchase_price = producto.PrecioCompra ?? 0;
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
      purchase_price: this.productoTemporal.purchase_price,
      discount: 0,
      tax: 0,
      subtotal: this.productoTemporal.quantity * this.productoTemporal.purchase_price,
      total: this.productoTemporal.quantity * this.productoTemporal.purchase_price
    };

    this.DetallesCompra = [...this.DetallesCompra, detalle];
    this.OnEventoCalcularTotales();
    this.ProductoSeleccionado = null;
    this.textoProducto = '';
    this.productoTemporal = { quantity: 1, purchase_price: 0 };
  }

  OnEventoEliminarProducto(index: number) {
    this.DetallesCompra = this.DetallesCompra.filter((_, i) => i !== index);
    this.OnEventoCalcularTotales();
  }

  OnEventoCalcularTotales() {
    this.compra.subtotal = this.DetallesCompra.reduce((total, item) => total + item.subtotal, 0);
    this.compra.tax = 0;
    this.compra.total = this.compra.subtotal + this.compra.tax - this.compra.discount;
  }

  async OnEventoGuardarCompra(): Promise<void> {

    if (this.Loading) return;
    if (!this.compra.supplier_id) {
      this.toastService.warning('Seleccione un proveedor');
      return;
    }

    if (this.DetallesCompra.length === 0) {
      this.toastService.warning('Agregue productos');
      return;
    }

    const formData = new FormData();
    formData.append('supplier_id', String(this.compra.supplier_id));
    formData.append('purchase_date', this.onEventoFormatearFecha(this.compra.purchase_date));
    formData.append('voucher_type', this.compra.voucher_type);
    formData.append('voucher_series', this.compra.voucher_series);
    formData.append('voucher_number', this.compra.voucher_number);
    formData.append('subtotal', String(this.compra.subtotal));
    formData.append('tax', String(this.compra.tax));
    formData.append('discount', String(this.compra.discount));
    formData.append('total', String(this.compra.total));
    formData.append('observation', this.compra.observation);
    formData.append('details', JSON.stringify(this.DetallesCompra));

    const confirmToast = this.toastService.show(
      '¿Deseas registrar esta compra?', 'Confirmación',
      { toastComponent: ToastConfirmComponent, positionClass: 'toast-center-center', disableTimeOut: true }
    );

    confirmToast.onAction.subscribe(async () => {
      this.toastService.clear();
      this.Loading = true;
      this.LoadingToast = this.toastService.show(
        `<div>
            <strong>Registrando compra...</strong><br>
            Actualizando inventario...
         </div>`,
        '',
        { toastComponent: ToastLoadingComponent, positionClass: 'toast-center-center', disableTimeOut: true, tapToDismiss: false, closeButton: false, enableHtml: true }
      );

      try {
        const response = await this.compraService.store(formData);
        this.Loading = false;
        this.toastService.clear();
        if (response.success) {
          this.toastService.success(response.message);
          this.router.navigate(['/bandeja-compras']);
        } else {
          this.toastService.error(response.message);
        }
      } catch (error: any) {
        this.Loading = false;
        this.toastService.clear();
        this.toastService.error(error.message ?? 'Ocurrió un error al registrar la compra.');
      }
    });
  }

  Navegar(site: string) {
    this.router.navigate([site]);
  }

}
