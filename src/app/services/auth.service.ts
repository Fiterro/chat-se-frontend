import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { API_ROOT_AUTH } from "../app.constants";
import { ResponseModel } from "../core/types/response-model.type";
import { User } from "../core/classes/user";
import { SessionService } from "./session.service";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly API_ROOT = API_ROOT_AUTH;

    constructor(private readonly httpClient: HttpClient,
                private readonly sessionService: SessionService,
                private readonly router: Router) {
    }

    signinGoogle(): Observable<string> {
        return this.httpClient.get<ResponseModel<string>>(`${this.API_ROOT}/google`)
            .pipe(
                map(({data}) => data)
            );
    }

    signinGoogleCallback(code): Observable<boolean> {
        return this.httpClient.post<ResponseModel<User>>(`${this.API_ROOT}/google/callback`, {code})
            .pipe(
                map(({data}) => this.processLogin(data))
            );
    }

    logout() {
        this.sessionService.set(undefined);
        this.router.navigate(["/auth"]);
    }

    private processLogin(user: User): boolean {
        this.sessionService.set(user);
        return !!this.sessionService.userSnapshot;
    }
}
