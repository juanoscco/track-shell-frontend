import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/store/interceptor/token-require.interceptor';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/modules/dashboard/components/data-table';
import { usePagination } from '@/modules/dashboard/components/pagination';

const API_URL = import.meta.env.VITE_API_URL;

interface Client {
  id: number;
  fullName: string;
  address: string;
}

interface ClientResponse {
  clients: Client[],
  total: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
}

const columns = (handleSelectClient: (id: number, fullName: string) => void) => [
  {
    accessor: "fullName" as keyof Client,
    header: "Nombre Completo",
  },
  {
    accessor: "address" as keyof Client,
    header: "Dirección"
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }: { row: { original: Client } }) => {
      const client = row.original;

      return (
        <Button
          variant="outline"
          onClick={() => handleSelectClient(client.id, client.fullName)} // Selecciona el cliente al hacer clic
        >
          Seleccionar
        </Button>
      );
    },
  },
];


export  function TableClients({ onClientCreated }: { onClientCreated: (id: number, fullName: string) => void }) {
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

  const { data, error, isLoading } = useQuery<ClientResponse, Error>({
    queryKey: ['clients', page, pageSize, filter],
    queryFn: () => getClients(page, pageSize, filter),
  });

  const { clients, total, totalPages, currentPage } = data || {
    clients: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
    currentPageSize: 10,
  };


  if (isLoading) return <div>Cargando Clientes...</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/0 md:min-h-min p-6">
      <h1 className="text-2xl font-bold mb-5">Clientes</h1>

      <section className="mt-10">
        <DataTable<Client>
          columns={columns(onClientCreated)}
          data={clients}
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
const getClients = async (page: number = 1, limit: number = 10, search: string = ''): Promise<ClientResponse> => {
  const response = await axiosInstance.get(`${API_URL}/api/clients`, {
    params: {
      page, limit, search
    }
  });
  return response.data;
};