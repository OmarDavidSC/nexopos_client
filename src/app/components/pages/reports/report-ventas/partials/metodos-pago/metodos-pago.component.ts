import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

interface MetodoPagoProcesado {
  payment_method: string;
  nombre: string;
  total_amount: number;
  porcentaje: number;
}

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.component.html',
  styleUrls: ['./metodos-pago.component.scss'],
})
export class MetodosPagoComponent implements OnChanges {
  @Input() Datos: any[] = [];

  chartOptions: any = null;

  metodosProcesados: MetodoPagoProcesado[] = [];

  totalRecaudado: number = 0;
  metodoPrincipal: string = '-';
  montoMetodoPrincipal: number = 0;
  porcentajePrincipal: number = 0;

  get totalMetodos(): number {
    return this.metodosProcesados.length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Datos']) {
      this.procesarDatos();
      this.loadChart();
    }
  }

  private procesarDatos(): void {
    const datos = Array.isArray(this.Datos) ? this.Datos : [];

    this.totalRecaudado = datos.reduce(
      (total: number, item: any) => total + Number(item?.total_amount || 0),
      0,
    );

    this.metodosProcesados = datos
      .map((item: any) => {
        const totalAmount = Number(item?.total_amount || 0);

        const porcentaje =
          this.totalRecaudado > 0
            ? (totalAmount / this.totalRecaudado) * 100
            : 0;

        return {
          payment_method: String(item?.payment_method || 'OTHER').toUpperCase(),

          nombre: this.getNombreMetodo(item?.payment_method),

          total_amount: totalAmount,

          porcentaje,
        };
      })
      .sort(
        (primero: MetodoPagoProcesado, segundo: MetodoPagoProcesado) =>
          segundo.total_amount - primero.total_amount,
      );

    const principal = this.metodosProcesados[0];

    this.metodoPrincipal = principal?.nombre || '-';
    this.montoMetodoPrincipal = principal?.total_amount || 0;
    this.porcentajePrincipal = principal?.porcentaje || 0;
  }

  private loadChart(): void {
    if (this.metodosProcesados.length === 0) {
      this.chartOptions = null;
      return;
    }

    this.chartOptions = {
      series: [
        {
          name: 'Total recibido',
          data: this.metodosProcesados.map(
            (item: MetodoPagoProcesado) => item.total_amount,
          ),
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

      colors: [
        '#10b981',
        '#3b82f6',
        '#8b5cf6',
        '#a855f7',
        '#06b6d4',
        '#94a3b8',
      ],

      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          borderRadius: 6,
          borderRadiusApplication: 'end',
          barHeight: '52%',
        },
      },

      dataLabels: {
        enabled: true,
        formatter: (value: number) => this.formatearMontoCorto(value),

        style: {
          fontSize: '9px',
          fontWeight: 700,
          colors: ['#ffffff'],
        },

        dropShadow: {
          enabled: false,
        },
      },

      grid: {
        show: true,
        borderColor: '#eef2f7',
        strokeDashArray: 4,
        padding: {
          top: 4,
          right: 18,
          bottom: 0,
          left: 5,
        },
      },

      xaxis: {
        categories: this.metodosProcesados.map(
          (item: MetodoPagoProcesado) => item.nombre,
        ),

        labels: {
          formatter: (value: string) =>
            this.formatearMontoCorto(Number(value || 0)),

          style: {
            fontSize: '9px',
            colors: '#94a3b8',
          },
        },

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
      },

      yaxis: {
        labels: {
          style: {
            fontSize: '10px',
            fontWeight: 600,
            colors: ['#475569'],
          },

          maxWidth: 105,
        },
      },

      tooltip: {
        theme: 'light',

        y: {
          formatter: (value: number) => `S/ ${this.formatearNumero(value)}`,
        },

        marker: {
          show: true,
        },
      },
    };
  }

  getNombreMetodo(metodo: string | null | undefined): string {
    const codigo = String(metodo || 'OTHER').toUpperCase();
    const nombres: Record<string, string> = {
      CASH: 'Efectivo',
      TRANSFER: 'Transferencia',
      CARD: 'Tarjeta',
      YAPE: 'Yape',
      PLIN: 'Plin',
      OTHER: 'Otro',
    };
    return nombres[codigo] || codigo;
  }

  getMetodoIcono(metodo: string | null | undefined): string {
    const codigo = String(metodo || 'OTHER').toUpperCase();
    const iconos: Record<string, string> = {
      CASH: 'payments',
      CARD: 'credit_card',
      TRANSFER: 'account_balance',
      YAPE: 'phone_android',
      PLIN: 'smartphone',
      OTHER: 'more_horiz',
    };
    return iconos[codigo] || 'payments';
  }

  getMetodoClase(metodo: string | null | undefined): string {
    const codigo = String(metodo || 'OTHER').toUpperCase();

    const clases: Record<string, string> = {
      CASH: 'method-cash',
      CARD: 'method-card',
      TRANSFER: 'method-transfer',
      YAPE: 'method-yape',
      PLIN: 'method-plin',
      OTHER: 'method-other',
    };
    return clases[codigo] || 'method-other';
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
