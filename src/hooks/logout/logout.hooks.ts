import { useNavigate } from 'react-router'; // Asegúrate de usar 'react-router-dom'

export const useLogout = () => {
  const navigate = useNavigate(); 

  const logout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return { logout };
};