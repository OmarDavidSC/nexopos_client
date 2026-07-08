import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PurchaseFiltre } from 'src/app/shared/models/base/PurchaseFiltre';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';

@Component({
  selector: 'app-purchase-filters',
  templateUrl: './purchase-filters.component.html',
  styleUrls: ['./purchase-filters.component.scss']
})
export class PurchaseFiltersComponent {

  @Input() filter!: PurchaseFiltre;
  @Input() suppliers: EProveedor[] = [];
  @Output() search = new EventEmitter();
  @Output() supplierChange = new EventEmitter();
  @Output() statusChange = new EventEmitter();
  @Output() dateChange = new EventEmitter();
  @Output() clear = new EventEmitter();
  @Output() newPurchase = new EventEmitter();

}
