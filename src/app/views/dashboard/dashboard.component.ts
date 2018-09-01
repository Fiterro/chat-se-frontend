import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnDestroy {
    mobileQuery: MediaQueryList;
    readonly sidebarDefaultOpened = true;

    private _mobileQueryListener: () => void;

    constructor(private readonly changeDetectorRef: ChangeDetectorRef,
                private readonly media: MediaMatcher) {
        this.mobileQuery = media.matchMedia("(max-width: 600px)");
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
}
