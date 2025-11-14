import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Pause, 
  Play,
  Users,
  Calendar,
  Filter,
  X
} from 'lucide-react';

// Status alinhados ao backend: aberta, fechada, cancelada
const statusOptions = ['Todos', 'Aberta', 'Fechada', 'Cancelada'];

export const Vagas = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  useEffect(() => {
    const loadVagas = async () => {
      try {
        const data = await api.monitorias.list();
        setVagas(data.results || data);
      } catch (error) {
        console.error('Erro ao carregar monitorias:', error);
        toast({
          title: 'Erro ao carregar vagas',
          description: 'Não foi possível carregar as vagas de monitoria.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    loadVagas();
  }, []);

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
      case 'fechada':
        return <Badge className="bg-gray-100 text-gray-800">Fechada</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge variant="outline">Status</Badge>;
    }
  };

  const handleToggleStatus = async (vagaId: string, currentStatus: string) => {
    // Toggle entre aberta e fechada. Cancelada não é reativada aqui.
    const newStatus = currentStatus === 'fechada' ? 'aberta' : 'fechada';
    // Atualiza otimista
    setVagas(vagas.map(v => v.id === vagaId ? { ...v, status: newStatus } : v));
    try {
      await api.monitorias.update(Number(vagaId), { status: newStatus });
      toast({
        title: `Vaga ${newStatus === 'aberta' ? 'reativada' : 'fechada'}`,
        description: newStatus === 'aberta' ? 'A vaga voltou a aceitar candidaturas.' : 'A vaga foi fechada temporariamente.'
      });
    } catch (error) {
      // Reverte em caso de falha
      setVagas(vagas.map(v => v.id === vagaId ? { ...v, status: currentStatus } : v));
      toast({
        title: 'Erro ao atualizar status',
        description: 'Não foi possível salvar a alteração.',
        variant: 'destructive'
      });
    }
  };

  const handleCancelar = async (vagaId: string, currentStatus: string) => {
    if (!confirm('Confirmar cancelamento permanente desta vaga?')) return;
    const previous = currentStatus;
    setVagas(vagas.map(v => v.id === vagaId ? { ...v, status: 'cancelada' } : v));
    try {
      await api.monitorias.update(Number(vagaId), { status: 'cancelada' });
      toast({ title: 'Vaga cancelada', description: 'A vaga foi marcada como cancelada.' });
    } catch (error) {
      setVagas(vagas.map(v => v.id === vagaId ? { ...v, status: previous } : v));
      toast({ title: 'Erro ao cancelar', description: 'Falha ao cancelar a vaga.', variant: 'destructive' });
    }
  };

  const vagasFiltradas = vagas.filter(vaga => {
    const matchBusca = vaga.disciplina_nome?.toLowerCase().includes(busca.toLowerCase()) ||
                      vaga.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
                      vaga.coordenador_nome?.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'Todos' || 
                       (filtroStatus === 'Aberta' && vaga.status === 'aberta') ||
                       (filtroStatus === 'Fechada' && vaga.status === 'fechada') ||
                       (filtroStatus === 'Cancelada' && vaga.status === 'cancelada');
    return matchBusca && matchStatus;
  });

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email_institucional}
        userRole={user.tipo_usuario}
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
                            <h3 className="font-medium wireframe-text">{vaga.titulo || vaga.disciplina_nome}</h3>
                            <p className="text-sm text-muted-foreground">{vaga.coordenador_nome}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{vaga.candidatos} candidatos para {vaga.vagasTotal} vaga{vaga.vagasTotal !== 1 ? 's' : ''}</span>
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
                          
                          {(vaga.status === 'aberta' || vaga.status === 'fechada') && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleStatus(vaga.id, vaga.status)}
                            >
                              {vaga.status === 'fechada' ? (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Reabrir
                                </>
                              ) : (
                                <>
                                  <Pause className="h-4 w-4 mr-1" />
                                  Fechar
                                </>
                              )}
                            </Button>
                          )}
                          {vaga.status !== 'cancelada' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelar(vaga.id, vaga.status)}
                            >
                              <X className="h-4 w-4 mr-1" /> Cancelar
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
                      {busca || filtroStatus !== 'Todos'
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