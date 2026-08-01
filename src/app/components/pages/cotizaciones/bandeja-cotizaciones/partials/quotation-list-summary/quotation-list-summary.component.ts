import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation-list-summary',
  templateUrl: './quotation-list-summary.component.html',
  styleUrls: ['./quotation-list-summary.component.scss']
})
export class QuotationListSummaryComponent {

  @Input() summary: any = null;
  @Input() moneda: string | null | undefined = 'S/';

  get total(): number {
    return Number(this.summary?.total || 0);
  }

  get borradores(): number {
    return Number(this.summary?.draft || 0);
  }

  get enviadas(): number {
    return Number(this.summary?.sent || 0);
  }

  get aceptadas(): number {
    return Number(this.summary?.accepted || 0);
  }

  get rechazadas(): number {
    return Number(this.summary?.rejected || 0);
  }

  get vencidas(): number {
    return Number(this.summary?.expired || 0);
  }

  get convertidas(): number {
    return Number(this.summary?.converted || 0);
  }

  get canceladas(): number {
    return Number(this.summary?.cancelled || 0);
  }

  get montoTotal(): number {
    return Number(this.summary?.total_amount || 0);
  }

  get porcentajeConvertidas(): number {
    if (this.total <= 0) {
      return 0;
    }
    return Math.round((this.convertidas / this.total) * 100);
  }
}
