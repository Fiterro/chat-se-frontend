import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BorderScrolledDirective } from "./border-scrolled.directive";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [BorderScrolledDirective],
    exports: [BorderScrolledDirective]
})
export class BorderScrolledModule {
}
