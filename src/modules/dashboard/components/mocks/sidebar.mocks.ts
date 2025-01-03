import {
    UserPlus,
    Users,
    DollarSign,
    BoxIcon,
    Clipboard,
    LifeBuoy,
    Send,
    Briefcase,
    MapPin,
    SquareTerminal,
    SquareChartGantt,
    Weight
} from "lucide-react"
export const dataAdmin = {
    navMain: [
        {
            title: "Vendedores",
            url: "#",
            icon: Users, // Icono para mostrar una lista de usuarios (vendedores)
            isActive: true,
            items: [
                {
                    title: "Crear",
                    url: "/dashboard-admin/create-seller",
                },
                {
                    title: "Lista",
                    url: "/dashboard-admin/view-seller",
                },
            ],
        },
        {
            title: "Clientes",
            url: "#",
            icon: UserPlus, // Icono para agregar un nuevo cliente
            items: [
                {
                    title: "Crear",
                    url: "/dashboard-admin/create-client",
                },
                {
                    title: "Lista",
                    url: "/dashboard-admin/view-clients",
                },
            ],
        },
        {
            title: "Materiales",
            url: "#",
            icon: BoxIcon, // Icono de caja para productos
            isActive: false,
            items: [
                {
                    title: "Crear",
                    url: "/dashboard-admin/create-material",
                },
                {
                    title: "Lista",
                    url: "/dashboard-admin/view-materials",
                },
            ],
        },
        {
            title: "Ventas",
            url: "#",
            icon: DollarSign, // Icono relacionado con ventas
            isActive: false,
            items: [
                {
                    title: "Crear",
                    url: "/dashboard-admin/create-sales",
                },
                {
                    title: "Historial",
                    url: "/dashboard-admin/view-sales",
                },
            ],
        },

        {
            title: "Ingreso",
            url: "#",
            icon: SquareChartGantt, // Icono de ingreso de productos
            isActive: false,
            items: [
                {
                    title: "Crear",
                    url: "/dashboard-admin/create-income",
                },
                {
                    title: "Historial",
                    url: "/dashboard-admin/view-income",
                },
            ],
        },
        {
            title: "Salida",
            url: "#",
            icon: Weight, // Icono de ingreso de productos
            isActive: false,
            items: [
                {
                    title: "Crear",
                    url: "/dashboard-admin/create-output",
                },
                {
                    title: "Historial",
                    url: "/dashboard-admin/view-output",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy, // Icono de soporte
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send, // Icono de retroalimentación
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Briefcase, // Icono de diseño y proyectos (trabajo)
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: Clipboard, // Icono relacionado con ventas y marketing
        },
        {
            name: "Travel",
            url: "#",
            icon: MapPin, // Icono relacionado con viajes
        },
    ],
}


export const dataSuperAdmin = {
    navMain: [
        {
            title: "Tienda",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Crear",
                    url: "/dashboard-superadmin/create-store",
                },
                {
                    title: "Lista",
                    url: "/dashboard-superadmin/view-store",
                },

            ],
        },
        {
            title: "Admin",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Crear",
                    url: "/dashboard-superadmin/create-admin",
                },
                {
                    title: "Lista",
                    url: "/dashboard-superadmin/view-admin",
                },

            ],
        },
    ]
}

export const dataSeller = {
    navMain: [
        {
            title: "Ventas",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Crear",
                    url: "#",
                },
                {
                    title: "Lista",
                    url: "#",
                },

            ],
        },
        
    ]
}