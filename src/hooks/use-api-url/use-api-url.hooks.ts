import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/store/interceptor/token-require.interceptor';

interface UseApiPostOptions<T> {
  url: string;
  onSuccess: (data: T) => void;
  onError: (error: Error) => void;
}

export const useApiPost = <T>(options: UseApiPostOptions<T>) => {
  const { url, onSuccess, onError } = options;

  const { mutate } = useMutation<T, Error, T>({
    mutationFn: (data: T) => axiosInstance.post(url, data),
    onSuccess: (data) => onSuccess(data),
    onError: (error) => onError(error),
  });

  return mutate;
};