import { DashboardComponent } from "./dashboard.component";
import { AuthGuard } from "../../guards/auth.guard";

export const DashboardRoutes = [
    {
        path: "",
        canActivate: [AuthGuard],
        component: DashboardComponent
    }
];
