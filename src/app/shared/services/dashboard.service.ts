import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiResponse } from "src/app/utils/ApiResponse";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";
import { ECliente } from "../models/entidades/ECliente";

@Injectable({
    providedIn: "root"
})

export class DashboardService {
    private urlBase = environment.uriApiBack + "/dashboard";

    constructor(
        private http: ApiService,
        private httpCient: HttpClient,
        private router: Router,
        private toastService: ToastrService
    ) {
    }

    async index(): Promise<any> {
        try {
            const url = this.urlBase + '';
            const { success, data, message } = await this.httpCient.get<ApiResponse<any>>(url).toPromise();
            if (!success) {
                this.toastService.error(message);
            }
            return data;
        } catch (error) {
            throw error;
        }
    }


}