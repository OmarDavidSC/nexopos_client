export interface PurchaseFiltre {
    page: number;
    search: string;
    supplier_id: number | null;
    branch_id: number | null;
    status: number | null;
}