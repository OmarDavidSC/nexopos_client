
export interface ReportProfitFilter {
    branch_id: number | null;
    product_id: number | null;
    category_id: number | null;
    date_start: string | null;
    date_end: string | null;
}

export interface ProfitSummary {
    total_sales: number;
    products_sold: number;
    total_revenue: number;
    total_cost: number;
    gross_profit: number;
    profit_margin: number;
}

export interface ProfitPeriod {
    date_start: string;
    date_end: string;
}

export interface ProfitSummaryPeriods {
    today: ProfitSummary;
    week: ProfitSummary;
    fortnight: ProfitSummary;
    month: ProfitSummary;
    year: ProfitSummary;
    custom_range: ProfitSummary;
}

export interface ProfitPeriods {
    today: ProfitPeriod;
    week: ProfitPeriod;
    fortnight: ProfitPeriod;
    month: ProfitPeriod;
    year: ProfitPeriod;
    custom_range: ProfitPeriod;
}

export interface ReportProfitData {
    summary: ProfitSummaryPeriods;
    periods: ProfitPeriods;
    filters: ReportProfitFilter;
}