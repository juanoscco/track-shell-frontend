import { CreateAdminPage, CreateStorePage, HomeSuperAdminPage, ViewAdminPage, ViewStorePage } from "@/modules/dashboard/pages/";
import { DashboardLayout } from "../../layouts";
import { ProtectedRoute } from "@/hooks/protected-route";


export const superAdminRoutes = [
    {
        path: '/dashboard-superadmin',
        component: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                component: (
                    <ProtectedRoute>
                        <HomeSuperAdminPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'create-admin',
                component: (
                    <ProtectedRoute>
                        <CreateAdminPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-admin',
                component: (
                    <ProtectedRoute>
                        <ViewAdminPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-store',
                component: (
                    <ProtectedRoute>
                        <ViewStorePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'create-store',
                component: (
                    <ProtectedRoute>
                        <CreateStorePage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];