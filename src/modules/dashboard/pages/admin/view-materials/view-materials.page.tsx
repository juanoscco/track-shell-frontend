import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/store/interceptor/token-require.interceptor';
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
import { DataTable } from '@/modules/dashboard/components/data-table';
import { usePagination } from '@/modules/dashboard/components/pagination';

const API_URL = import.meta.env.VITE_API_URL;

interface Category {
    id: number;
    name: string;
}

interface CategoryResponse {
    categories: Category[];
    total: number;
    totalPages: number;
    currentPage: number;
    currentPageSize: number;
}

const columns = [

    {
        accessor: "name" as keyof Category,
        header: "Nombre",
    },
    {
        id: "actions",
        header: "Acciones",
        cell: ({ row }: { row: { original: Category } }) => {
            const category = row.original

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
                            onClick={() => navigator.clipboard.writeText(category.name.toString())}
                        >
                            Copiar nombre
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];



const MaterialList = () => {
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
    const { data, error, isLoading } = useQuery<CategoryResponse, Error>({
        queryKey: ['categories', page, pageSize, filter], 
        queryFn: () => getCategories(page, pageSize, filter),
    });

    const { categories: categories, total, totalPages, currentPage } = data || {
        categories: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        currentPageSize: 10,
    };

    if (isLoading) return <div>Cargando materiales...</div>;
    if (error instanceof Error) return <div>Error: {error.message}</div>;

    return (
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/0 md:min-h-min p-6">
            <h1 className="text-2xl font-bold mb-5">Materiales</h1>

            <section className="mt-10">
                <DataTable<Category>
                    columns={columns}
                    data={categories}
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
    );
};

const getCategories = async (page: number = 1, limit: number = 10, search: string = ''): Promise<CategoryResponse> => {
    const response = await axiosInstance.get(`${API_URL}/api/categories`, {
        params: {
            page, limit, search
        }
    });
    return response.data;
};
export default MaterialList;