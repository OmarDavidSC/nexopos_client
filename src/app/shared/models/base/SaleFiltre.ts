export interface SaleFiltre {
    page: number;
    search: string;
    customer_id: number | null;
    status: number | null;
    payment_method: number | null;
}