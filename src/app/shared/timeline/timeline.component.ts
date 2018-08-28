import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { TimelineElem } from "./timeline.interface";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["./timeline.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent {
    @Input() elements: TimelineElem[];
}
