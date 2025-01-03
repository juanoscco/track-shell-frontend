
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


const storeSchema = z.object({
    name: z.string().min(1, "El nombre de la tienda es requerido"),
    location: z.string().min(1, "La ubicación de la tienda es requerida"),
})

type StoreFormValues = z.infer<typeof storeSchema>
const API_URL = import.meta.env.VITE_API_URL;

const createStore = async (storeDate: StoreFormValues): Promise<StoreFormValues> => {
    const response = await axiosInstance.post(`${API_URL}/api/stores`, storeDate)
    return response.data
}

export default function CreateStoreAdmin() {
    const queryStore = useQueryClient();

    const mutation = useMutation<StoreFormValues, Error, StoreFormValues>({
        mutationFn: createStore,
        onSuccess: () => {
            queryStore.invalidateQueries({ queryKey: ['stores'] });
            alert('store created sucessfully')
        },
        onError: (error: Error) => {
            console.error('Error creating store:', error);
            alert('Failet to created store')
        }
    })

    const form = useForm<StoreFormValues>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: "",
            location: "",
        },
    })

    function onSubmit(values: StoreFormValues) {
        
        mutation.mutate(values);
    }

    return (
        <Card className="shadow-none border-none">
            <CardHeader>
                <CardTitle>Crear Nueva Tienda</CardTitle>
                <CardDescription>Ingresa los detalles de tu nueva tienda</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de la Tienda</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingresa el nombre de la tienda" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Este es el nombre público de tu tienda.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ubicación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingresa la ubicación de la tienda" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        La dirección o ubicación de tu tienda.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Crear Tienda</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
