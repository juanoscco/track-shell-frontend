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
import { Link } from 'react-router';

const API_URL = import.meta.env.VITE_API_URL;

interface Income {
  id: string; // ID del ingreso
  date: string; // Fecha del ingreso
  quantity: number; // Total de cantidad
  user: {
    id: number;
    username: string;
    fullName: string;
  };
  client: {
    id: number;
    fullName: string;
    address: string;
  };
  category: {
    id: number;
    name: string;
  };
  bags: {
    id: number;
    category: {
      id: number;
      name: string;
    };
    quantity: number;
    sph: string;
    cyl: string;
  }[];
}
interface IncomeResponse {
  records: Income[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
}

const columns = [
  // {
  //   header: "Encargado",
  //   cell: ({ row }: { row: { original: Income } }) => row.original.user.fullName,
  // },
  {
    header: "Cliente",
    cell: ({ row }: { row: { original: Income } }) => row.original.client.fullName,
  },
  {
    header: "Material",
    cell: ({ row }: { row: { original: Income } }) => row.original.category.name,
  },
  {
    header: "Total de cantidad",
    accessor: "quantity" as keyof Income,
  },
  {
    header: "Fecha",
    cell: ({ row }: { row: { original: Income } }) => {
      const date = new Date(row.original.date);
      return date.toLocaleString("es-ES", {
        year: "numeric",
        month: "numeric", // Mes completo (ejemplo: "diciembre")
        day: "numeric", // Día del mes       
      });
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: Income } }) => {
      const income = row.original;

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
              onClick={() => navigator.clipboard.writeText(income.id)}
            >
              Copiar identificador
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/dashboard-admin/view-income/${row.original.id}`}>
                Ver Detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Editar Ingreso</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ListIncome() {
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

  const { data, error, isLoading } = useQuery<IncomeResponse, Error>({
    queryKey: ['incomes', page, pageSize, filter], // Usa pageSize en la queryKey para que se reactive correctamente
    queryFn: () => getIncomes(page, pageSize, filter),
  });

  // Asegúrate de incluir currentPageSize desde los datos de la API
  const { records: incomes, total, totalPages, currentPage } = data || {
    records: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    currentPageSize: 10,
  };


  if (isLoading) return <div>Cargando vendedores...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/0 md:min-h-min p-6">
      <h1 className="text-2xl font-bold mb-5">Entradas</h1>
      <div className='mt-10'>
        <DataTable<Income>
          columns={columns}
          data={incomes}
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
    </div>
  )
}

const getIncomes = async (page: number = 1, limit: number = 10, search: string = ''): Promise<IncomeResponse> => {
  const response = await axiosInstance.get(`${API_URL}/api/records/income`, {
    params: {
      page,
      limit,
      search
    }
  });

  return response.data;
};