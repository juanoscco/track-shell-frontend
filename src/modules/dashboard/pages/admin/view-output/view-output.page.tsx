import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/store/interceptor/token-require.interceptor'; // Asegúrate de importar tu instancia configurada

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

interface Output {
  id:string;
  date: string;
  quantity: number;
  user: {
    fullName: string;
  };
  client: {
    fullName: string;
  };
}

interface OutputResponse {
  records: Output[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
}

const columns = [
  // {
  //   header: "Encargado",
  //   cell: ({ row }: { row: { original: Output } }) => row.original.user.fullName,
  // },
  {
    header: "Cliente",
    cell: ({ row }: { row: { original: Output } }) => row.original.client.fullName,
  },
  {
    header: "Cantidad",
    accessor: "quantity" as keyof Output,
  },
  {
    header: "Fecha",
    cell: ({ row }: { row: { original: Output } }) => {
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
    cell: ({ row }: { row: { original: Output } }) => {
      const output = row.original;

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
              onClick={() => navigator.clipboard.writeText(output.date)}
            >
              Copiar fecha
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/dashboard-admin/view-output/${row.original.id}`}>
              Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Editar salida</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function OutputList() {
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

  const { data, error, isLoading } = useQuery<OutputResponse, Error>({
    queryKey: ['outputs', page, pageSize, filter], // Usa pageSize y filter en la queryKey para actualizaciones
    queryFn: () => getOutputs(page, pageSize, filter, decodedToken?.id),
  });

  const { records: outputs, total, totalPages, currentPage } = data || {
    records: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    currentPageSize: 10,
  };

  // console.log(outputs);
  if (isLoading) return <div>Cargando outputs...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/0 md:min-h-min p-6">
      <h1 className="text-2xl font-bold mb-5">Salidas</h1>
      <div className="mt-10">
        <DataTable<Output>
          columns={columns}
          data={outputs}
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

const getOutputs = async (page: number = 1, limit: number = 10, search: string = '', user:string = '1'): Promise<OutputResponse> => {
  const response = await axiosInstance.get(`${API_URL}/api/records/output`, {
    params: {
      page,
      limit,
      search,
      user
    },
  });

  return response.data;
};