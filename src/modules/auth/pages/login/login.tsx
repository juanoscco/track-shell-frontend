import { AuthLayout } from '@/modules/auth/layout'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useNavigate } from 'react-router'
import axios from 'axios'

import { useMutation } from '@tanstack/react-query'
import { LoginForm } from '@/modules/auth/components/form'

import { jwtDecode } from 'jwt-decode';

interface LoginFormData {
    username: string
    password: string
}
interface DecodedToken {
    role: string;  // Ajusta el nombre del campo según tu token real
}
export default function Login() {

    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: (data: LoginFormData) => axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, data),
        onSuccess: (data) => {
            const token = data.data.token;
            localStorage.setItem('token', token);

            try {
                // Decodifica el token
                const decoded: DecodedToken = jwtDecode(token);

                // Redirecciona según el rol del usuario
                switch (decoded.role) {
                    case 'superadmin':
                        navigate('/dashboard-superadmin');
                        break;
                    case 'admin':
                        navigate('/dashboard-admin');
                        break;
                    case 'seller':
                        navigate('/dashboard-seller');
                        break;
                    default:
                        navigate('/dashboard');  // Ruta por defecto
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        },
        onError: (error) => {
            console.error('Login failed:', error);
            // Maneja el error (mostrar mensaje, etc.)
        },
    });
    const handleSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };
    return (
        <AuthLayout>
            <Card className="w-full max-w-md bg-gray-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tus credenciales para acceder
                    </CardDescription>
                </CardHeader>
                <CardContent >
                    <LoginForm onSubmit={handleSubmit} isLoading={loginMutation.isPending} />
                </CardContent>
            </Card>
        </AuthLayout>
    )
}
