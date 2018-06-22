export const AppRoutes = [
    {
        path: "",
        children: [
            {
                path: "",
                loadChildren: "./views/dashboard/dashboard.module#DashboardModule"
            },
            {
                path: "auth",
                loadChildren: "./views/auth/auth.module#AuthModule"
            }
        ]
    }
];
