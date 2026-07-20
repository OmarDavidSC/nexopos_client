export interface LowStockFilter {
    search: string;
    status: number | null;
    branch_id: number | null;
}

export type LowStockStatus = '' | 'OUT_OF_STATUS' | 'CRITICAL';

export interface LowStockItem {
    id: number;
    company_id: number;
    branch_id: number;
    product_id: number;
    current_stock: number;
    minimum_stock: number;
    product: LowStockProduct;
    branch: LowStockBranch;
}

export interface LowStockProduct {
    id: number;
    name: string;
    code: string;
    category_id: number;
    category: LowStockCategory | null;
}

export interface LowStockCategory {
    id: number;
    name: string;
}

export interface LowStockBranch {
    id: number;
    name: string;
}