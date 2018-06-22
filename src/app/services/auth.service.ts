import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { API_ROOT_AUTH } from "../app.constants";
import { ResponseModel } from "../core/types/response-model.type";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly API_ROOT = API_ROOT_AUTH;

    constructor(private readonly httpClient: HttpClient) {
    }

    signinGoogle(): Observable<string> {
        return this.httpClient.get<ResponseModel<string>>(`${this.API_ROOT}/google`)
            .pipe(
                map((res: ResponseModel<string>) => res.data)
            );
    }
}
