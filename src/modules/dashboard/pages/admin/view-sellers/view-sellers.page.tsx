import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/store/interceptor/token-require.interceptor'; // Asegúrate de importar tu instancia configurada


import { DataTable } from '@/modules/dashboard/components/data-table';
import { usePagination } from '@/modules/dashboard/components/pagination';

import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = import.meta.env.VITE_API_URL;

interface Seller {
    id: number;
    username: string;
    role: string;
    email: string;
}

interface SellerResponse {
    users: Seller[];
    total: number;
    totalPages: number;
    currentPage: number;
    currentPageSize: number;
}

const columns  = [
    {
        header: 'Username',
        accessor: 'username' as keyof Seller,
    },
    {
        header: 'Email',
        accessor: 'email' as keyof Seller
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: Seller } }) => {
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
                            onClick={() => navigator.clipboard.writeText(seller.id.toString())}
                        >
                            Copy seller Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit seller</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

const SellersList = () => {

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

    // Llamada a la API para obtener los vendedores, pasando pageSize y filter
    const { data, error, isLoading } = useQuery<SellerResponse, Error>({
        queryKey: ['sellers', page, pageSize, filter], // Usa pageSize en la queryKey para que se reactive correctamente
        queryFn: () => getSellers(page, pageSize, filter),
    });

    // Asegúrate de incluir currentPageSize desde los datos de la API
    const { users: sellers, total, totalPages, currentPage } = data || {
        users: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        currentPageSize: 10,
    };


    if (isLoading) return <div>Cargando vendedores...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className='flex flex-col gap-5 p-6'>
            <h1 className='text-2xl font-bold'>Vendedores</h1>
            <DataTable<Seller>
                columns={columns}
                data={sellers}
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
        </div>
    );
};

const getSellers = async (page: number = 1, limit: number = 10, search: string = ''): Promise<SellerResponse> => {
    const response = await axiosInstance.get(`${API_URL}/api/users/get-sellers`, {
        params: {
            page,
            limit,
            search
        }
    });

    return response.data;
};

export default SellersList