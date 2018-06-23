import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatButtonModule, MatCardModule, MatTabsModule } from "@angular/material";

import { AuthComponent } from "./auth.component";
import { AuthRoutes } from "./auth.routes";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AuthRoutes),
        MatCardModule,
        MatButtonModule,
        MatTabsModule
    ],
    declarations: [
        AuthComponent
    ]
})
export class AuthModule {
}
