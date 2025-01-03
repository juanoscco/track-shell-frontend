import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/store/interceptor/token-require.interceptor'; // Asegúrate de importar tu instancia configurada

const API_URL = import.meta.env.VITE_API_URL;

import { DataTable } from '@/modules/dashboard/components/data-table';
import { usePagination } from '@/modules/dashboard/components/pagination';
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface Admin {
    id: number
    username: string
    password: string
    role: string
    isActive: boolean
    fullName: string
    dni: string
    phone: string
    address: string
    email: string
}

interface AdminResponse {
    users: Admin[];
    total: number;
    totalPages: number;
    currentPage: number;
    currentPageSize: number;
}



const columns = [
    {
        accessor: "fullName" as keyof Admin,
        header: "Nombre" ,
    },
    {
        accessor: "email" as keyof Admin,
        header: "Email",
    },
    {
        accessor: "phone" as keyof Admin,
        header: "Teléfono",
    },
    {
        accessor: "dni" as keyof Admin,
        header: "DNI",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: Admin } }) => {
            const seller = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(seller.email.toString())}
                        >
                            Copy seller Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit admin</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

const AdminsList = () => {
    const {
        page,
        pageSize,
        search,
        filter,
        setSearch,
        handlePageChange,
        handlePageSizeChange,
        handleSearch,
    } = usePagination({
        initialPageSize: 10,
        initialPage: 1,
    });

    const { data, error, isLoading } = useQuery<AdminResponse, Error>({
        queryKey: ['admins', page, pageSize, filter],
        queryFn: () => getAdmins(page, pageSize, filter),
    })

    const { users: admins, total, totalPages, currentPage } = data || {
        users: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        currentPageSize: 10,
    };
    console.log(admins);
    if (isLoading) return <div>Cargando Administradores...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    return (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/0 md:min-h-min p-6">
            <h1 className="text-2xl font-bold mb-5">Administradores</h1>


            <section className="mt-10">
                <DataTable<Admin>
                    columns={columns}
                    data={admins}
                    total={total}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    filter={search}
                    setFilter={setSearch}
                    handleSearch={handleSearch}
                    onPageSizeChange={handlePageSizeChange}
                />
            </section>

        </div>
    )
}


// Función para obtener los vendedores
const getAdmins = async (page: number = 1, limit: number = 10, search: string = ''): Promise<AdminResponse> => {
    const response = await axiosInstance.get(`${API_URL}/api/users/get-admins`, {
        params: {
            page, limit, search
        }
    });
    return response.data;
};

export default AdminsList