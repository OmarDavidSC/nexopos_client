import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiResponse } from "src/app/utils/ApiResponse";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";
import { EProducto } from "../models/entidades/EProducto";
import { PurchaseFiltre } from "../models/base/PurchaseFiltre";

@Injectable({
    providedIn: "root"
})

export class PurchaseService {
    private urlBase = environment.uriApiBack + "/purchase";

    constructor(
        private http: ApiService,
        private httpCient: HttpClient,
        private router: Router,
        private toastService: ToastrService
    ) {
    }

    async index(filter: PurchaseFiltre): Promise<any> {
        try {
            const url = this.urlBase + '';

            const formData = new FormData();
            formData.append('page', String(filter.page));
            formData.append('search', filter.search ?? '');

            formData.append('supplier_id', filter.supplier_id !== null ? String(filter.supplier_id) : '');
            formData.append('branch_id', filter.branch_id !== null ? String(filter.branch_id) : '');
            formData.append('status', filter.status !== null ? String(filter.status) : '');

            const { success, data, message } = await this.http.postForm(url, formData).toPromise();
            if (!success) {
                this.toastService.error(message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async store(formData: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + '/store';
            const response = await this.http.postForm(url, formData).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }

    async show(id: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${id}/show`;
            const response = await this.http.post(url, {}).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }

    async cancel(id: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${id}/cancel`;
            const response = await this.http.post(url, {}).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }
}