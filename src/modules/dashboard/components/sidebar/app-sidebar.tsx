import * as React from "react"
import { Command, LucideProps } from "lucide-react"

import { NavMain } from "../nav/nav-main"
// import { NavProjects } from "../nav/nav-projects"
// import { NavSecondary } from "../nav/nav-secondary"
import { NavUser } from "../nav/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { dataAdmin, dataSeller, dataSuperAdmin } from "../mocks/sidebar.mocks"
import { useDecodedToken } from "@/hooks/decoded-token/decoded-token.hooks"
import { Link } from "react-router"

interface NavItem {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  isActive?: boolean;
  items: { title: string; url: string }[]; // Subitems si existen
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const token = localStorage.getItem('token');

  const { data: decodedToken, isLoading, error } = useDecodedToken(token);

  // Definir la lista de navegación según el rol
  let navItems: NavItem[]; // Definir el tipo de navItems
  switch (decodedToken?.role) {
    case 'superadmin':
      navItems = dataSuperAdmin.navMain;
      break;
    case 'admin':
      navItems = dataAdmin.navMain;
      break;
    case 'seller':
      navItems = dataSeller.navMain;
      break;
    default:
      navItems = [];
      break;
  }
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <Link to={decodedToken?.role === "admin" ? "/dashboard-admin" : decodedToken?.role === "superadmin" ? "/dashboard-superadmin" : "/dashboard-seller"}>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{decodedToken?.storeName}</span>
                    <span className="truncate text-xs">{decodedToken?.storeId === 1 ? "Empresa" : "Tienda"}</span>
                  </div>
                </Link>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {decodedToken ? (
          <NavUser username={decodedToken.fullName} role={decodedToken.role} />
        ) : (
          <div>No user data available</div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
