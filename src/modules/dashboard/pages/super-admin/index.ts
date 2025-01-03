import React from "react";

export const HomeSuperAdminPage = React.lazy(() => import("./home/home-super-admin.page"))
export const CreateAdminPage = React.lazy(() => import("./create-admin/create-admin.page"))
export const ViewAdminPage = React.lazy(() => import("./view-admin/view-admin.page"))
export const ViewStorePage = React.lazy(() => import("./view-store/view-store.page"))
export const CreateStorePage = React.lazy(() => import("./create-store/create-store.page"))