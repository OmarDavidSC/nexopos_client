import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-grafico-ventas-mes',
  templateUrl: './grafico-ventas-mes.component.html',
  styleUrls: ['./grafico-ventas-mes.component.scss'],
})
export class GraficoVentasMesComponent implements OnChanges {
  @Input() Datos: any[] = [];

  chartOptions: any = null;
  totalVendido: number = 0;
  promedioMensual: number = 0;
  mejorMesMonto: number = 0;
  mejorMesNombre: string = '-';

  get totalMeses(): number {
    return Array.isArray(this.Datos) ? this.Datos.length : 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Datos']) {
      this.procesarIndicadores();
      this.loadChart();
    }
  }

  private procesarIndicadores(): void {
    const datos = Array.isArray(this.Datos) ? this.Datos : [];
    this.totalVendido = datos.reduce((total: number, item: any) => total + Number(item?.total_amount || 0), 0,);
    this.promedioMensual = datos.length > 0 ? this.totalVendido / datos.length : 0;
    const mejorMes = datos.reduce((mejor: any, item: any) => {
      const montoActual = Number(item?.total_amount || 0);
      const mejorMonto = Number(mejor?.total_amount || 0);
      return montoActual > mejorMonto ? item : mejor;
    }, null);
    this.mejorMesMonto = Number(mejorMes?.total_amount || 0);
    this.mejorMesNombre = mejorMes ? `${this.getMonthName(Number(mejorMes.month))} ${mejorMes.year}` : '-';
  }

  private loadChart(): void {
    const datos = Array.isArray(this.Datos) ? this.Datos : [];

    if (datos.length === 0) {
      this.chartOptions = null;
      return;
    }

    this.chartOptions = {
      series: [
        {
          name: 'Ventas',
          data: datos.map((item: any) => Number(item?.total_amount || 0)),
        },
      ],

      chart: {
        type: 'bar',
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

      colors: ['#7c3aed'],

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.2,
          opacityFrom: 1,
          opacityTo: 0.78,
          stops: [0, 100],
        },
      },

      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 7,
          borderRadiusApplication: 'end',
          columnWidth: '48%',
          distributed: false,
        },
      },

      dataLabels: {
        enabled: false,
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
        categories: datos.map(
          (item: any) =>
            `${this.getMonthName(Number(item?.month))} ${item?.year}`,
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

            if (!item) {
              return '';
            }

            return `${this.getMonthNameCompleto(
              Number(item.month),
            )} ${item.year}`;
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

  getMonthName(month: number): string {
    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    return meses[month - 1] || '-';
  }

  private getMonthNameCompleto(month: number): string {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return meses[month - 1] || '-';
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
}
