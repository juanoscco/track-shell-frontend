import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMutation, useQueryClient } from '@tanstack/react-query'

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

const categorySchema = z.object({
    name: z.string().min(1, "El nombre de la categoría es requerido"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

const API_URL = import.meta.env.VITE_API_URL;

const createCategory = async (categoryData: CategoryFormValues): Promise<CategoryFormValues> => {
    const response = await axiosInstance.post(`${API_URL}/api/categories`, categoryData)
    return response.data
}

export default function CreateCategoryAdmin() {
    const queryClient = useQueryClient();

    const mutation = useMutation<CategoryFormValues, Error, CategoryFormValues>({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            alert('Categoría creada exitosamente')
        },
        onError: (error: Error) => {
            console.error('Error al crear la categoría:', error);
            alert('Error al crear la categoría')
        }
    })

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
        },
    })

    function onSubmit(values: CategoryFormValues) {
        mutation.mutate(values);
    }

    return (
        <Card className="shadow-none border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Crear Nuevo Material</CardTitle>
                <CardDescription>Ingresa el nombre de la nueva categoría</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Material</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingresa el nombre de la categoría" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Este es el nombre del material que se mostrará.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Crear Material</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

