export interface ProductFilter {
    page: number;
    search: string;
    category_id: number | null;
    brand_id: number | null;
    status: number | null;
}