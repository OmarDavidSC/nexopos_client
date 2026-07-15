
export interface ReportPurchaseFilter {
    branch_id: number | null;
    supplier_id: number | null;
    user_id: number | null;
    voucher_type: number | null;
    status: number | null;
    date_start: number | null;
    date_end: number | null;
}