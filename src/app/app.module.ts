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
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthCallbackComponent,
        PageNotFoundComponent
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
