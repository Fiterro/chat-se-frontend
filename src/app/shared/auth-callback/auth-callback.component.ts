import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-auth-callback",
    template: "",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthCallbackComponent implements OnInit {
    private code: string;

    constructor(private readonly activatedRoute: ActivatedRoute,
                private readonly router: Router,
                private readonly authService: AuthService) {
        this.activatedRoute.queryParams
            .subscribe(params => {
                this.code = params.code;
            });
    }

    ngOnInit(): void {
        this.authService.signinGoogleCallback(this.code)
            .subscribe(
                () => this.router.navigate([""], {relativeTo: this.activatedRoute.root}),
                () => this.router.navigate([""], {relativeTo: this.activatedRoute.root})
            );
    }
}
