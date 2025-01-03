import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token"); // O usa otro método para obtener el token

  if (!token) {
    // Si no hay token, redirige a la página de inicio de sesión
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderiza el componente
  return children;
};