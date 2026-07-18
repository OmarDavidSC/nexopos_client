import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SaleFiltre } from 'src/app/shared/models/base/SaleFiltre';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';
import { ESucursal } from 'src/app/shared/models/entidades/ESucursal';

@Component({
  selector: 'app-sale-filters',
  templateUrl: './sale-filters.component.html',
  styleUrls: ['./sale-filters.component.scss']
})
export class SaleFiltersComponent {

  constructor() { }

  @Input() filter!: SaleFiltre;
  @Input() customers: ECliente[] = [];
  @Input() branches: ESucursal[] = [];
  @Output() search = new EventEmitter();
  @Output() customerChange = new EventEmitter();
  @Output() sunatChange = new EventEmitter();
  @Output() branchChange = new EventEmitter();
  @Output() statusChange = new EventEmitter();
  @Output() payment_methodChange = new EventEmitter();
  @Output() clear = new EventEmitter();

}
