import { ChangeDetectionStrategy, Component, HostListener, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { Message } from "../../../core/classes/message";
import { FlipState } from "../../../animations/flip-card.animation";

@Component({
    selector: "app-chat-message",
    templateUrl: "./chat-message.component.html",
    styleUrls: ["./chat-message.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatMessageComponent {
    readonly flipped = new BehaviorSubject<FlipState>(FlipState.Unflipped);
    @Input() message: Message;

    @HostListener("mouseenter")
    @HostListener("mouseleave")
    onHover(): void {
        this.flip();
    }

    private flip(): void {
        this.flipped.next(this.flipped.value === FlipState.Unflipped ? FlipState.Flipped : FlipState.Unflipped);
    }
}
