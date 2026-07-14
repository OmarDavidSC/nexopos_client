import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tipos-voucher',
  templateUrl: './tipos-voucher.component.html',
  styleUrls: ['./tipos-voucher.component.scss'],
})
export class TiposVoucherComponent implements OnChanges {
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
        type: 'pie',
        height: 330,
      },

      labels: this.Datos.map((x) => this.getVoucherName(x.voucher_type)),

      legend: {
        position: 'bottom',
      },

      dataLabels: {
        enabled: true,
      },

      tooltip: {
        y: {
          formatter: (value: number) => `S/. ${value.toFixed(2)}`,
        },
      },
    };
  }

  getVoucherName(voucher: string): string {
    switch (voucher) {
      case 'FACTURA':
        return 'Factura';

      case 'BOLETA':
        return 'Boleta';

      case 'NOTA_VENTA':
        return 'Nota Venta';

      case 'TICKET':
        return 'Ticket';

      default:
        return voucher;
    }
  }
}
