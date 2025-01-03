import { UserForm, UserSchema } from '@/modules/dashboard/components/form-user';
import axiosInstance from '@/store/interceptor/token-require.interceptor'; // Importa la instancia configurada
import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

const createAdmin = async (userData: UserSchema): Promise<UserSchema> => {
  const response = await axiosInstance.post(`${API_URL}/api/users/admin`, userData);
  return response.data
}

export default function CreateAdminPage() {
  const queryClient = useQueryClient();

  const mutation = useMutation<UserSchema, Error, UserSchema>({
    mutationFn: createAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      alert('Admin created Successfully')
    },
    onError: (error: Error) => {
      console.error('Error creating seller:', error);
      alert('Failed to create seller. Please try again.');
    },
  })

  const handleSubmit = (data: UserSchema) => {
    mutation.mutate(data);
    // console.log("User Data:", data);
  };
  return (
    <div className='p-6'>
      <h1 className="text-2xl font-bold mb-6">Crear Administrador</h1>
      <UserForm role="admin" onSubmit={handleSubmit} />
    </div>
  )
}
