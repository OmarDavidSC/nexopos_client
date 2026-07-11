import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerts-stock',
  templateUrl: './alerts-stock.component.html',
  styleUrls: ['./alerts-stock.component.scss']
})
export class AlertsStockComponent {

  @Input() data: any[] = [];

  get totalAlertas(): number {
    return this.data?.length || 0;
  }

  get agotados(): number {
    return this.data?.filter(x => Number(x.current_stock) <= 0).length || 0;
  }

  get bajoStock(): number {
    return this.data?.filter(x =>
      Number(x.current_stock) > 0 &&
      Number(x.current_stock) <= Number(x.minimum_stock)
    ).length || 0;
  }

}
