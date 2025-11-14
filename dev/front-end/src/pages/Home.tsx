import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  Search,
  FileSearch,
  Users,
  BookOpen,
  BarChart3,
  UserCheck,
  Calendar
} from 'lucide-react';

export const Home = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  // Atualiza o usuário ao entrar no Home para refletir mudanças de papel (ex: aluno -> monitor)
  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const getWelcomeMessage = () => {
    switch (user.tipo_usuario) {
      case 'monitor':
        return 'Gerencie suas sessões de monitoria e ajude outros alunos';
      case 'coordenador':
        return 'Administre o programa de monitorias da instituição';
      case 'professor':
        return 'Avalie candidatos e acompanhe seus monitores';
      default:
        return 'Encontre vagas de monitoria ou busque ajuda acadêmica';
    }
  };

  const getStudentActions = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/student/vagas')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <Search className="h-5 w-5" />
            <span>Procurar Vagas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Veja vagas abertas e candidate-se às monitorias
          </p>
          <Button size="sm">Vagas</Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/student/candidaturas')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <FileSearch className="h-5 w-5" />
            <span>Minhas Candidaturas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Acompanhe o status das suas candidaturas realizadas
          </p>
          <Button size="sm">Candidaturas</Button>
        </CardContent>
      </Card>
    </div>
  );

  const getMonitorActions = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/monitor/dashboard')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <BarChart3 className="h-5 w-5" />
            <span>Dashboard do Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Visão geral das suas atividades e estatísticas
          </p>
          <Button size="sm">Ver Dashboard</Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/monitor/agenda')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <Calendar className="h-5 w-5" />
            <span>Gerenciar Agenda</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Configure seus horários disponíveis para monitoria
          </p>
          <Button size="sm">Ver Agenda</Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/monitor/sessoes')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <UserCheck className="h-5 w-5" />
            <span>Registrar Atividades</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Registre presença e atividades das sessões
          </p>
          <Button size="sm">Registrar</Button>
        </CardContent>
      </Card>
    </div>
  );

  const getCoordinatorActions = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/coordinator/vagas')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <FileSearch className="h-5 w-5" />
            <span>Gerenciar Vagas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Crie e gerencie vagas de monitoria
          </p>
          <Button size="sm">Ver Vagas</Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/coordinator/candidatos')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <Users className="h-5 w-5" />
            <span>Analisar Candidatos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Avalie candidaturas e selecione monitores
          </p>
          <Button size="sm">Ver Candidatos</Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/coordinator/relatorios')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <BarChart3 className="h-5 w-5" />
            <span>Relatórios</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Gere relatórios e estatísticas do programa
          </p>
          <Button size="sm">Ver Relatórios</Button>
        </CardContent>
      </Card>
    </div>
  );

  const getProfessorActions = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/professor/dashboard')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <BookOpen className="h-5 w-5" />
            <span>Área do Professor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Avalie candidaturas e acompanhe monitores</p>
          <Button size="sm">Entrar</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">

      <Header 
        userName={user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email_institucional}
        userRole={user.tipo_usuario}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div className="academic-layout py-6">
        {/* Welcome Section */}

        <div className="mb-8">
          <h1 className="wireframe-header">
            Olá, {user.first_name || user.email_institucional.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground text-lg">{getWelcomeMessage()}</p>
        </div>

        {/* Main Actions */}
        <div className="mb-8">
          <h2 className="wireframe-subheader">Ações Principais</h2>
          {user.tipo_usuario === 'aluno' && getStudentActions()}
          {user.tipo_usuario === 'monitor' && getMonitorActions()}
          {user.tipo_usuario === 'coordenador' && getCoordinatorActions()}
          {user.tipo_usuario === 'professor' && getProfessorActions()}
        </div>

      </div>
    </div>
  );
};