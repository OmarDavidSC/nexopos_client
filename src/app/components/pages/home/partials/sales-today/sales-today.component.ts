import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-today',
  templateUrl: './sales-today.component.html',
  styleUrls: ['./sales-today.component.scss']
})
export class SalesTodayComponent {

  @Input() data: any = null;
  @Input() moneda: string;

  get totalVentas(): number {
    return this.data?.total_sales || 0;
  }

  get montoTotal(): number {
    return Number(this.data?.total_amount || 0);
  }

}
