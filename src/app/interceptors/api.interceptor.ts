import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

import { API_URL } from "../../environments/environment";
import { SessionService } from "../services/session.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(private readonly sessionService: SessionService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let request = req.clone({
            url: [API_URL, req.url].join("")
        });

        const user = this.sessionService.userSnapshot;
        if (user) {
            const authorization = ["Bearer", user.session.accessToken].join(" ");
            request = request.clone({
                headers: request.headers.set("Authorization", authorization)
            });
        }
        return next.handle(request);
    }
}
