import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EVenta } from 'src/app/shared/models/entidades/EVenta';

@Component({
  selector: 'app-sale-card',
  templateUrl: './sale-card.component.html',
  styleUrls: ['./sale-card.component.scss']
})
export class SaleCardComponent {

  @Input() sale!: EVenta;
  @Output() view = new EventEmitter<EVenta>();
  @Output() cancel = new EventEmitter<EVenta>();

}
