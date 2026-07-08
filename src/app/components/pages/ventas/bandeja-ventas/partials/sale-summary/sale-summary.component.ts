import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sale-summary',
  templateUrl: './sale-summary.component.html',
  styleUrls: ['./sale-summary.component.scss']
})
export class SaleSummaryComponent {

  constructor() { }

  @Input() summary: any;
}
