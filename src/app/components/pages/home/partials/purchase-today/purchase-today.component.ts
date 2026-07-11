import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-today',
  templateUrl: './purchase-today.component.html',
  styleUrls: ['./purchase-today.component.scss']
})
export class PurchaseTodayComponent {

  @Input() data: any = null;
  @Input() moneda: string;

  get totalCompras(): number {
    return this.data?.total_purchases || 0;
  }

  get montoTotal(): number {
    return Number(this.data?.total_amount || 0);
  }
}
