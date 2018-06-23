import { ChangeDetectionStrategy, Component } from "@angular/core";

import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-auth",
    templateUrl: "./auth.component.html",
    styleUrls: ["./auth.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {

    constructor(private readonly authService: AuthService) {
    }

    signIn(): void {
        this.authService.signinGoogle()
            .subscribe(
                (googleLink) => window.location.href = googleLink,
                (error) => console.log(error)
            );
    }

}
