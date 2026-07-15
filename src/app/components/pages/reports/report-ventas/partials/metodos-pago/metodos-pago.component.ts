import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.component.html',
  styleUrls: ['./metodos-pago.component.scss'],
})
export class MetodosPagoComponent implements OnChanges {
  @Input() Datos: any[] = [];

  chartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Datos']) {
      this.loadChart();
    }
  }

  loadChart() {
    this.chartOptions = {
      series: this.Datos.map((x) => Number(x.total_amount)),

      chart: {
        type: 'donut',
        height: 330,
      },

      labels: this.Datos.map((x) => this.getNombreMetodo(x.payment_method)),

      legend: {
        position: 'bottom',
      },

      dataLabels: {
        enabled: true,
      },

      tooltip: {
        y: {
          formatter: (value: number) => `S/. ${value}`,
        },
      },
    };
  }

  getNombreMetodo(metodo: string): string {
    switch (metodo) {
      case 'CASH':
        return 'Efectivo';

      case 'TRANSFER':
        return 'Transferencia';

      case 'CARD':
        return 'Tarjeta';

      case 'YAPE':
        return 'Yape';

      case 'PLIN':
        return 'Plin';

      default:
        return metodo;
    }
  }
}
