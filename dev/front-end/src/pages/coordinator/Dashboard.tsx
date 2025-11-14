import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return <Badge className="bg-green-100 text-green-800">Aberta</Badge>;
      case 'em_analise':
        return <Badge className="bg-yellow-100 text-yellow-800">Em Análise</Badge>;
      case 'encerrada':
        return <Badge className="bg-gray-100 text-gray-800">Encerrada</Badge>;
      default:
        return <Badge variant="outline">Status</Badge>;
    }
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const dashboard = {
    estatisticas: { vagasAbertas: 0, candidaturasPendentes: 0, monitoresAtivos: 0, horasRealizadas: 0 },
    vagasRecentes: [],
    candidaturasUrgentes: []
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
          <h1 className="wireframe-header">Dashboard da Coordenação</h1>
          <p className="text-muted-foreground">Visão geral do programa de monitorias</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vagas Abertas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold wireframe-text">{dashboard.estatisticas.vagasAbertas}</div>
              <p className="text-xs text-muted-foreground">+2 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidaturas Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold wireframe-text">{dashboard.estatisticas.candidaturasPendentes}</div>
              <p className="text-xs text-muted-foreground">Aguardando análise</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monitores Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold wireframe-text">{dashboard.estatisticas.monitoresAtivos}</div>
              <p className="text-xs text-muted-foreground">Neste semestre</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Realizadas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold wireframe-text">{dashboard.estatisticas.horasRealizadas}</div>
              <p className="text-xs text-muted-foreground">Este mês: +180h</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vagas Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Vagas de Monitoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.vagasRecentes.map((vaga) => (
                    <div key={vaga.id} className="p-4 border border-wireframe-medium rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium wireframe-text">{vaga.disciplina}</h3>
                          <p className="text-sm text-muted-foreground">{vaga.professor}</p>
                        </div>
                        {getStatusBadge(vaga.status)}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{vaga.candidatos} candidatos</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/coordinator/vaga/${vaga.id}`)}>
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/coordinator/vagas')}>
                    Ver Todas as Vagas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Candidaturas Urgentes */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Candidaturas Requerem Atenção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.candidaturasUrgentes.map((candidatura) => (
                    <div key={candidatura.id} className="p-4 border border-wireframe-medium rounded-lg bg-orange-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <div>
                            <p className="font-medium wireframe-text">{candidatura.aluno}</p>
                            <p className="text-sm text-muted-foreground">{candidatura.disciplina}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-orange-700">{candidatura.diasPendente} dias pendente</p>
                          <p className="text-xs text-muted-foreground">{candidatura.dataCanditatura}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full" onClick={() => navigate('/coordinator/candidatos')}>
                    Analisar Todas as Candidaturas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/coordinator/vagas/nova')}
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Criar Nova Vaga
                </Button>
                
                <Button 
                  onClick={() => navigate('/coordinator/candidatos')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Analisar Candidatos
                </Button>

                {/* Botão 'Gerar Relatórios' removido */}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Performance do Programa</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Taxa de aprovação:</span>
                  <span className="font-medium text-green-600">87%</span>
                </div>
                <div className="flex justify-between">
                  <span>Satisfação dos alunos:</span>
                  <span className="font-medium text-green-600">4.6/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Monitores ativos:</span>
                  <span className="font-medium">35/40 vagas</span>
                </div>
                <div className="flex justify-between">
                  <span>Crescimento mensal:</span>
                  <span className="font-medium text-green-600">+12%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};