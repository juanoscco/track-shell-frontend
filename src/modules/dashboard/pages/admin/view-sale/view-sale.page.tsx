import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/store/interceptor/token-require.interceptor';

import { DataTable } from '@/modules/dashboard/components/data-table';
import { usePagination } from '@/modules/dashboard/components/pagination';

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router';
import { useDecodedToken } from "@/hooks/decoded-token/decoded-token.hooks"

const API_URL = import.meta.env.VITE_API_URL;

interface Sales {
  id: string;
  date: string;
  quantity: number;
  user: {
    fullName: string;
  };
  client: {
    fullName: string;
  };
  category: {
    name: string;
  };
}

interface SalesResponse {
  records: Sales[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
}

const columns = [
  // {
  //   header: "Encargado",
  //   cell: ({ row }: { row: { original: Sales } }) => row.original.user.fullName,
  // },
  {
    header: "Cliente",
    cell: ({ row }: { row: { original: Sales } }) => row.original.client.fullName,
  },
  {
    header: "Material",
    cell: ({ row }: { row: { original: Sales } }) => row.original.category.name,
  },
  {
    header: "Total de cantidad",
    accessor: "quantity" as keyof Sales,
  },
  {
    header: "Fecha",
    cell: ({ row }: { row: { original: Sales } }) => {
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
    header: "Acciones",
    cell: ({ row }: { row: { original: Sales } }) => {
      const sale = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(sale.date)}
            >
              Copiar fecha
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/dashboard-admin/view-sales/${row.original.id}`}>
                Ver Detalles
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Editar venta</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function SalesList() {
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
  const token = localStorage.getItem('token');

  const { data: decodedToken } = useDecodedToken(token);
  const { data, error, isLoading } = useQuery<SalesResponse, Error>({
    queryKey: ['sales', page, pageSize, filter],
    queryFn: () => getSales(page, pageSize, filter, decodedToken?.id),
  });

  const { records: sales, total, totalPages, currentPage } = data || {
    records: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    currentPageSize: 10,
  };

  if (isLoading) return <div>Cargando ventas...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/0 md:min-h-min p-6">
      <h1 className="text-2xl font-bold mb-5">Ventas</h1>
      <div className='mt-10'>
        <DataTable<Sales>
          columns={columns}
          data={sales}
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
  );
}

const getSales = async (page: number = 1, limit: number = 10, search: string = '', user: string = "1"): Promise<SalesResponse> => {
  const response = await axiosInstance.get(`${API_URL}/api/records/sale`, {
    params: {
      page,
      limit,
      search,
      user
    },
  });

  return response.data;
};