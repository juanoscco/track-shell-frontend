import { HomeSellerPage, CreateSalesPageSeller, ListSalesSeller } from "@/modules/dashboard/pages/";
import { DashboardLayout } from "../../layouts";
import { ProtectedRoute } from "@/hooks/protected-route";


export const sellerRoutes = [
    {
        path: "/dashboard-seller",
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
                        <HomeSellerPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "create-sales-seller",
                component: (
                    <ProtectedRoute>
                        <CreateSalesPageSeller />
                    </ProtectedRoute>
                ),
            },
            {
                path: "view-sales-seller",
                component: (
                    <ProtectedRoute>
                        <ListSalesSeller />
                    </ProtectedRoute>
                ),
            },
        ],
    },
];
