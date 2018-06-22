import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-auth",
    templateUrl: "./auth.component.html",
    styleUrls: ["./auth.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {

    constructor(private readonly authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.signinGoogle()
            .subscribe(console.log);
    }

}
