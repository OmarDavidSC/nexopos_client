import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation-customer-info',
  templateUrl: './quotation-customer-info.component.html',
  styleUrls: ['./quotation-customer-info.component.scss']
})
export class QuotationCustomerInfoComponent {

  @Input() quotation: any = null;
}
