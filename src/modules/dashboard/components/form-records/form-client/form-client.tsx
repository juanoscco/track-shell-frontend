import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/store/interceptor/token-require.interceptor";

// Zod schema para validación
const clientSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().optional(),
});

// Tipos derivados del esquema de Zod
type ClientFormValues = z.infer<typeof clientSchema>;

// Función para crear un cliente
const createClient = async (clientData: ClientFormValues): Promise<ClientFormValues & { id: number }> => {
  const API_URL = import.meta.env.VITE_API_URL;
  const response = await axiosInstance.post(`${API_URL}/api/clients`, clientData);
  return response.data;
};

interface ClientsProps {
  onClientCreated: (clientId: number, fullName: string) => void;
}

export function Clients({ onClientCreated }: ClientsProps) {
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // React Query para manejar la mutación de datos
  const mutation = useMutation<ClientFormValues & { id: number; fullName: string }, Error, ClientFormValues>({
    mutationFn: createClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onClientCreated(data.id, data.fullName); // Pasar id y fullName
    },
    onError: (error) => {
      console.error("Error creating client:", error);
    },
  });

  // Configuración de React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = (data: ClientFormValues) => {
    setLoading(true);
    mutation.mutate(data, {
      onSettled: () => setLoading(false),
    });
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Crear Cliente</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Campo de nombre completo */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombres completos</Label>
            <Input type="text" id="fullName" placeholder="Entrar los nombres completos" {...register("fullName")} />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>
          {/* Campo de dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">Direccion</Label>
            <Input type="text" id="address" placeholder="Entrar la direccion"  {...register("address")} />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Cliente"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}