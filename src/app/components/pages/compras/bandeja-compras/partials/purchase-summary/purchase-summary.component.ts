import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-summary',
  templateUrl: './purchase-summary.component.html',
  styleUrls: ['./purchase-summary.component.scss']
})
export class PurchaseSummaryComponent {

  constructor() { }

  @Input() summary: any;

}
