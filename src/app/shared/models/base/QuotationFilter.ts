export interface QuotationFilter {
    page: number;
    search: string;
    customer_id: number | null;
    branch_id: number | null;
    status: number | null;
    issue_date_start: string | null;
    issue_date_end: string | null;
    expiration_date_start: string | null;
    expiration_date_end: string | null;
}