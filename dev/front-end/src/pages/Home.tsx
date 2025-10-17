import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  FileSearch, 
  Calendar, 
  Users, 
  BookOpen, 
  BarChart3,
  UserCheck,
  Clock
} from 'lucide-react';

export const Home = () => {
  const { user, logout } = useAuth();
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

  const getWelcomeMessage = () => {
    switch (user.role) {
      case 'monitor':
        return 'Gerencie suas sessões de monitoria e ajude outros alunos';
      case 'coordinator':
        return 'Administre o programa de monitorias da instituição';
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
            <span>Procurar Vaga de Monitoria</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Encontre oportunidades de monitoria em diversas disciplinas
          </p>
          <Button size="sm">Buscar Vagas</Button>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/student/monitores')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <Users className="h-5 w-5" />
            <span>Buscar Ajuda de um Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Agende sessões de monitoria para tirar suas dúvidas
          </p>
          <Button size="sm">Buscar Monitores</Button>
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

      <Card className="cursor-pointer hover:bg-wireframe-light transition-colors" onClick={() => navigate('/monitor/materiais')}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 wireframe-text">
            <BookOpen className="h-5 w-5" />
            <span>Meus Materiais</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Organize e compartilhe materiais de estudo
          </p>
          <Button size="sm">Ver Materiais</Button>
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

  const getQuickLinks = () => {
    const commonLinks = [
      { label: 'Meus Agendamentos', href: '/agendamentos', icon: Clock },
    ];

    if (user.role === 'student') {
      return [
        ...commonLinks,
        { label: 'Minhas Candidaturas', href: '/student/candidaturas', icon: FileSearch },
      ];
    }

    if (user.role === 'monitor') {
      return [
        ...commonLinks,
        { label: 'Meus Feedbacks', href: '/monitor/feedbacks', icon: Users },
      ];
    }

    return commonLinks;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={user.nome} 
        userRole={user.role}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div className="academic-layout py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="wireframe-header">Olá, {user.nome.split(' ')[0]}!</h1>
          <p className="text-muted-foreground text-lg">{getWelcomeMessage()}</p>
        </div>

        {/* Main Actions */}
        <div className="mb-8">
          <h2 className="wireframe-subheader">Ações Principais</h2>
          {user.role === 'student' && getStudentActions()}
          {user.role === 'monitor' && getMonitorActions()}
          {user.role === 'coordinator' && getCoordinatorActions()}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="wireframe-subheader">Acesso Rápido</h2>
          <div className="flex flex-wrap gap-2">
            {getQuickLinks().map((link, index) => (
              <Button 
                key={index}
                variant="outline" 
                size="sm"
                onClick={() => navigate(link.href)}
                className="flex items-center space-x-1"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Activity / Notifications */}
        <div className="wireframe-section">
          <h2 className="wireframe-subheader">Avisos e Notificações</h2>
          <div className="space-y-3">
            <div className="p-3 bg-wireframe-light rounded border-l-4 border-wireframe-dark">
              <p className="text-sm wireframe-text">
                <strong>Novo:</strong> Sistema de avaliação de monitores implementado
              </p>
              <p className="text-xs text-muted-foreground">Há 2 dias</p>
            </div>
            <div className="p-3 bg-wireframe-light rounded border-l-4 border-wireframe-medium">
              <p className="text-sm wireframe-text">
                Período de inscrições para monitoria do próximo semestre: 15-30 de dezembro
              </p>
              <p className="text-xs text-muted-foreground">Há 1 semana</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};