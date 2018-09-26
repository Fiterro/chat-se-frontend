import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FlipComponent } from "./flip.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [FlipComponent],
    exports: [FlipComponent]
})
export class FlipModule {
}
