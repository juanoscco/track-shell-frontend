import { useState } from "react"
import { Clients, FormRecords, TableClients } from "@/modules/dashboard/components/form-records"
// import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface Client {
  id: number;
  fullName: string;
}

const apiUrl = `${import.meta.env.VITE_API_URL}/api/records/income`;

export default function CreateIncomePage() {
  const [client, setClient] = useState<Client | null>(null);
  // const [activeTab, setActiveTab] = useState(1);

  // Función para manejar la selección del cliente
  const handleSelectClient = (id: number, fullName: string) => {
    setClient({ id, fullName });
  };

  const handleBack = () => {
    setClient(null); // Regresar a la selección del cliente
  };
  return (
    <>
      {client === null ? (
        <div className="p-4 flex flex-col gap-4">
          <h1 className="text-2xl font-bold px-3">Crear entrada</h1>
          <Tabs defaultValue="create" className="w-full ">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Crear</TabsTrigger>
              <TabsTrigger value="search">Buscar</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <Clients
                onClientCreated={(id: number, fullName: string) =>
                  setClient({ id, fullName })
                }
              />
            </TabsContent>
            <TabsContent value="search">
              <TableClients onClientCreated={handleSelectClient} />
            </TabsContent>
          </Tabs>
        </div>

      ) : (
        <FormRecords clientId={client.id} fullName={client.fullName} onBack={handleBack} apiUrl={apiUrl} type="income" />
      )}
    </>
  )
}
