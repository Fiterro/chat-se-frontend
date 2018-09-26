import { animate, state, style, transition, trigger } from "@angular/animations";

export const FlipAnimation = trigger("flip", [
    state("flipped", style({transform: "rotateX(180deg)"})),
    state("unflipped", style({transform: "rotateX(0)"})),
    transition("* => *", animate("400ms ease-in-out"))
]);

export enum FlipState {
    Flipped = "flipped",
    Unflipped = "unflipped"
}
