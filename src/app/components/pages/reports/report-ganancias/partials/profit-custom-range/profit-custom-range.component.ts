import { Component, Input, OnInit } from '@angular/core';
import { ProfitPeriod, ProfitSummary, ReportProfitFilter } from 'src/app/shared/models/base/ReportProfitFilter';

@Component({
  selector: 'app-profit-custom-range',
  templateUrl: './profit-custom-range.component.html',
  styleUrls: ['./profit-custom-range.component.scss']
})
export class ProfitCustomRangeComponent {

  @Input() summary: ProfitSummary | null = null;
  @Input() period: ProfitPeriod | null = null;
  @Input() loading: boolean = false;
  @Input() customRangeApplied: boolean = false;

  @Input() dateStart: string | null = null;
  @Input() dateEnd: string | null = null;

  get hasData(): boolean {
    return !!this.summary && (this.summary.total_sales > 0 || this.summary.products_sold > 0 || this.summary.total_revenue > 0 ||
      this.summary.total_cost > 0 || this.summary.gross_profit !== 0);
  }

  get profitClass(): string {
    if (!this.summary) {
      return 'neutral';
    }

    if (this.summary.gross_profit > 0) {
      return 'positive';
    }

    if (this.summary.gross_profit < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  get displayedDateStart(): string | null {
    if (this.customRangeApplied && this.dateStart) {
      return this.dateStart;
    }
    return this.period?.date_start || null;
  }

  get displayedDateEnd(): string | null {
    if (this.customRangeApplied && this.dateEnd) {
      return this.dateEnd;
    }
    return this.period?.date_end || null;
  }

  get hasPeriod(): boolean {
    return !!this.displayedDateStart && !!this.displayedDateEnd;
  }

}
