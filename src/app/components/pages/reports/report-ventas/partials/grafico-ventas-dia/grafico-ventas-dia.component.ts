import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-grafico-ventas-dia',
  templateUrl: './grafico-ventas-dia.component.html',
  styleUrls: ['./grafico-ventas-dia.component.scss'],
})
export class GraficoVentasDiaComponent implements OnChanges {
  @Input() Datos: any[] = [];

  chartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Datos']) {
      this.loadChart();
    }
  }

  loadChart() {
    this.chartOptions = {
      series: [
        {
          name: 'Ventas',
          data: this.Datos.map((x) => Number(x.total_amount)),
        },
      ],

      chart: {
        type: 'area',
        height: 330,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },

      stroke: {
        curve: 'smooth',
        width: 3,
      },

      dataLabels: {
        enabled: false,
      },

      xaxis: {
        categories: this.Datos.map((x) => x.date),
      },

      yaxis: {
        labels: {
          formatter: (value: number) => `S/. ${value}`,
        },
      },

      tooltip: {
        y: {
          formatter: (value: number) => `S/. ${value}`,
        },
      },
    };
  }
}
