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

interface Store {
  id: number;
  name: string;
  location: string;
}

interface StoreResponse {
  stores: Store[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
}

const columns = [
  
  {
    accessor: "name" as keyof Store,
    header: "Tienda",
  },
  {
    accessor: "location" as keyof Store,
    header: "Lugar",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: Store } }) => {
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
              onClick={() => navigator.clipboard.writeText(category.location.toString())}
            >
              Copiar direccion
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function ListStore() {
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

  const { data, error, isLoading } = useQuery<StoreResponse, Error>({
    queryKey: ['store', page, pageSize, filter], // Identifica la consulta
    queryFn: () => getStores(page, pageSize, filter), // Llama a la función para obtener los datos
  });

  const { stores: store, total, totalPages, currentPage } = data || {
    stores: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    currentPageSize: 10,
  };

  ;
  if (isLoading) return <div>Cargando...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/0 md:min-h-min p-6">
      <h1 className="text-2xl font-bold mb-5">Tiendas</h1>

      <section className="mt-10">
        <DataTable<Store>
          columns={columns}
          data={store}
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

// Función para obtener las categorías
const getStores = async (page: number = 1, limit: number = 10, search: string = ''): Promise<StoreResponse> => {
  const response = await axiosInstance.get(`${API_URL}/api/stores`, {
    params: {
      page, limit, search
    }
  });
  return response.data;
};