import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexTooltip,
  ApexYAxis,
  ApexFill,
  ApexGrid,
  ApexDataLabels,
  ApexMarkers,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  fill: ApexFill;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
};

@Component({
  selector: 'app-compras-dia',
  templateUrl: './compras-dia.component.html',
  styleUrls: ['./compras-dia.component.scss'],
})
export class ComprasDiaComponent implements OnChanges {
  @Input() Datos: any[] = [];

  public chartOptions: Partial<ChartOptions> | null = null;

  totalComprado: number = 0;
  promedioDiario: number = 0;
  mejorDiaMonto: number = 0;
  mejorDiaFecha: string = '-';

  get totalDias(): number {
    return Array.isArray(this.Datos) ? this.Datos.length : 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Datos']) {
      this.procesarIndicadores();
      this.generarGrafico();
    }
  }

  private procesarIndicadores(): void {
    const datos = Array.isArray(this.Datos) ? this.Datos : [];

    this.totalComprado = datos.reduce(
      (total: number, item: any) => total + Number(item?.total_amount || 0),
      0,
    );

    this.promedioDiario =
      datos.length > 0 ? this.totalComprado / datos.length : 0;

    const mejorDia = datos.reduce((mejor: any, item: any) => {
      const montoActual = Number(item?.total_amount || 0);

      const mejorMonto = Number(mejor?.total_amount || 0);

      return montoActual > mejorMonto ? item : mejor;
    }, null);

    this.mejorDiaMonto = Number(mejorDia?.total_amount || 0);

    this.mejorDiaFecha = mejorDia?.date
      ? this.formatearFecha(mejorDia.date)
      : '-';
  }

  private generarGrafico(): void {
    const datos = Array.isArray(this.Datos) ? this.Datos : [];

    if (datos.length === 0) {
      this.chartOptions = null;
      return;
    }

    this.chartOptions = {
      series: [
        {
          name: 'Compras',
          data: datos.map((item: any) => Number(item?.total_amount || 0)),
        },
      ],

      chart: {
        type: 'area',
        height: 285,
        fontFamily: 'inherit',
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 700,
        },
      },

      colors: ['#059669'],

      stroke: {
        curve: 'smooth',
        width: 3,
        lineCap: 'round',
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.33,
          opacityTo: 0.03,
          stops: [0, 90, 100],
        },
      },

      dataLabels: {
        enabled: false,
      },

      markers: {
        size: 0,
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },

      grid: {
        show: true,
        borderColor: '#eef2f7',
        strokeDashArray: 4,
        padding: {
          top: 5,
          right: 12,
          bottom: 0,
          left: 8,
        },
      },

      xaxis: {
        categories: datos.map((item: any) =>
          this.formatearFechaCorta(item?.date),
        ),

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          rotate: 0,
          trim: true,
          style: {
            fontSize: '10px',
            colors: '#94a3b8',
          },
        },

        tooltip: {
          enabled: false,
        },
      },

      yaxis: {
        min: 0,

        labels: {
          formatter: (value: number) => this.formatearMontoCorto(value),

          style: {
            fontSize: '10px',
            colors: ['#94a3b8'],
          },
        },
      },

      tooltip: {
        theme: 'light',

        x: {
          formatter: (_value: number, options: any) => {
            const item = datos[options?.dataPointIndex];

            return item?.date ? this.formatearFecha(item.date) : '';
          },
        },

        y: {
          formatter: (value: number) => `S/ ${this.formatearNumero(value)}`,
        },

        marker: {
          show: true,
        },
      },
    };
  }

  private formatearNumero(value: number): string {
    return Number(value || 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private formatearMontoCorto(value: number): string {
    const amount = Number(value || 0);

    if (amount >= 1_000_000) {
      return `S/ ${(amount / 1_000_000).toFixed(1)}M`;
    }

    if (amount >= 1_000) {
      return `S/ ${(amount / 1_000).toFixed(1)}K`;
    }

    return `S/ ${amount.toFixed(0)}`;
  }

  private formatearFechaCorta(value: string | Date): string {
    const fecha = this.convertirFecha(value);

    if (!fecha) {
      return String(value || '');
    }

    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
    });
  }

  private formatearFecha(value: string | Date): string {
    const fecha = this.convertirFecha(value);

    if (!fecha) {
      return String(value || '-');
    }

    return fecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private convertirFecha(value: string | Date): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    const partes = String(value).split('-').map(Number);

    if (
      partes.length === 3 &&
      partes.every((item: number) => !Number.isNaN(item))
    ) {
      return new Date(partes[0], partes[1] - 1, partes[2]);
    }

    const fecha = new Date(value);

    return Number.isNaN(fecha.getTime()) ? null : fecha;
  }
}
