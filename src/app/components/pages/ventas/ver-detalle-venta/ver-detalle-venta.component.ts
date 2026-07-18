import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SaleService } from 'src/app/shared/services/sale.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-ver-detalle-venta',
  templateUrl: './ver-detalle-venta.component.html',
  styleUrls: ['./ver-detalle-venta.component.scss']
})
export class VerDetalleVentaComponent extends FormularioBase implements OnInit {

  DetalleVenta: any[] = [];
  Venta: any;
  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;
  IdVenta: number = 0;

  Loading: boolean = false;
  ConsultandoSunat: boolean = false;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public ventaService: SaleService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
  ) {
    super('detalle-venta', dialog, route, router, spinner)
  }

  ngOnInit(): void {
    Promise.all([
      this.auhtStore.getUser(),
      this.auhtStore.getRole(),
      this.auhtStore.getCompany(),
    ]
    ).then(([resultadoUsuario, resultadoRole, resultadoCompania]) => {
      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompania;
      this.CompaniaActual = resultadoCompania;
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
    this.IdVenta = Number(this.route.snapshot.paramMap.get('id'));
    this.obtenerMaestros();
  }

  // async obtenerMaestros() {
  //   this.Loading = true;
  //   const data = await this.ventaService.show(this.IdVenta)
  //   this.DetalleVenta = data.data.details;
  //   this.Venta = data.data.sale;
  //   this.Loading = false;
  // }

  async obtenerMaestros(): Promise<void> {
    this.Loading = true;
    this.ConsultandoSunat = true;

    try {
      const response = await this.ventaService.show(this.IdVenta);
      if (!response.success) {
        this.toastService.error(response.message || 'No se pudo obtener el detalle de la venta.');
        this.router.navigate(['/bandeja-ventas']);
        return;
      }
      this.DetalleVenta = response.data.details ?? [];
      this.Venta = response.data.sale;

      if (this.Venta?.sunat_document_id) {
        this.mostrarMensajeEstadoSunat();
      }
    } catch (error: any) {
      this.toastService.error(error?.error?.message || error?.message || 'Ocurrió un error al consultar la venta.');
    } finally {
      this.ConsultandoSunat = false;
      this.Loading = false;
    }
  }

  abrirPdf(url: string | null): void {
    if (!url) {
      this.toastService.warning('Este formato no esta disponible.');
      return;
    }

    window.open(url, '_blank', 'noopener, noreferrer');
  }

  imprimirPdf(url: string | null): void {
    if (!url) {
      this.toastService.warning('Este formato no esta disponible.');
      return;
    }

    const ventana = window.open(url, '_blank');

    if (!ventana) {
      this.toastService.warning('El navegador bloqueo la venta de impresión');
      return;
    }

    ventana.focus();
  }

  compartirWhatsApp(url: string | null): void {
    if (!url) {
      this.toastService.warning('No existe un comprobante disponible para compartir');
      return;
    }

    const comprobante = `${this.Venta?.voucher_series ?? ''}-${this.Venta?.voucher_number ?? ''}`;
    const total = Number(this.Venta?.total ?? 0).toFixed(2);

    const mensaje = [
      'Hola, gracias por su compra.',
      '',
      `Comprobante: ${comprobante}`,
      `Cliente: ${this.Venta?.customer ?? 'Cliente'}`,
      `Total: ${this.CompaniaActual?.SimboloMoneda ?? 'S/'} ${total}`,
      '',
      'Puede visualizar o descargar su comprobante en el siguiente enlace:',
      url
    ].join('\n');

    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener,noreferrer');
  }

  tieneComprobantesPdf(): boolean {
    return !!(this.Venta?.pdf_58mm || this.Venta?.pdf_80mm || this.Venta?.pdf_a5 || this.Venta?.pdf_a4);
  }

  obtenerEstadoVenta(): string {
    switch (this.Venta?.status) {
      case 'COMPLETED': return 'Completada';
      case 'CANCELLED': return 'Anulada';
      default: return 'Pendiente';
    }
  }

  obtenerIconoVenta(): string {
    switch (this.Venta?.status) {
      case 'COMPLETED': return 'check_circle';
      case 'CANCELLED': return 'cancel';
      default: return 'schedule';
    }
  }

  obtenerDescripcionSunat(): string {
    switch (this.Venta?.sunat_status) {
      case 'ACEPTADO': return 'El comprobante fue aceptado correctamente por SUNAT.';
      case 'PENDIENTE': return 'El comprobante fue emitido y su validación continúa en proceso.';
      case 'RECHAZADO': return 'SUNAT rechazó el comprobante. Se requiere revisar la información.';
      case 'ERROR': return 'La venta fue registrada, pero ocurrió un problema durante la emisión.';
      default: return 'Esta venta no cuenta con un comprobante electrónico enviado a SUNAT.';
    }
  }

  mostrarMensajeEstadoSunat(): void {
    switch (this.Venta?.sunat_status) {
      case 'ACEPTADO':
        this.toastService.success('El comprobante fue aceptado correctamente por SUNAT.', 'Estado SUNAT');
        break;
      case 'PENDIENTE':
        this.toastService.info('El comprobante continúa pendiente de validación.', 'Estado SUNAT');
        break;
      case 'RECHAZADO':
        this.toastService.warning('El comprobante fue rechazado por SUNAT.', 'Estado SUNAT');
        break;
      case 'ERROR':
        this.toastService.error('El comprobante presenta un error de emisión.', 'Estado SUNAT');
        break;
    }
  }
}
