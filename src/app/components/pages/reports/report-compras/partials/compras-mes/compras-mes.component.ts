import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
  selector: 'app-compras-mes',
  templateUrl: './compras-mes.component.html',
  styleUrls: ['./compras-mes.component.scss'],
})
export class ComprasMesComponent implements OnChanges {
  @Input() Datos: any[] = [];

  public chartOptions: Partial<ChartOptions> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Datos']) {
      if (this.Datos && this.Datos.length) {
        this.generarGrafico();
      }
    }
  }

  generarGrafico() {
    const meses = this.Datos.map((item) => item.month ?? '');

    const valores = this.Datos.map((item) => Number(item.total_amount ?? 0));

    this.chartOptions = {
      series: [
        {
          name: 'Compras',

          data: valores,
        },
      ],

      chart: {
        type: 'bar',

        height: 320,

        toolbar: {
          show: false,
        },
      },

      xaxis: {
        categories: meses,
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
