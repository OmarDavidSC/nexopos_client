import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";
import { ReportSaleFilter } from "../models/base/ReportSaleFilter";

@Injectable({
    providedIn: "root"
})

export class ReportSaleService {
    private urlBase = environment.uriApiBack + "/rsale";

    constructor(
        private http: ApiService,
        private httpCient: HttpClient,
        private router: Router,
        private toastService: ToastrService
    ) {
    }

    async index(filter: ReportSaleFilter): Promise<any> {
        try {
            const url = this.urlBase + '';

            const formData = new FormData();
            formData.append('branch_id', filter.branch_id !== null ? String(filter.branch_id) : '');
            formData.append('customer_id', filter.customer_id !== null ? String(filter.customer_id) : '');
            formData.append('user_id', filter.user_id !== null ? String(filter.user_id) : '');
            formData.append('payment_method', filter.payment_method !== null ? String(filter.payment_method) : '');
            formData.append('voucher_type', filter.voucher_type !== null ? String(filter.voucher_type) : '');
            formData.append('status', filter.status !== null ? String(filter.status) : '');
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
}