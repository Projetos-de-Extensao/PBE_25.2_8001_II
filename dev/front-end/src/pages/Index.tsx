import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  // Loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="wireframe-placeholder h-16 w-48 mx-auto">
          <span className="text-sm">LOGO IBMEC</span>
        </div>
        <h1 className="wireframe-header">Portal de Monitorias Ibmec</h1>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
