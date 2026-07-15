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
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-compras-dia',
  templateUrl: './compras-dia.component.html',
  styleUrls: ['./compras-dia.component.scss'],
})
export class ComprasDiaComponent implements OnChanges {
  @Input() Datos: any[] = [];

  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Compras',
          data: [],
        },
      ],

      chart: {
        type: 'area',
        height: 320,
        toolbar: {
          show: false,
        },
      },

      stroke: {
        curve: 'smooth',
      },

      xaxis: {
        categories: [],
      },

      tooltip: {
        enabled: true,
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Datos'] && this.Datos) {
      this.generarGrafico();
    }
  }

  generarGrafico() {
    if (!this.Datos || this.Datos.length === 0) {
      return;
    }

    const fechas = this.Datos.map((item) => item.date ?? '');

    const valores = this.Datos.map((item) => Number(item.total_amount ?? 0));

    this.chartOptions = {
      series: [
        {
          name: 'Compras',
          data: valores,
        },
      ],

      chart: {
        type: 'area',
        height: 320,
        toolbar: {
          show: false,
        },
      },

      xaxis: {
        categories: fechas,
      },

      stroke: {
        curve: 'smooth',
      },

      tooltip: {
        enabled: true,
      },
    };
  }
}
