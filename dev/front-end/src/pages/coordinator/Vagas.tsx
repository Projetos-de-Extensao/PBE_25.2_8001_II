import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Pause, 
  Play,
  Users,
  Calendar,
  Filter
} from 'lucide-react';

// Mock data - in real app would fetch from API
const mockVagas = [
  {
    id: '1',
    disciplina: 'Cálculo I',
    professor: 'Prof. Ana Silva',
    departamento: 'Matemática',
    vagasTotal: 3,
    candidatos: 8,
    status: 'aberta',
    dataInicio: '2024-11-15',
    dataFim: '2024-12-01',
    cargaHoraria: '20h/semana'
  },
  {
    id: '2', 
    disciplina: 'Programação I',
    professor: 'Prof. João Costa',
    departamento: 'Computação',
    vagasTotal: 2,
    candidatos: 12,
    status: 'em_analise',
    dataInicio: '2024-11-10',
    dataFim: '2024-11-25',
    cargaHoraria: '15h/semana'
  },
  {
    id: '3',
    disciplina: 'Estatística Aplicada',
    professor: 'Prof. Maria Lima',
    departamento: 'Matemática',
    vagasTotal: 2,
    candidatos: 6,
    status: 'aberta',
    dataInicio: '2024-11-20',
    dataFim: '2024-12-05',
    cargaHoraria: '20h/semana'
  },
  {
    id: '4',
    disciplina: 'Física I',
    professor: 'Prof. Carlos Santos',
    departamento: 'Física',
    vagasTotal: 4,
    candidatos: 15,
    status: 'pausada',
    dataInicio: '2024-11-01',
    dataFim: '2024-11-30',
    cargaHoraria: '25h/semana'
  },
  {
    id: '5',
    disciplina: 'Contabilidade Geral',
    professor: 'Prof. Paula Oliveira',
    departamento: 'Administração',
    vagasTotal: 2,
    candidatos: 4,
    status: 'encerrada',
    dataInicio: '2024-10-15',
    dataFim: '2024-11-15',
    cargaHoraria: '15h/semana'
  }
];

const departamentos = ['Todos', 'Matemática', 'Computação', 'Física', 'Administração', 'Engenharia'];
const statusOptions = ['Todos', 'Aberta', 'Em Análise', 'Pausada', 'Encerrada'];

export const Vagas = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vagas, setVagas] = useState(mockVagas);
  const [busca, setBusca] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('Todos');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

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
      case 'pausada':
        return <Badge className="bg-orange-100 text-orange-800">Pausada</Badge>;
      case 'encerrada':
        return <Badge className="bg-gray-100 text-gray-800">Encerrada</Badge>;
      default:
        return <Badge variant="outline">Status</Badge>;
    }
  };

  const handleToggleStatus = (vagaId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pausada' ? 'aberta' : 'pausada';
    setVagas(vagas.map(vaga => 
      vaga.id === vagaId ? { ...vaga, status: newStatus } : vaga
    ));
    
    toast({
      title: `Vaga ${newStatus === 'aberta' ? 'reativada' : 'pausada'}`,
      description: `A vaga foi ${newStatus === 'aberta' ? 'reativada e está recebendo candidaturas' : 'pausada temporariamente'}.`,
    });
  };

  const vagasFiltradas = vagas.filter(vaga => {
    const matchBusca = vaga.disciplina.toLowerCase().includes(busca.toLowerCase()) ||
                      vaga.professor.toLowerCase().includes(busca.toLowerCase());
    const matchDepartamento = filtroDepartamento === 'Todos' || vaga.departamento === filtroDepartamento;
    const matchStatus = filtroStatus === 'Todos' || 
                       (filtroStatus === 'Aberta' && vaga.status === 'aberta') ||
                       (filtroStatus === 'Em Análise' && vaga.status === 'em_analise') ||
                       (filtroStatus === 'Pausada' && vaga.status === 'pausada') ||
                       (filtroStatus === 'Encerrada' && vaga.status === 'encerrada');
    
    return matchBusca && matchDepartamento && matchStatus;
  });

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={user.nome} 
        userRole={user.role}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div className="academic-layout py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="outline" onClick={() => navigate('/coordinator/dashboard')}>
              ← Voltar ao Dashboard
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="wireframe-header">Gerenciar Vagas de Monitoria</h1>
          <p className="text-muted-foreground">Crie e gerencie as vagas de monitoria da instituição</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar - Filtros */}
          <div className="space-y-6">
            {/* Novo Vaga */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Nova Vaga</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/coordinator/vagas/nova')} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Vaga
                </Button>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Departamento</label>
                  <Select value={filtroDepartamento} onValueChange={setFiltroDepartamento}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Resumo</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Total de vagas:</span>
                  <span className="font-medium">{vagas.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vagas ativas:</span>
                  <span className="font-medium">{vagas.filter(v => v.status === 'aberta').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Em análise:</span>
                  <span className="font-medium">{vagas.filter(v => v.status === 'em_analise').length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total candidaturas:</span>
                  <span className="font-medium">{vagas.reduce((sum, v) => sum + v.candidatos, 0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por disciplina ou professor..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de Vagas */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">
                  Vagas de Monitoria
                  <Badge variant="outline" className="ml-2">
                    {vagasFiltradas.length} resultado{vagasFiltradas.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vagasFiltradas.length > 0 ? (
                  <div className="space-y-4">
                    {vagasFiltradas.map((vaga) => (
                      <div key={vaga.id} className="p-4 border border-wireframe-medium rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium wireframe-text">{vaga.disciplina}</h3>
                            <p className="text-sm text-muted-foreground">{vaga.professor} • {vaga.departamento}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{vaga.candidatos} candidatos para {vaga.vagasTotal} vaga{vaga.vagasTotal !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Prazo: {vaga.dataFim}</span>
                              </div>
                              <span>• {vaga.cargaHoraria}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(vaga.status)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/coordinator/vaga/${vaga.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Candidatos
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/coordinator/vagas/editar/${vaga.id}`)}
                              disabled={vaga.status === 'encerrada'}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </div>
                          
                          {(vaga.status === 'aberta' || vaga.status === 'pausada') && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleStatus(vaga.id, vaga.status)}
                            >
                              {vaga.status === 'pausada' ? (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Reativar
                                </>
                              ) : (
                                <>
                                  <Pause className="h-4 w-4 mr-1" />
                                  Pausar
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {busca || filtroDepartamento !== 'Todos' || filtroStatus !== 'Todos'
                        ? 'Nenhuma vaga encontrada com os filtros aplicados'
                        : 'Nenhuma vaga cadastrada ainda'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};