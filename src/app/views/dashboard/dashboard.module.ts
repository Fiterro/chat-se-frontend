import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutes } from "./dashboard.routes";
import { MatButtonModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from "@angular/material";
import { ChatModule } from "../chat/chat.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        ChatModule
    ],
    declarations: [DashboardComponent]
})
export class DashboardModule {
}
