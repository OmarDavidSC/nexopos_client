import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiResponse } from "src/app/utils/ApiResponse";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";
import { QuotationFilter } from "../models/base/QuotationFilter";

@Injectable({
    providedIn: "root"
})

export class QuotationService {
    private urlBase = environment.uriApiBack + "/quotation";

    constructor(
        private http: ApiService,
        private httpCient: HttpClient,
        private router: Router,
        private toastService: ToastrService
    ) {
    }

    async index(filter: QuotationFilter): Promise<any> {
        try {
            const url = this.urlBase + '';

            const formData = new FormData();
            formData.append('page', String(filter.page));
            formData.append('search', filter.search ?? '');

            formData.append('customer_id', filter.customer_id !== null ? String(filter.customer_id) : '');
            formData.append('branch_id', filter.branch_id !== null ? String(filter.branch_id) : '');
            formData.append('status', filter.status !== null ? String(filter.status) : '');
            formData.append('issue_date_start', filter.issue_date_start !== null ? String(filter.issue_date_start) : '');
            formData.append('issue_date_end', filter.issue_date_end !== null ? String(filter.issue_date_end) : '');
            formData.append('expiration_date_start', filter.expiration_date_start !== null ? String(filter.expiration_date_start) : '');
            formData.append('expiration_date_end', filter.expiration_date_end !== null ? String(filter.expiration_date_end) : '');

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

    async accept(id: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${id}/accept`;
            const response = await this.http.post(url, {}).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }

    async reject(id: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${id}/reject`;
            const response = await this.http.post(url, {}).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }

    async sent(id: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${id}/sent`;
            const response = await this.http.post(url, {}).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }

    async convert(formData: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${formData.get('id')}/convert`;
            const response = await this.http.postForm(url, formData).toPromise();
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