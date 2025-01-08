import { RecordDetail } from "../record-detail/record-detail.components";
import axiosInstance from "@/store/interceptor/token-require.interceptor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTableBags } from "../data-table-bags";
// import { ScrollArea } from "@/components/ui/scroll-area";

const API_URL = import.meta.env.VITE_API_URL;

interface RecordDetail {
  id: string;
  date: string;
  type: string;
  quantity: number;
  user: {
    fullName: string;
    email: string;
    role: string;
  };
  client: {
    fullName: string;
    address: string;
  };
  category: {
    name: string;
  };
  bags: {
    id: number;
    quantity: number;
    sph: { value: string };
    cyl: { value: string };
  }[];
}

const fetchRecordDetail = async (id: string): Promise<RecordDetail> => {
  const { data } = await axiosInstance.get<RecordDetail>(`${API_URL}/api/records/${id}`);
  return data;
};



export function DetailPropsPage({ id }: { id: string }) {


  return (
    <RecordDetail<RecordDetail>
      id={id}
      fetcher={fetchRecordDetail}
      renderDetails={(data) => (
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Detalles del Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Información General</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">ID del Registro:</span> {data.id}
                  </p>
                  <p>
                    <span className="font-medium">Tipo:</span> {data.type}
                  </p>
                  <p>
                    <span className="font-medium">Cantidad:</span> {data.quantity}
                  </p>
                  <p>
                    <span className="font-medium">Fecha:</span> {data.date}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Información del Usuario</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Nombre:</span> {data.user.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Correo Electrónico:</span> {data.user.email}
                  </p>
                  <p>
                    <span className="font-medium">Rol:</span> {data.user.role}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Información del Cliente</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Nombre:</span> {data.client.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Dirección:</span> {data.client.address}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Categoría</h3>
                <Badge variant="secondary">{data.category.name}</Badge>
              </div>
            </div>
            {/* <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Bolsas</h3>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  {data.bags.map((bag) => (
                    <Card key={bag.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="text-right">
                            <p>SPH: {bag.sph.value}</p>
                            <p>CYL: {bag.cyl.value}</p>
                          </div>
                          <div>
                            <p>Cantidad: {bag.quantity}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div> */}

            <DataTableBags bags={data.bags} />

              
          </CardContent>
        </Card>
      )}
    />
  );
}