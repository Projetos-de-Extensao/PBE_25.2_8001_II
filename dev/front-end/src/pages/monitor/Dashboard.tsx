import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  BookOpen,
  CalendarDays,
  UserCheck
} from 'lucide-react';

export const Dashboard = () => {
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

  const monitor = {
    proximasSessoes: [],
    estatisticas: { sessoesMes: 0, alunosAtendidos: 0, horasRealizadas: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userName={user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email_institucional}
        userRole={user.tipo_usuario}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div className="academic-layout py-6">
        <div className="mb-6">
          <h1 className="wireframe-header">Dashboard do Monitor</h1>
          <p className="text-muted-foreground">Bem-vindo de volta, {user.first_name || user.email_institucional.split('@')[0]}!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões neste mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold wireframe-text">{monitor.estatisticas.sessoesMes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alunos atendidos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold wireframe-text">{monitor.estatisticas.alunosAtendidos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas realizadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold wireframe-text">{monitor.estatisticas.horasRealizadas}h</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próximas Sessões */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Próximas Sessões Agendadas</CardTitle>
              </CardHeader>
              <CardContent>
                {monitor.proximasSessoes.length > 0 ? (
                  <div className="space-y-3">
                    {monitor.proximasSessoes.map((sessao) => (
                      <div key={sessao.id} className="p-4 border border-wireframe-medium rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <UserCheck className="h-4 w-4 text-wireframe-accent" />
                              <span className="font-medium wireframe-text">{sessao.aluno}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{sessao.disciplina}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <CalendarDays className="h-3 w-3" />
                                <span>{sessao.data}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{sessao.horario}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm wireframe-text">Tópicos:</p>
                            <p className="text-sm text-muted-foreground">{sessao.topicos}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Nenhuma sessão agendada</p>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Sidebar - Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/monitor/agenda')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Gerenciar Agenda
                </Button>
                
                <Button 
                  onClick={() => navigate('/monitor/sessoes')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Registrar Atividades
                </Button>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};