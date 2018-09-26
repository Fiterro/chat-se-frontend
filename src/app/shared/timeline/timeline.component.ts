import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from "@angular/core";

import * as moment from "moment";

import { TimelineElem } from "./timeline.interface";
import { TimelineData } from "../../core/types/timeline-data.type";

@Component({
    selector: "app-timeline",
    templateUrl: "./timeline.component.html",
    styleUrls: ["./timeline.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnChanges {
    @Input() elements: TimelineElem[];
    readonly activityArr: TimelineElem[] = [];

    get timeline(): TimelineElem[] {
        return this.activityArr.reverse();
    }

    ngOnChanges({elements}: SimpleChanges): void {
        if (elements && elements.currentValue && elements.currentValue.length) {
            this.formActivityLine(elements.currentValue);
        }
    }

    private formActivityLine(elements: TimelineElem[]) {
        const dataFiller: TimelineData = {
            timestamp: "",
            participants: undefined
        };
        elements.forEach((element, index) => {
            if (index > 0) {
                const thisDay = moment(element.timestamp, "YYYY-MM-DD");
                const prevDay = moment(elements[index - 1].timestamp, "YYYY-MM-DD");
                const dayDiff = prevDay.diff(thisDay, "days");
                if (dayDiff - 1 > 0) {
                    const missingDays = Array(dayDiff - 1).fill(dataFiller);
                    this.activityArr.push(...missingDays);
                }
            }
            this.activityArr.push(element);
        });
    }
}
