import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PurchaseFiltre } from 'src/app/shared/models/base/PurchaseFiltre';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';

@Component({
  selector: 'app-purchase-filters',
  templateUrl: './purchase-filters.component.html',
  styleUrls: ['./purchase-filters.component.scss']
})
export class PurchaseFiltersComponent {

  @Input() filter!: PurchaseFiltre;
  @Input() suppliers: EProveedor[] = [];
  @Input() branches: ESucursal[] = [];
  @Output() search = new EventEmitter();
  @Output() supplierChange = new EventEmitter();
  @Output() branchChange = new EventEmitter();
  @Output() statusChange = new EventEmitter();
  @Output() clear = new EventEmitter();

}
