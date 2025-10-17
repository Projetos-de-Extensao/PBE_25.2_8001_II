import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="wireframe-placeholder h-16 w-48 mx-auto">
          <span className="text-sm">LOGO IBMEC</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold wireframe-text">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Página não encontrada</p>
        <p className="text-sm text-muted-foreground mb-4">
          A página que você está procurando não existe ou foi movida.
        </p>
        <a href="/" className="text-wireframe-accent underline hover:text-wireframe-dark">
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
