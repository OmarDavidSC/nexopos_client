export interface SaleFiltre {
    page: number;
    search: string;
    branch_id: number | null;
    customer_id: number | null;
    status: number | null;
    payment_method: number | null;
}