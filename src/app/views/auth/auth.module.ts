import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { AuthComponent } from "./auth.component";
import { AuthRoutes } from "./auth.routes";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthRoutes),
        HttpClientModule
    ],
    declarations: [AuthComponent]
})
export class AuthModule {
}
