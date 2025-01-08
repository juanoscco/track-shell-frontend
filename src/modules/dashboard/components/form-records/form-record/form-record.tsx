import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, UserIcon } from "lucide-react";
import { useApiPost } from "@/hooks/use-api-url";
import { useDecodedToken } from "@/hooks/decoded-token";

import axiosInstance from "@/store/interceptor/token-require.interceptor";
import { useQuery } from '@tanstack/react-query';
import { PrescriptionGrid } from "../prescription-grid/";
import { PrescriptionOtherGrid } from "../prescription-other-grid";

const API_URL = import.meta.env.VITE_API_URL;

interface Category {
    id: number;
    name: string;
}

interface CategoryResponse {
    categories: Category[];
    total: number;
    totalPages: number;
    currentPage: number;
    currentPageSize: number;
}


// Esquema de validación con Zod
const outputSchema = z.object({
    date: z.string().nonempty("La fecha es obligatoria"),
    categoryId: z.number(),
    bag: z.array(
        z.object({
            sphId: z
                .number()
                .min(-100, "SPH mínimo es -100")
                .max(100, "SPH máximo es 100")
                .refine(
                    (value) =>
                        Number.isFinite(value) && Math.round(value * 100) / 100 === value,
                    { message: "SPH debe tener hasta dos decimales" }
                ),
            cylId: z
                .number()
                .min(-200, "CYL mínimo es -200")
                .max(200, "CYL máximo es 200")
                .refine(
                    (value) =>
                        Number.isFinite(value) && Math.round(value * 100) / 100 === value,
                    { message: "CYL debe tener hasta dos decimales" }
                ),
            quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
        })
    ),
    clientId: z.number(),
    quantity: z.number(),
    userId: z.number(),
});

interface OutputProps {
    clientId: number;
    fullName: string;
    onBack: () => void;
    apiUrl: string;
    type: string;
}

export function FormRecords({ clientId, fullName, onBack, apiUrl, type }: OutputProps) {

    const token = localStorage.getItem('token');

    const { data: decodedToken } = useDecodedToken(token);

    const userId = Number(decodedToken?.id) || undefined;

    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("1");

    // 
    const { data, error, isLoading } = useQuery<CategoryResponse, Error>({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
    });

    const { categories = [] } = data || {};

    // 
    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<z.infer<typeof outputSchema>>({
        resolver: zodResolver(outputSchema),
        defaultValues: {
            date: "",
            categoryId: 1,
            bag: [],
            clientId,
            quantity: 0,
            userId,
        },
    });

    const bag = watch("bag");
    const totalQuantity = useMemo(
        () => bag.reduce((sum, item) => sum + (item.quantity || 0), 0),
        [bag]
    );

    const handlePrescriptionChange = useCallback(
        (values: Array<{ sphId: number; cylId: number; quantity: number }>) => {
            // Convertir a enteros y renombrar los campos para que coincidan con el esquema esperado
            const integerValues = values.map(item => ({
                sphId: Math.round(item.sphId),   // Renombrar sphId a sphId
                cylId: Math.round(item.cylId),   // Renombrar cylId a cylId
                quantity: Math.floor(item.quantity), // Asegurarte de que quantity sea un entero
            }));
        
            // Actualizar los valores del formulario solo si son diferentes
            if (JSON.stringify(integerValues) !== JSON.stringify(bag)) {
                setValue("bag", integerValues, { shouldValidate: true });
            }
        },
        [bag, setValue]
    );

    const onSubmit = (data: z.infer<typeof outputSchema>) => {
        const outputData = {
            ...data,
            date: new Date(data.date).toISOString(),
        };
        console.log("Output submitted:", outputData);
        sendOutputData(outputData);
    };

    const sendOutputData = useApiPost({
        url: apiUrl, // Se pasa la URL como prop
        onSuccess: () => {
            alert("Datos enviados correctamente");
            onBack(); // Regresar a la selección del cliente después del éxito
        },
        onError: (error) => {
            console.error("Error al enviar los datos:", error);
            alert("Error al enviar los datos");
        }
    });

    // Actualizamos quantity con el totalQuantity
    useEffect(() => {
        setValue("quantity", totalQuantity);
    }, [totalQuantity, setValue]);


    return (
        <Card className="w-full border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center">
                    <UserIcon className="mr-2" />
                    Cliente: {fullName}
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date">Fecha</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    {...register("date")}
                                    id="date"
                                    aria-label="Fecha"
                                    type="datetime-local"
                                    className="pl-10"
                                />
                                {errors.date && <p className="text-red-500">{errors.date.message}</p>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="categoryId">Material</label>
                            <Controller
                                control={control}
                                name="categoryId"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(parseInt(value));
                                            setSelectedCategoryId(value);
                                        }}
                                        value={field.value?.toString()}
                                    >
                                        <SelectTrigger aria-label="Categoría">
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoading ? (
                                                <SelectItem value="loading" disabled>Cargando...</SelectItem>
                                            ) : error ? (
                                                <SelectItem value="error" disabled>Error al cargar categorías</SelectItem>
                                            ) : (
                                                categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.categoryId && <p className="text-red-500">{errors.categoryId.message}</p>}
                        </div>
                    </div>
                    {
                        type === "income" ?
                            (
                                <PrescriptionGrid onValueChange={handlePrescriptionChange} />
                            ) :
                            (
                                <PrescriptionOtherGrid onValueChange={handlePrescriptionChange} category={selectedCategoryId} />
                            )
                    }
                    {errors.bag && <p className="text-red-500">{errors.bag.message}</p>}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 rounded-b-lg p-6">
                    <span className="text-lg font-semibold mb-4 sm:mb-0">
                        Cantidad Total: {totalQuantity}
                    </span>
                    <div className="space-x-4">
                        <Button type="button" variant="outline" onClick={onBack}>
                            Atrás
                        </Button>
                        <Button type="submit" className="">
                            Enviar
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}


const getCategories = async (page: number = 1, limit: number = 100, search: string = ''): Promise<CategoryResponse> => {
    const response = await axiosInstance.get(`${API_URL}/api/categories`, {
        params: {
            page, limit, search
        }
    });
    return response.data;
};