import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiResponse } from "src/app/utils/ApiResponse";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";
import { EProductStock } from "../models/entidades/EProductStock";

@Injectable({
    providedIn: "root"
})

export class ProductStockService {
    private urlBase = environment.uriApiBack + "/stock";

    constructor(
        private http: ApiService,
        private httpCient: HttpClient,
        private router: Router,
        private toastService: ToastrService
    ) {
    }

    async index(branch_id: number): Promise<any> {
        try {
            const url = this.urlBase + `/${branch_id}/index`;
            const { success, data, message } = await this.httpCient.get<ApiResponse<any>>(url).toPromise();
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

    async update(formData: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${formData.get('id')}/update`;
            const response = await this.http.postForm(url, formData).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }
}