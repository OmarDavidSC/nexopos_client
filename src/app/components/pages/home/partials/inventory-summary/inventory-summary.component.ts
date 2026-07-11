import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory-summary',
  templateUrl: './inventory-summary.component.html',
  styleUrls: ['./inventory-summary.component.scss']
})
export class InventorySummaryComponent implements OnInit {

  @Input() data: any;

  Cards: any[] = [];

  constructor() { }


  ngOnInit(): void {

  }


  ngOnChanges() {

    this.Cards = [

      {
        title: 'Stock disponible',
        value: this.data?.total_stock ?? 0,
        icon: 'inventory_2',
        class: 'stock'
      },

      {
        title: 'Productos agotados',
        value: this.data?.out_stock ?? 0,
        icon: 'remove_shopping_cart',
        class: 'danger'
      },

      {
        title: 'Stock bajo',
        value: this.data?.low_stock ?? 0,
        icon: 'warning',
        class: 'warning'
      }

    ];

  }
}
