import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { API_ROOT_AUTH } from "../app.constants";
import { ResponseModel } from "../core/types/response-model.type";
import { User } from "../core/classes/user";
import { SessionService } from "./session.service";
import { AdminRoleDto } from "../core/dto/admin-role.dto";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly API_ROOT = API_ROOT_AUTH;

    constructor(private readonly httpClient: HttpClient,
                private readonly sessionService: SessionService,
                private readonly router: Router) {
        if (this.sessionService.userSnapshot) {
            this.obtainUserRole();
        }
    }

    signinGoogle(): Observable<string> {
        return this.httpClient
            .get<ResponseModel<string>>(`${this.API_ROOT}/google`)
            .pipe(
                map(({data}) => data)
            );
    }

    signinGoogleCallback(code: string): Observable<boolean> {
        return this.httpClient
            .post<ResponseModel<User>>(`${this.API_ROOT}/google/callback`, {code})
            .pipe(
                map(({data}) => {
                    return this.processLogin(data);
                })
            );
    }

    logout(): void {
        this.httpClient
            .delete<ResponseModel<void>>(`${this.API_ROOT}/logout`)
            .pipe(
                tap(() => this.sessionService.set(undefined))
            )
            .subscribe(() => this.router.navigate(["/auth"]));
    }

    private processLogin(user: User): boolean {
        this.sessionService.set(user);
        this.obtainUserRole();
        return !!this.sessionService.userSnapshot;
    }

    private obtainUserRole(): void {
        this.httpClient
            .get<ResponseModel<AdminRoleDto>>(`${this.API_ROOT}/is-admin`)
            .subscribe(({data}) => {
                // process admin role
                this.sessionService.isAdmin.next(data.isAdmin);
            });
    }
}
