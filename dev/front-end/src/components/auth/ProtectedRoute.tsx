import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Array<'aluno' | 'monitor' | 'professor' | 'coordenador'>;
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, refreshUser } = useAuth();
  const [retrying, setRetrying] = useState(false);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Carregando…</div>;
  }
  if (!isAuthenticated || !user) return <Navigate to="/auth/login" replace />;

  if (roles && roles.length > 0 && !roles.includes(user.tipo_usuario)) {
    if (!retrying) {
      setRetrying(true);
      // tenta atualizar o usuário (ex: promoção aluno->monitor)
      void refreshUser().finally(() => setRetrying(false));
      return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Atualizando acesso…</div>;
    }
    // usuário autenticado, mas sem permissão para esta rota após refresh
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};
