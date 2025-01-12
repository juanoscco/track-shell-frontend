// import { Input } from '@/components/ui/input'
import React from "react"
import { AppSidebar } from '../components/sidebar/app-sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    // BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useLocation, useNavigate } from 'react-router'
// import { LucideProps } from "lucide-react"

// import { useDecodedToken } from "@/hooks/decoded-token/decoded-token.hooks"
// import { dataAdmin, dataSeller, dataSuperAdmin } from "../mocks/sidebar.mocks"

// interface NavItem {
//     title: string;
//     url: string;
//     icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
//     isActive?: boolean;
//     items: { title: string; url: string }[]; // Subitems si existen
// }

export function DashboardLayout() {


    const location = useLocation();
    const navigate = useNavigate(); // Hook para navegación cliente
    const currentPath = location.pathname; // Obtiene la URL actual

    // Divide el path en segmentos, ignorando el primer "/" vacío
    const pathSegments = currentPath.split("/").filter(Boolean);

    const handleNavigation = (path: string) => {
        navigate(path); // Navega sin recargar la página
    };

    return (
        <SidebarProvider className=''>
            <AppSidebar />
            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 rounded-lg z-10 ">
                    <div className="flex items-center gap-2 px-4 w-full">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                {pathSegments.map((segment, index) => {
                                    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
                                    const isLast = index === pathSegments.length - 1; // Verificar si es el último segmento

                                    return (
                                        <React.Fragment key={index}>
                                            {/* Mostrar un separador antes de cada item (excepto el primero) */}
                                            {index > 0 && <BreadcrumbSeparator />}
                                            <BreadcrumbItem>
                                                {isLast ? (
                                                    <BreadcrumbPage className="capitalize">
                                                        {segment.replace(/-/g, " ")}
                                                    </BreadcrumbPage>
                                                ) : (
                                                    <button
                                                        className="capitalize"
                                                        onClick={() => handleNavigation(path)}
                                                    >
                                                        {segment.replace(/-/g, " ")}
                                                    </button>
                                                )}
                                            </BreadcrumbItem>
                                        </React.Fragment>
                                    );
                                })}
                            </BreadcrumbList>
                        </Breadcrumb>
                        {/* <Input className='w-full my-6' placeholder='Buscar direccion'/> */}
                    </div>
                </header>
                <section className="flex flex-1 flex-col gap-4  pt-0">
                    <Outlet />
                </section>
            </SidebarInset>
        </SidebarProvider>
    )
}
