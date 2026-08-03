import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation-totals',
  templateUrl: './quotation-totals.component.html',
  styleUrls: ['./quotation-totals.component.scss']
})
export class QuotationTotalsComponent {

  @Input() quotation: any = null;
  @Input() currency: string | null | undefined = 'S/';

}
