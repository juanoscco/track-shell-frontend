import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import axiosInstance from "@/store/interceptor/token-require.interceptor"
import { useMutation, useQueryClient } from '@tanstack/react-query';

const clientSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    address: z.string().min(1, 'Address is required'),
})

type ClientFormValues = z.infer<typeof clientSchema>

const API_URL = import.meta.env.VITE_API_URL;

const createClient = async (clientData: ClientFormValues): Promise<ClientFormValues> => {
    const response = await axiosInstance.post(`${API_URL}/api/clients`, clientData);
    return response.data;
}

export default function CreateClientPage() {
    const queryClient = useQueryClient();

    const mutation = useMutation<ClientFormValues, Error, ClientFormValues>({
        mutationFn: createClient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            alert('Client created successfully');
        },
        onError: (error: Error) => {
            console.error('Error creating client:', error);
            alert('Failed to create client');
        },
    });

    const form = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            fullName: "",
            address: "",
        },
    });

    function onSubmit(values: ClientFormValues) {
        mutation.mutate(values);
    }

    return (
        <Card className="shadow-none border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Crear Nuevo Cliente</CardTitle>
                <CardDescription>Ingresa los detalles del nuevo cliente</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombres Completos</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Entrar los nombres completos" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Este es el nombre completo del cliente
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Direccion</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Entrar la direccion" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        La direccion del cliente
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Crear Cliente</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}