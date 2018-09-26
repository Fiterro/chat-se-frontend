import { Injectable } from "@angular/core";
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, filter, first, map, share, switchMap, tap } from "rxjs/operators";

import { SessionService } from "../services/session.service";
import { API_URL } from "../../environments/environment";
import { API_ROOT_AUTH } from "../app.constants";
import { ResponseModel } from "../core/types/response-model.type";
import { SessionData } from "../core/types/session.type";
import { RefreshSessionDto } from "../core/dto/refresh-session.dto";

const UNAUTHORIZED_CODE = 401;

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    private progress: Observable<void>;

    constructor(private sessionService: SessionService,
                private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request = req;
        return next.handle(request)
            .pipe(
                catchError((error) => {
                    if (error.status !== UNAUTHORIZED_CODE) {
                        return throwError(error);
                    }

                    const sessionInfo = this.sessionService.userSnapshot
                        ? this.sessionService.userSnapshot.session
                        : undefined;

                    if (!sessionInfo) {
                        throw error;
                    }

                    if (!this.progress) {
                        this.progress = this.refreshSession(next)
                            .pipe(
                                tap(() => this.progress = undefined),
                                share()
                            );
                    }

                    return this.progress
                        .pipe(
                            switchMap(() => {
                                const user = this.sessionService.userSnapshot;
                                if (user) {
                                    const creds = ["Bearer", user.session.accessToken].join(" ");
                                    request = request.clone({headers: request.headers.set("Authorization", creds)});
                                }
                                return next.handle(request);
                            }),
                            catchError((err) => {
                                this.sessionService.set(undefined);
                                this.router.navigate(["/auth"]);
                                return throwError(err);
                            })
                        );
                })
            );
    }

    private refreshSession(handler: HttpHandler): Observable<void> {
        return this.sessionService.user
            .pipe(
                first(),
                switchMap((u) => {
                    const request = new HttpRequest(
                        "POST",
                        `${API_URL}${API_ROOT_AUTH}/refresh`,
                        new RefreshSessionDto(u.session.refreshToken)
                    );
                    return handler.handle(request);
                }),
                filter((httpEvent: HttpEvent<ResponseModel<SessionData>>) => httpEvent.type === HttpEventType.Response),
                map((res: HttpResponse<ResponseModel<SessionData>>) => {
                    const user = this.sessionService.userSnapshot;
                    if (user) {
                        user.session = res.body.data;
                        this.sessionService.set(user);
                    }
                }),
                catchError(() => {
                    return throwError("Session refreshment is failed");
                })
            );
    }
}
