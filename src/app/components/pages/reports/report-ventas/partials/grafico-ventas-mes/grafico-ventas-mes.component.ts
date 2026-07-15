import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-grafico-ventas-mes',
  templateUrl: './grafico-ventas-mes.component.html',
  styleUrls: ['./grafico-ventas-mes.component.scss'],
})
export class GraficoVentasMesComponent implements OnChanges {
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
        type: 'bar',
        height: 330,
        toolbar: {
          show: false,
        },
      },

      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '45%',
        },
      },

      dataLabels: {
        enabled: false,
      },

      xaxis: {
        categories: this.Datos.map(
          (x) => this.getMonthName(x.month) + ' ' + x.year,
        ),
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
    return meses[month - 1];
  }
}
