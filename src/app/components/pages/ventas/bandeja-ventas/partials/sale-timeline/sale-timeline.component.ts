import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EVenta } from 'src/app/shared/models/entidades/EVenta';

@Component({
  selector: 'app-sale-timeline',
  templateUrl: './sale-timeline.component.html',
  styleUrls: ['./sale-timeline.component.scss']
})
export class SaleTimelineComponent {

  @Input() sales: EVenta[] = [];
  @Input() moneda: string;
  @Input() loading: boolean = false;
  @Output() view = new EventEmitter<EVenta>();
  @Output() cancel = new EventEmitter<EVenta>();
  @Output() paymentHistory = new EventEmitter<EVenta>();

}
