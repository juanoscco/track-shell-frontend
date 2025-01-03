import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { useDecodedToken } from "@/hooks/decoded-token";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useQuery } from '@tanstack/react-query';
import axiosInstance from "@/store/interceptor/token-require.interceptor";

interface Store {
    id: number;
    name: string;
    location: string;
}

interface StoresResponse {
    total: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    stores: Store[];
}
interface FetchStoresParams {
    page?: number;
    limit?: number;
    search?: string;
}
type UserFormProps = {
    role: "superadmin" | "admin" | "seller";
    onSubmit: (data: UserSchema) => void;
};

const userSchema = z.object({
    username: z
        .string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .regex(/^\S+$/, "El nombre de usuario no debe contener espacios"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    fullName: z.string().optional(),
    dni: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    email: z.string().email("Correo electrónico inválido").optional(),
    isActive: z.boolean().default(true),
    role: z.enum(["superadmin", "admin", "seller"]).optional(),
    storeId: z.number(),
});

export type UserSchema = z.infer<typeof userSchema>;

// ***
const API_URL = import.meta.env.VITE_API_URL;


const fetchStores = async ({ page = 1, limit = 10, search = '' }: FetchStoresParams): Promise<StoresResponse> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);

    const response = await axiosInstance.get(`${API_URL}/api/stores?${params.toString()}`);
    return response.data; // Devuelve el objeto completo con metadata y tiendas
};

// ***
export const UserForm: React.FC<UserFormProps> = ({ role, onSubmit }) => {
    const token = localStorage.getItem("token"); // Recupera el token del almacenamiento local
    const { data: decodedToken } = useDecodedToken(token); // Decodifica el token utilizando el hook

    const [isDecoded, setIsDecoded] = React.useState(false); // Flag to check if the token is decoded

    const { data, isLoading, error } = useQuery({
        queryKey: ['stores', {}],
        queryFn: () => fetchStores({}),
    });



    const form = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            password: "",
            fullName: "",
            dni: "",
            phone: "",
            address: "",
            email: "",
            isActive: true,
            role: role,
            storeId: role === "admin" || role === "seller" ? decodedToken?.storeId : undefined,
        },
    });

    const { reset } = form;


    // Wait for decodedToken to be available and then update the form values
    React.useEffect(() => {
        if (decodedToken) {
            setIsDecoded(true);
            form.reset({
                ...form.getValues(),
                storeId: decodedToken.storeId, // Update storeId after decoding the token
            });
        }
    }, [decodedToken, form]);

    if (!isDecoded) {
        return <div>Loading...</div>; // Show loading while decoding
    }

    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error al cargar las tiendas.</div>;
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => {
                onSubmit(data);
                reset();
            })}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de usuario</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre de usuario" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Contraseña" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre completo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dni"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>DNI</FormLabel>
                                <FormControl>
                                    <Input placeholder="DNI" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input placeholder="Teléfono" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                    <Input placeholder="Dirección" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo electrónico</FormLabel>
                                <FormControl>
                                    <Input placeholder="Correo electrónico" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {role === "admin" && (
                        <FormField
                            control={form.control}
                            name="storeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Selecciona una tienda</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(parseInt(value, 10))}
                                        defaultValue={field.value?.toString() || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione una tienda" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Array.isArray(data?.stores) && data?.stores.length > 0 ? (
                                                data?.stores
                                                    .map((store: Store) => (
                                                        <SelectItem key={store.id} value={store.id.toString()}>
                                                            {store.name}
                                                        </SelectItem>
                                                    ))
                                            ) : (
                                                <SelectItem value="" disabled>No hay tiendas disponibles</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Cuenta activa</FormLabel>
                                    <FormDescription>
                                        Esta cuenta está activa y puede ser utilizada.
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                </div>
                <Button type="submit" className="w-full mt-6 p-8">
                    Crear {role === "superadmin" ? "Superadministrador" : role === "admin" ? "Administrador" : "Vendedor"}
                </Button>
            </form>
        </Form>
    );
};