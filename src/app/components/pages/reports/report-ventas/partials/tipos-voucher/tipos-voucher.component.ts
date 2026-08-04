import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

interface VoucherProcesado {
  voucher_type: string;
  nombre: string;
  total_amount: number;
  total_sales: number;
  porcentaje: number;
}

@Component({
  selector: 'app-tipos-voucher',
  templateUrl: './tipos-voucher.component.html',
  styleUrls: ['./tipos-voucher.component.scss'],
})
export class TiposVoucherComponent implements OnChanges {
  @Input() Datos: any[] = [];

  chartOptions: any = null;

  vouchersProcesados: VoucherProcesado[] = [];

  totalFacturado: number = 0;
  comprobantePrincipal: string = '-';
  montoComprobantePrincipal: number = 0;
  porcentajePrincipal: number = 0;

  get totalTipos(): number {
    return this.vouchersProcesados.length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Datos']) {
      this.procesarDatos();
      this.loadChart();
    }
  }

  private procesarDatos(): void {
    const datos = Array.isArray(this.Datos) ? this.Datos : [];

    this.totalFacturado = datos.reduce(
      (total: number, item: any) => total + Number(item?.total_amount || 0),
      0,
    );

    this.vouchersProcesados = datos
      .map((item: any) => {
        const totalAmount = Number(item?.total_amount || 0);

        const porcentaje =
          this.totalFacturado > 0
            ? (totalAmount / this.totalFacturado) * 100
            : 0;

        return {
          voucher_type: String(item?.voucher_type || 'OTHER').toUpperCase(),

          nombre: this.getVoucherName(item?.voucher_type),

          total_amount: totalAmount,

          total_sales: Number(
            item?.total_sales ?? item?.sales_count ?? item?.quantity ?? 0,
          ),

          porcentaje,
        };
      })
      .sort(
        (primero: VoucherProcesado, segundo: VoucherProcesado) =>
          segundo.total_amount - primero.total_amount,
      );

    const principal = this.vouchersProcesados[0];

    this.comprobantePrincipal = principal?.nombre || '-';

    this.montoComprobantePrincipal = principal?.total_amount || 0;

    this.porcentajePrincipal = principal?.porcentaje || 0;
  }

  private loadChart(): void {
    if (this.vouchersProcesados.length === 0) {
      this.chartOptions = null;
      return;
    }

    this.chartOptions = {
      series: this.vouchersProcesados.map((item: VoucherProcesado) =>
        Number(item.porcentaje.toFixed(2)),
      ),

      chart: {
        type: 'radialBar',
        height: 285,
        fontFamily: 'inherit',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 700,
        },
      },

      colors: this.vouchersProcesados.map((item: VoucherProcesado) =>
        this.getVoucherColor(item.voucher_type),
      ),

      labels: this.vouchersProcesados.map(
        (item: VoucherProcesado) => item.nombre,
      ),

      plotOptions: {
        radialBar: {
          inverseOrder: false,

          startAngle: 0,

          endAngle: 360,

          hollow: {
            margin: 8,
            size: '34%',
            background: '#ffffff',
          },

          track: {
            background: '#f1f5f9',
            strokeWidth: '100%',
            margin: 5,
          },

          dataLabels: {
            show: false,
          },
        },
      },

      stroke: {
        lineCap: 'round',
      },

      dataLabels: {
        enabled: false,
      },

      legend: {
        show: false,
      },

      tooltip: {
        enabled: true,

        custom: ({ seriesIndex }: { seriesIndex: number }) => {
          const item = this.vouchersProcesados[seriesIndex];

          if (!item) {
            return '';
          }

          return `
            <div style="padding:10px 12px">
              <div style="
                color:#334155;
                font-size:11px;
                font-weight:700;
                margin-bottom:5px;
              ">
                ${item.nombre}
              </div>

              <div style="
                color:#64748b;
                font-size:10px;
                margin-bottom:2px;
              ">
                Participación:
                <strong>
                  ${item.porcentaje.toFixed(1)}%
                </strong>
              </div>

              <div style="
                color:#64748b;
                font-size:10px;
                margin-bottom:2px;
              ">
                Ventas:
                <strong>
                  ${item.total_sales}
                </strong>
              </div>

              <div style="
                color:#059669;
                font-size:11px;
                font-weight:700;
              ">
                S/ ${this.formatearNumero(item.total_amount)}
              </div>
            </div>
          `;
        },
      },
    };
  }

  getVoucherName(voucher: string | null | undefined): string {
    const codigo = String(voucher || 'OTHER').toUpperCase();

    const nombres: Record<string, string> = {
      FACTURA: 'Factura',
      BOLETA: 'Boleta',
      NOTA_VENTA: 'Nota de venta',
      NOTA: 'Nota de venta',
      TICKET: 'Ticket',
      OTHER: 'Otro',
    };

    return nombres[codigo] || codigo;
  }

  getVoucherIcon(voucher: string | null | undefined): string {
    const codigo = String(voucher || 'OTHER').toUpperCase();

    const iconos: Record<string, string> = {
      FACTURA: 'request_quote',
      BOLETA: 'receipt_long',
      NOTA_VENTA: 'description',
      NOTA: 'description',
      TICKET: 'confirmation_number',
      OTHER: 'insert_drive_file',
    };

    return iconos[codigo] || 'description';
  }

  getVoucherClass(voucher: string | null | undefined): string {
    const codigo = String(voucher || 'OTHER').toUpperCase();

    const clases: Record<string, string> = {
      FACTURA: 'voucher-factura',
      BOLETA: 'voucher-boleta',
      NOTA_VENTA: 'voucher-nota',
      NOTA: 'voucher-nota',
      TICKET: 'voucher-ticket',
      OTHER: 'voucher-other',
    };

    return clases[codigo] || 'voucher-other';
  }

  private getVoucherColor(voucher: string | null | undefined): string {
    const codigo = String(voucher || 'OTHER').toUpperCase();

    const colores: Record<string, string> = {
      FACTURA: '#3b82f6',
      BOLETA: '#10b981',
      NOTA_VENTA: '#f59e0b',
      NOTA: '#f59e0b',
      TICKET: '#8b5cf6',
      OTHER: '#94a3b8',
    };

    return colores[codigo] || '#94a3b8';
  }

  private formatearNumero(value: number): string {
    return Number(value || 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
