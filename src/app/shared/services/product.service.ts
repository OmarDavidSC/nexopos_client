import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiResponse } from "src/app/utils/ApiResponse";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";
import { EProducto } from "../models/entidades/EProducto";
import { ProductFilter } from "../models/base/ProductFilter";

@Injectable({
    providedIn: "root"
})

export class ProductService {
    private urlBase = environment.uriApiBack + "/product";

    constructor(
        private http: ApiService,
        private httpCient: HttpClient,
        private router: Router,
        private toastService: ToastrService
    ) {
    }

    async index(filter: ProductFilter): Promise<any> {
        try {
            const url = this.urlBase + '';

            const formData = new FormData();
            formData.append('page', String(filter.page));
            formData.append('search', filter.search ?? '');

            formData.append('category_id', filter.category_id !== null ? String(filter.category_id) : '');
            formData.append('brand_id', filter.brand_id !== null ? String(filter.brand_id) : '');
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

    async adm(): Promise<EProducto[]> {
        try {
            const url = this.urlBase + '/adm';
            const { success, data, message } = await this.httpCient.get<ApiResponse<any>>(url).toPromise();
            if (!success) {
                this.toastService.error(message);
            }
            return EProducto.parseJsonList(data);
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

    async update(formData: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${formData.get('id')}/update`;
            const response = await this.http.postForm(url, formData).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }

    async remove(id: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${id}/remove`;
            const response = await this.http.post(url, {}).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }
}