import { Component, Input, OnInit } from '@angular/core';
import { ProfitPeriods, ProfitSummaryPeriods } from 'src/app/shared/models/base/ReportProfitFilter';

interface ProfitPeriodCard {
  key: keyof Omit<ProfitSummaryPeriods, 'custom_range'>;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-profit-period-summary',
  templateUrl: './profit-period-summary.component.html',
  styleUrls: ['./profit-period-summary.component.scss']
})
export class ProfitPeriodSummaryComponent {

  @Input() summary: ProfitSummaryPeriods | null = null;
  @Input() periods: ProfitPeriods | null = null;
  @Input() loading: boolean = false;


  cards: ProfitPeriodCard[] = [
    {
      key: 'today',
      title: 'Ganancia de hoy',
      icon: 'today'
    },
    {
      key: 'week',
      title: 'Ganancia semanal',
      icon: 'date_range'
    },
    {
      key: 'fortnight',
      title: 'Ganancia quincenal',
      icon: 'event'
    },
    {
      key: 'month',
      title: 'Ganancia mensual',
      icon: 'calendar_month'
    },
    {
      key: 'year',
      title: 'Ganancia anual',
      icon: 'insights'
    }
  ];

}
