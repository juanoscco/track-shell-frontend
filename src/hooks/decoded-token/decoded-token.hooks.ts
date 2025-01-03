import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

// Define la estructura esperada del token decodificado
export interface DecodedToken {
    id: string;
    username: string;
    role: string;
    storeId: number;
    storeName: string;
    fullName:string;
    iat: number;
    exp: number;
}

// Hook personalizado
export const useDecodedToken = (token: string | null) => {
    return useQuery({
        queryKey: ['decodedToken', token], // Usa la misma clave si el token no cambia
        queryFn: () => {
            if (!token) throw new Error('No token provided');
            return jwtDecode<DecodedToken>(token);
        },
        enabled: !!token, // Evita la ejecución si el token es null o undefined
        staleTime: 1000 * 60 * 5, // Opcional: el tiempo antes de que los datos se consideren obsoletos
    });
};

