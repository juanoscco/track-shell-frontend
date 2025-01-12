import { Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { adminRoutes, sellerRoutes, superAdminRoutes } from '@/modules/dashboard/routes';
import { authRoute } from '@/modules/auth/routes';

interface RouteType {
  path: string;
  component: React.ReactNode;
  children?: RouteType[];
  index?: boolean
}

import { Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      className={cn("flex items-center justify-center min-h-screen", className)}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin",
          {
            "h-4 w-4": size === "sm",
            "h-8 w-8": size === "md",
            "h-12 w-12": size === "lg",
          }
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}



function App() {

  // Combinando todas las rutas en una sola variable
  const allRoutes: RouteType[] = [
    ...authRoute,        // Rutas de autenticación
    ...adminRoutes,      // Rutas de administrador
    ...sellerRoutes,     // Rutas de vendedor
    ...superAdminRoutes  // Rutas de superadministrador
  ];

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {allRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.component}>
            {route.children?.map((child, childIndex) => (
              <Route
                key={childIndex}
                path={child.path}
                index={child.index}
                element={child.component}
              />
            ))}
          </Route>
        ))}
      </Routes>
    </Suspense>
  );
}

export default App;