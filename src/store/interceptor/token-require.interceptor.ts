import axios from 'axios';

// Crea y configura una instancia de Axios
const axiosInstance = axios.create();

// Configura los interceptores
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ajusta el nombre de tu clave de token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;