import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";

import { AuthService } from "../../services/auth.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnDestroy {
    mobileQuery: MediaQueryList;
    readonly sidebarDefaultOpened = true;

    private readonly _mobileQueryListener: () => void;

    constructor(private readonly changeDetectorRef: ChangeDetectorRef,
                private readonly authService: AuthService,
                private readonly media: MediaMatcher) {
        this.mobileQuery = media.matchMedia("(max-width: 600px)");
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    onLogoutClick(): void {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}
