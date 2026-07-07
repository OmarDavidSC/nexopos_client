import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-summary',
  templateUrl: './product-summary.component.html',
  styleUrls: ['./product-summary.component.scss']
})
export class ProductSummaryComponent {

  @Input() summary: any;

}
