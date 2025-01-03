import {
    HomeAdminPage,
    CreateMaterialPage,
    CreateSellerPage,
    SellersList, MaterialList,
    IncomeList,
    ClientList,
    SalesList,
    OutputList,
    CreateClientPage,
    CreateIncomePage,
    CreateOutputPage,
    CreateSalePage
} from "@/modules/dashboard/pages/";
import { DashboardLayout } from "../../layouts";
import { ProtectedRoute } from "@/hooks/protected-route";
import DetailIncomePage from "../../pages/admin/detail-income/detail-income.page";
import DetailSalesPage from "../../pages/admin/detail-sales/detail-sales.page";
import DetailOutputsPage from "../../pages/admin/detail-outputs/detail-outputs.page";

export const adminRoutes = [
    {
        path: '/dashboard-admin',
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
                        <HomeAdminPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'create-seller',
                component: (
                    <ProtectedRoute>
                        <CreateSellerPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'create-client',
                component: (
                    <ProtectedRoute>
                        <CreateClientPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'create-material',
                component: (
                    <ProtectedRoute>
                        <CreateMaterialPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'create-income',
                component: (
                    <ProtectedRoute>
                        <CreateIncomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'create-output',
                component: (
                    <ProtectedRoute>
                        <CreateOutputPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'create-sales',
                component: (
                    <ProtectedRoute>
                        <CreateSalePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-seller',
                component: (
                    <ProtectedRoute>
                        <SellersList />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-materials',
                component: (
                    <ProtectedRoute>
                        <MaterialList />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-sales',
                component: (
                    <ProtectedRoute>
                        <SalesList />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-output',
                component: (
                    <ProtectedRoute>
                        <OutputList />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-income',
                component: (
                    <ProtectedRoute>
                        <IncomeList />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-clients',
                component: (
                    <ProtectedRoute>
                        <ClientList />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-income/:id',
                component: (
                    <ProtectedRoute>
                        <DetailIncomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-sales/:id',
                component: (
                    <ProtectedRoute>
                        <DetailSalesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'view-output/:id',
                component: (
                    <ProtectedRoute>
                        <DetailOutputsPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];