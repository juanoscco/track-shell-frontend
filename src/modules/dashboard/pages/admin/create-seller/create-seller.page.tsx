import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/store/interceptor/token-require.interceptor'; // Importa la instancia configurada
import { UserForm, UserSchema } from '@/modules/dashboard/components/form-user';

const API_URL = import.meta.env.VITE_API_URL;

const createSeller = async (userData: UserSchema): Promise<UserSchema> => {
  const response = await axiosInstance.post(`${API_URL}/api/users/seller`, userData);
  return response.data;
};

export default function CreateSellerPage() {
  const queryClient = useQueryClient();

  const mutation = useMutation<UserSchema, Error, UserSchema>({
    mutationFn: createSeller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller'] });
      alert('Seller created successfully!');
    },
    onError: (error: Error) => {
      console.error('Error creating seller:', error);
      alert('Failed to create seller. Please try again.');
    },
  });

  const handleSubmit = (data: UserSchema) => {
    mutation.mutate(data);
    console.log(data);
  };

  return (
    <div className="p-6"> {/* Padding al contenedor */}
      <h1 className="text-2xl font-bold mb-6">Crear Vendedor</h1>
      <UserForm role="seller" onSubmit={handleSubmit} />
    </div>
  );
}