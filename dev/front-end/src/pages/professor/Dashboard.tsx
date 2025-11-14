import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ClipboardList, CheckCircle2 } from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => navigate('/auth/profile');

  return (
    <div className="min-h-screen bg-background">
      <Header userName={user.first_name + ' ' + (user.last_name || '')} userRole={user.tipo_usuario} onLogout={handleLogout} onProfile={handleProfile} />

      <div className="academic-layout py-6">
        <div className="mb-6">
          <h1 className="wireframe-header">Dashboard do Professor</h1>
          <p className="text-muted-foreground">Área do professor para avaliar candidatos e acompanhar monitores</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="cursor-pointer" onClick={() => navigate('/professor/candidaturas')}>
            <CardHeader>
              <CardTitle className="wireframe-text flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Avaliar Candidaturas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Veja candidaturas pendentes para suas disciplinas e registre avaliações.
            </CardContent>
          </Card>

          <Card className="cursor-pointer" onClick={() => navigate('/professor/horas')}>
            <CardHeader>
              <CardTitle className="wireframe-text flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Meus Monitores</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Acompanhe os monitores vinculados às suas disciplinas.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="wireframe-text flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Validação de Horas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Aprove/reprove horas registradas pelos monitores.</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
