import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ECompra } from 'src/app/shared/models/entidades/ECompra';

@Component({
  selector: 'app-purchase-card',
  templateUrl: './purchase-card.component.html',
  styleUrls: ['./purchase-card.component.scss']
})
export class PurchaseCardComponent  {

  @Input() purchase!: ECompra;
  @Input() moneda!: string;
  @Output() view = new EventEmitter<ECompra>();
  @Output() cancel = new EventEmitter<ECompra>();

}
