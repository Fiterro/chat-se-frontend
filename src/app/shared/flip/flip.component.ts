import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { FlipAnimation, FlipState } from "../../animations/flip-card.animation";

@Component({
    selector: "app-flip",
    templateUrl: "./flip.component.html",
    styleUrls: ["./flip.component.scss"],
    animations: [FlipAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlipComponent implements OnChanges {
    @Input() state: FlipState;

    readonly innerState = new BehaviorSubject<FlipState>(FlipState.Unflipped);

    ngOnChanges({state}: SimpleChanges): void {
        if (state && state.currentValue) {
            this.innerState.next(state.currentValue);
        }
    }
}
