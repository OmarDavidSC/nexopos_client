import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory-summary-report',
  templateUrl: './inventory-summary-report.component.html',
  styleUrls: ['./inventory-summary-report.component.scss']
})
export class InventorySummaryReportComponent {

  @Input() resumen: any;
  @Input() loading: boolean = false;

  get totalMovimientos(): number {
    return Number(this.resumen?.total_movements ?? 0);
  }

  get totalEntradas(): number {
    return Number(this.resumen?.total_entries ?? 0);
  }

  get totalSalidas(): number {
    return Number(this.resumen?.total_exits ?? 0);
  }

  get totalProductos(): number {
    return Number(this.resumen?.total_products ?? 0);
  }

}
