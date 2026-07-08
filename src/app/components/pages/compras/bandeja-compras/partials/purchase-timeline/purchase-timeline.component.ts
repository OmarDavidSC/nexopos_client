import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECompra } from 'src/app/shared/models/entidades/ECompra';

@Component({
  selector: 'app-purchase-timeline',
  templateUrl: './purchase-timeline.component.html',
  styleUrls: ['./purchase-timeline.component.scss']
})
export class PurchaseTimelineComponent {
  @Input() purchases: ECompra[] = [];
  @Input() loading: boolean = false;
  @Output() view = new EventEmitter<ECompra>();
  @Output() cancel = new EventEmitter<ECompra>();
}
