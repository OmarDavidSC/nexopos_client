import { Component, Input, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexStroke, ApexTooltip, ApexXAxis } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss']
})
export class SalesChartComponent {

  @Input() data: any[] = [];
  @Input() moneda: string;

  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Ventas',
          data: []
        },
        {
          name: 'Monto',
          data: []
        }
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        }
      },
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      xaxis: { categories: [] },
      tooltip: { shared: true }
    };
  }

  ngOnChanges() {
    if (this.data?.length) {
      this.loadChart();
    }
  }

  loadChart() {
    const fechas = this.data.map(item => item.date);
    const ventas = this.data.map(item => Number(item.sales));
    const montos = this.data.map(item => Number(item.amount));
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        { name: 'Ventas', data: ventas },
        { name: `Monto ${this.moneda}`, data: montos }
      ],
      xaxis: { categories: fechas }
    };
  }
}
