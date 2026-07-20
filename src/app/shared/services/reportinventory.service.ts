import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";
import { ReportInventoryFilter } from "../models/base/ReportInventoryFilter";
import { LowStockFilter, LowStockItem } from "../models/base/LowStockFilter";

@Injectable({
    providedIn: "root"
})

export class ReportInventoryService {
    private urlBase = environment.uriApiBack + "/rinventory";

    constructor(
        private http: ApiService,
        private httpCient: HttpClient,
        private router: Router,
        private toastService: ToastrService
    ) {
    }

    async index(filter: ReportInventoryFilter): Promise<any> {
        try {
            const url = this.urlBase + '';

            const formData = new FormData();
            formData.append('branch_id', filter.branch_id !== null ? String(filter.branch_id) : '');
            formData.append('product_id', filter.product_id !== null ? String(filter.product_id) : '');
            formData.append('date_start', filter.date_start !== null ? String(filter.date_start) : '');
            formData.append('date_end', filter.date_end !== null ? String(filter.date_end) : '');

            const { success, data, message } = await this.http.postForm(url, formData).toPromise();
            if (!success) {
                this.toastService.error(message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async low(filter: LowStockFilter): Promise<any> {
        try {
            const url = this.urlBase + '/low';

            const formData = new FormData();
            formData.append('search', filter.search ?? '');
            formData.append('branch_id', filter.branch_id !== null ? String(filter.branch_id) : '');
            formData.append('status', filter.status !== null ? String(filter.status) : '');

            const { success, data, message } = await this.http.postForm(url, formData).toPromise();
            if (!success) {
                this.toastService.error(message);
                return [];
            }
            return (data ?? []).map((item: LowStockItem) => ({
                ...item,
                current_stock: Number(item.current_stock),
                minimum_stock: Number(item.minimum_stock)
            }));
        } catch (error) {
            this.toastService.error('No se pudieron obtener las alertas de stock.');
            throw error;
        }
    }
}