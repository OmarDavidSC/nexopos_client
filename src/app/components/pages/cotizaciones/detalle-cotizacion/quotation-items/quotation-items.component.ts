import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation-items',
  templateUrl: './quotation-items.component.html',
  styleUrls: ['./quotation-items.component.scss']
})
export class QuotationItemsComponent {

  @Input() details: any[] = [];
  @Input() currency: string | null | undefined = 'S/';

}
