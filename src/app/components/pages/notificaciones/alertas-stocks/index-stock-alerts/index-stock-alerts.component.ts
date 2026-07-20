import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LowStockFilter, LowStockItem } from 'src/app/shared/models/base/LowStockFilter';
import { ECompany } from 'src/app/shared/models/entidades/ECompany';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';
import { Eusuario } from 'src/app/shared/models/entidades/Eusuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BranchService } from 'src/app/shared/services/branch.service';
import { ReportInventoryService } from 'src/app/shared/services/reportinventory.service';
import { AuthStoreService } from 'src/app/shared/stores/auth-store.service';

@Component({
  selector: 'app-index-stock-alerts',
  templateUrl: './index-stock-alerts.component.html',
  styleUrls: ['./index-stock-alerts.component.scss']
})
export class IndexStockAlertsComponent extends FormularioBase implements OnInit {

  UsuarioActual: Eusuario | null = null;
  CompaniaActual: ECompany | null = null;
  Role: ERol | null = null;
  Loading: boolean = false;

  ListaSucursales: ESucursal[] = [];
  ListaAlertas: LowStockItem[] = [];

  Filtro: LowStockFilter = {
    search: null,
    status: null,
    branch_id: null
  };

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public authService: AuthService,
    public reporteService: ReportInventoryService,
    public auhtStore: AuthStoreService,
    public toastService: ToastrService,
    public sucursalService: BranchService,
    @Optional() public dialogRef: MatDialogRef<IndexStockAlertsComponent>
  ) {
    super('index-stocks-alertas', dialog, route, router, spinner);
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  async cargarDatosIniciales(): Promise<void> {
    try {
      this.Loading = true;

      const [resultadoUsuario, resultadoRole, resultadoCompania, resultadoSucursal] = await Promise.all([
        this.auhtStore.getUser(),
        this.auhtStore.getRole(),
        this.auhtStore.getCompany(),
        this.sucursalService.adm()
      ]);

      this.UsuarioActual = resultadoUsuario;
      this.Role = resultadoRole;
      this.CompaniaActual = resultadoCompania;
      this.ListaSucursales = resultadoSucursal ?? [];

      // const tienePermiso = this.validarPermisos(
      //   this.Role,
      //   ['administrator'],
      //   this.router,
      //   this.toastService
      // );

      // if (tienePermiso) {
      //   await this.obtenerAlertas();
      // }
      await this.obtenerAlertas();
    } catch (error) {
      this.ListaAlertas = [];
      this.toastService.error('No se pudieron cargar las alertas de inventario.');
    } finally {
      this.Loading = false;
    }
  }

  async obtenerAlertas(): Promise<void> {
    try {
      this.Loading = true;
      this.ListaAlertas = await this.reporteService.low(this.Filtro);
    } catch (error) {
      this.ListaAlertas = [];
    } finally {
      this.Loading = false;
    }
  }

  async aplicarFiltros(): Promise<void> {
    await this.obtenerAlertas();
  }

  async limpiarFiltros(): Promise<void> {
    this.Filtro = {
      search: null,
      status: null,
      branch_id: null
    };

    await this.obtenerAlertas();
  }

  cerrar(): void {
    this.dialogRef?.close();
  }

  get totalAlertas(): number {
    return this.ListaAlertas.length;
  }

  get totalSinStock(): number {
    return this.ListaAlertas.filter(item => Number(item.current_stock) <= 0).length;
  }

  get totalCriticos(): number {
    return this.ListaAlertas.filter(item => Number(item.current_stock) > 0 && Number(item.current_stock) <= Number(item.minimum_stock)).length;
  }

  getEstado(item: LowStockItem): string {
    return Number(item.current_stock) <= 0 ? 'Sin stock' : 'Stock crítico';
  }

  getEstadoIcono(item: LowStockItem): string {
    return Number(item.current_stock) <= 0 ? 'error_outline' : 'warning_amber';
  }

  getEstadoClase(item: LowStockItem): string {
    return Number(item.current_stock) <= 0 ? 'stock-status stock-status-danger' : 'stock-status stock-status-warning';
  }

  getFaltante(item: LowStockItem): number {
    return Math.max(Number(item.minimum_stock) - Number(item.current_stock), 0);
  }

  trackById(index: number, item: LowStockItem): number {
    return item.id;
  }

  enviarAlertasWhatsApp(): void {
    if (this.Loading) {
      return;
    }

    if (this.ListaAlertas.length === 0) {
      this.toastService.warning('No existen alertas de stock para enviar.');
      return;
    }

    const telefono = this.obtenerTelefonoWhatsApp();

    if (!telefono) {
      this.toastService.warning('La compañía no tiene un número de WhatsApp configurado.');
      return;
    }

    const mensaje = this.construirMensajeWhatsApp();
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private obtenerTelefonoWhatsApp(): string | null {
    // const numeroRegistrado = this.CompaniaActual?.WhatsApp || this.CompaniaActual?.Telefono || '';
    const numeroRegistrado = '51927350176';

    if (!numeroRegistrado) {
      return null;
    }

    let telefono = numeroRegistrado.replace(/\D/g, '');

    if (telefono.length === 9) {
      telefono = `51${telefono}`;
    }

    if (telefono.length < 11) {
      return null;
    }

    return telefono;
  }

  private construirMensajeWhatsApp(): string {
    const nombreEmpresa = this.CompaniaActual?.Nombre || 'Mi empresa';
    const fecha = new Date().toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const alertasPorSucursal = this.agruparAlertasPorSucursal();

    const lineas: string[] = [
      '*ALERTA DE STOCK BAJO*',
      '',
      `Empresa: ${nombreEmpresa}`,
      `Fecha: ${fecha}`,
      `Productos con alerta: ${this.ListaAlertas.length}`,
      ''
    ];

    Object.keys(alertasPorSucursal).forEach(nombreSucursal => {
      lineas.push(`*Sucursal: ${nombreSucursal}*`);

      alertasPorSucursal[nombreSucursal].forEach(item => {
        const stockActual = Number(item.current_stock);
        const stockMinimo = Number(item.minimum_stock);
        const faltante = Math.max(stockMinimo - stockActual, 0);
        const estado = stockActual <= 0 ? 'SIN STOCK' : 'STOCK CRÍTICO';

        lineas.push(
          `- ${item.product.name}`,
          `  Código: ${item.product.code || 'Sin código'}`,
          `  Estado: ${estado}`,
          `  Actual: ${this.formatearCantidad(stockActual)}`,
          `  Mínimo: ${this.formatearCantidad(stockMinimo)}`,
          `  Faltan: ${this.formatearCantidad(faltante)}`,
          ''
        );
      });
    });

    lineas.push('Por favor, revisar y reponer el inventario.');

    return lineas.join('\n');
  }

  private agruparAlertasPorSucursal(): { [sucursal: string]: LowStockItem[] } {
    return this.ListaAlertas.reduce(
      (resultado: { [sucursal: string]: LowStockItem[] }, item: LowStockItem) => {
        const nombreSucursal = item.branch?.name || 'Sucursal no especificada';

        if (!resultado[nombreSucursal]) {
          resultado[nombreSucursal] = [];
        }

        resultado[nombreSucursal].push(item);
        return resultado;
      },
      {}
    );
  }

  private formatearCantidad(cantidad: number): string {
    return cantidad.toLocaleString('es-PE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
}
