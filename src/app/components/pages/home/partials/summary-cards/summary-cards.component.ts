import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-cards',
  templateUrl: './summary-cards.component.html',
  styleUrls: ['./summary-cards.component.scss']
})
export class SummaryCardsComponent implements OnInit {

  @Input() data: any;
  Cards: any[] = [];
  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges() {

    this.Cards = [
      {
        title: 'Productos',
        value: this.data?.total_products ?? 0,
        icon: 'inventory_2',
        type: 'products'
      },
      {
        title: 'Ventas del mes',
        value: `S/ ${this.data?.sales_month ?? '0.00'}`,
        icon: 'shopping_cart',
        type: 'sales'
      },
      {
        title: 'Compras del mes',
        value: `S/ ${this.data?.purchases_month ?? '0.00'}`,
        icon: 'local_shipping',
        type: 'purchases'
      },
      {
        title: 'Valor inventario',
        value: `S/ ${this.data?.inventory_value ?? '0.00'}`,
        icon: 'warehouse',
        type: 'inventory'
      }
    ];
  }
}
