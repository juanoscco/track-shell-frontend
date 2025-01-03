import { useState } from "react"
import { Clients, FormRecords, TableClients } from "@/modules/dashboard/components/form-records"
import { Button } from '@/components/ui/button';

interface Client {
  id: number;
  fullName: string;
}

const apiUrl = `${import.meta.env.VITE_API_URL}/api/records/output`; // URL de la API

export default function CreateOutputPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState(1);

  // Función para manejar la selección del cliente
  const handleSelectClient = (id: number, fullName: string) => {
    setClient({ id, fullName });
  };

  const handleBack = () => {
    setClient(null); // Regresar a la selección del cliente
  };

  return (
    <div>
      <h1 className="text-2xl font-bold pl-2">Crear Salida</h1>

      {client === null ? (
        <>
          <div className="flex border-b">
            <Button
              className={`p-4 ${activeTab === 1 ? 'text-gray-500 border-b-2 border-gray-500' : 'text-gray-500'} bg-white shadow-none rounded-none`}
              onClick={() => setActiveTab(1)}
            >
              Crear
            </Button>
            <Button
              className={`p-4 ${activeTab === 2 ? 'text-gray-500 border-b-2 border-gray-500' : 'text-gray-500'} bg-white shadow-none rounded-none`}
              onClick={() => setActiveTab(2)}
            >
              Buscar
            </Button>
          </div>
          {
            activeTab === 1 && (
              <Clients
                onClientCreated={(id: number, fullName: string) =>
                  setClient({ id, fullName })
                }
              />
            )
          }
          {
            activeTab === 2 && (
              <TableClients onClientCreated={handleSelectClient} />
            )
          }

        </>

      ) : (
        <FormRecords clientId={client.id} fullName={client.fullName} onBack={handleBack} apiUrl={apiUrl} type="output" />
      )}
    </div>
  );
}


