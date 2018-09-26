import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CapitalizeFirstPipe } from "./capitalize-first.pipe";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [CapitalizeFirstPipe],
    exports: [CapitalizeFirstPipe]
})
export class CapitalizeFirstModule {
}
