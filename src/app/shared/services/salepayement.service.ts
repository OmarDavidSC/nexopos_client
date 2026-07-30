import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ApiResponse } from "src/app/utils/ApiResponse";
import { ApiService } from "./api.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: "root"
})

export class SalePaymenteService {
    private urlBase = environment.uriApiBack + "/spayment";

    constructor(
        private http: ApiService,
        private httpCient: HttpClient,
        private router: Router,
        private toastService: ToastrService
    ) {
    }

     async payments(id: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${id}/payments`;
            const response = await this.http.post(url, {}).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }

    async store(formData: any): Promise<ApiResponse<any>> {
        try {
            const url = this.urlBase + `/${formData.get('id')}/store`;
            const response = await this.http.postForm(url, formData).toPromise();
            return response as ApiResponse<any>;
        } catch (error) {
            throw error;
        }
    }
}