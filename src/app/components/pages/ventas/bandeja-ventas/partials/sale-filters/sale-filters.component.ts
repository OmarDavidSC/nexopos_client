import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SaleFiltre } from 'src/app/shared/models/base/SaleFiltre';
import { ECliente } from 'src/app/shared/models/entidades/ECliente';

@Component({
  selector: 'app-sale-filters',
  templateUrl: './sale-filters.component.html',
  styleUrls: ['./sale-filters.component.scss']
})
export class SaleFiltersComponent {

  constructor() { }

  @Input() filter!: SaleFiltre;
  @Input() customers: ECliente[] = [];
  @Output() search = new EventEmitter();
  @Output() customerChange = new EventEmitter();
  @Output() statusChange = new EventEmitter();
  @Output() payment_methodChange = new EventEmitter();
  @Output() clear = new EventEmitter();

}
