
export interface ReportSaleFilter {
    branch_id: number | null;
    customer_id: number | null;
    user_id: number | null;
    payment_method: number | null;
    voucher_type: number | null;
    status: number | null;
    date_start: number | null;
    date_end: number | null;
}