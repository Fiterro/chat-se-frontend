import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { AppRoutes } from "./app.routes";
import { DashboardModule } from "./views/dashboard/dashboard.module";
import { ApiInterceptor } from "./interceptors/api.interceptor";
import { AuthCallbackComponent } from "./shared/auth-callback/auth-callback.component";

@NgModule({
    declarations: [
        AppComponent,
        AuthCallbackComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(AppRoutes),
        BrowserAnimationsModule,
        DashboardModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
