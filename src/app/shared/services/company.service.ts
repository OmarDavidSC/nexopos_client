import { Injectable } from "@angular/core";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { Router } from "@angular/router";
import { ApiResponse } from "src/app/utils/ApiResponse";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: "root"
})

export class CompanyService {
    private urlBase = environment.uriApiBack + "/company";

    constructor(
        private http: ApiService,
        private httpCient: HttpClient,
        private router: Router
    ) {
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