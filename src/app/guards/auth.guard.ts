import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { first, map, tap } from "rxjs/internal/operators";

import { SessionService } from "../services/session.service";

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {

    constructor(private sessionService: SessionService,
                private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.sessionService.user
            .pipe(
                first(),
                map((u) => !!u),
                tap((isLoggedIn: boolean) => {
                    if (!isLoggedIn) {
                        this.router.navigate(["/auth"]);
                    }
                })
            );

    }
}
