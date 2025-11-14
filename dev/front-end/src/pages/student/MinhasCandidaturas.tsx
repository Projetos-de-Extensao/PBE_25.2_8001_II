import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { StatusBadge } from '@/components/portal/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, User, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';

type Candidatura = {
  id: number;
  monitoria: number;
  monitoria_titulo: string;
  disciplina_nome: string;
  status: 'pendente' | 'aprovada' | 'reprovada' | 'cancelada';
  data_candidatura: string; // ISO
  data_avaliacao?: string | null;
  observacoes_aluno?: string | null;
  observacoes_coordenador?: string | null;
};

interface PaginatedCandidaturas {
  count: number;
  next: string | null;
  previous: string | null;
  results: Candidatura[];
}

export const MinhasCandidaturas = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [candidaturas, setCandidaturas] = useState<PaginatedCandidaturas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedApproval, setCheckedApproval] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data: PaginatedCandidaturas = await api.candidaturas.list();
        setCandidaturas(data);
        // Se houver alguma aprovada, atualiza usuário e redireciona para painel do monitor
        const anyApproved = Array.isArray((data as any).results)
          ? (data as any).results.some((c: any) => c.status === 'aprovada')
          : Array.isArray(data)
          ? (data as any).some((c: any) => c.status === 'aprovada')
          : false;
        if (anyApproved && !checkedApproval) {
          const updated = await refreshUser();
          setCheckedApproval(true);
          if (updated?.tipo_usuario === 'monitor') {
            navigate('/monitor/dashboard');
          }
        }
      } catch (e: any) {
        setError('Não foi possível carregar suas candidaturas.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [checkedApproval, navigate, refreshUser]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const candList = candidaturas?.results || [];
  const filteredCandidaturas = selectedStatus === 'all' 
    ? candList 
    : candList.filter(c => c.status === selectedStatus);

  const displayName = user ? `${user.first_name} ${user.last_name}`.trim() || user.email_institucional : 'Usuário';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      case 'em-analise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextSteps = (status: string) => {
    switch (status) {
      case 'aprovada':
        return 'Entre em contato com o professor para iniciar as atividades de monitoria.';
      case 'reprovada':
        return 'Considere se candidatar para outras vagas disponíveis.';
      case 'pendente':
        return 'Aguarde o resultado da análise. Você será notificado por e-mail.';
      default:
        return 'Sua candidatura foi recebida e será analisada em breve.';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={displayName}
        userRole={user?.tipo_usuario}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div className="academic-layout py-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/home')}>
            ← Voltar ao Home
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="wireframe-header">Minhas Candidaturas</h1>
          <p className="text-muted-foreground">
            Acompanhe o status das suas candidaturas para monitoria
          </p>
        </div>

        {/* Filtros */}
        <div className="wireframe-section mb-6">
          <h2 className="wireframe-subheader">Filtrar por Status</h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('all')}
            >
              Todas ({candList.length})
            </Button>
            <Button 
              variant={selectedStatus === 'pendente' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('pendente')}
            >
              Pendentes ({candList.filter(c => c.status === 'pendente').length})
            </Button>
            <Button 
              variant={selectedStatus === 'aprovada' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('aprovada')}
            >
              Aprovadas ({candList.filter(c => c.status === 'aprovada').length})
            </Button>
            <Button 
              variant={selectedStatus === 'reprovada' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('reprovada')}
            >
              Reprovadas ({candList.filter(c => c.status === 'reprovada').length})
            </Button>
            <Button 
              variant={selectedStatus === 'cancelada' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('cancelada')}
            >
              Canceladas ({candList.filter(c => c.status === 'cancelada').length})
            </Button>
          </div>
        </div>

        {/* Lista de Candidaturas */}
        <div className="space-y-4">
          {loading ? (
            <div className="wireframe-section text-center py-8">
              <p className="text-muted-foreground">Carregando suas candidaturas...</p>
            </div>
          ) : error ? (
            <div className="wireframe-section text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredCandidaturas.length > 0 ? (
            filteredCandidaturas.map((candidatura) => (
              <Card key={candidatura.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg wireframe-text">
                        {candidatura.monitoria_titulo}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <User className="h-4 w-4" />
                        <span>{candidatura.disciplina_nome}</span>
                      </div>
                    </div>
                    <StatusBadge status={candidatura.status as any} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        {(() => {
                          const d = new Date(candidatura.data_candidatura);
                          const safeDate = isNaN(d.getTime()) ? candidatura.data_candidatura : format(d, 'dd/MM/yyyy');
                          return <span>Candidatura enviada em {safeDate}</span>;
                        })()}
                      </div>
                    </div>

                    <div className="p-3 bg-wireframe-light rounded-lg">
                      <h4 className="text-sm font-medium wireframe-text mb-2">Observações:</h4>
                      <p className="text-sm text-muted-foreground">
                        {candidatura.observacoes_coordenador || candidatura.observacoes_aluno || (
                          candidatura.status === 'pendente'
                            ? 'Candidatura recebida e aguardando análise.'
                            : candidatura.status === 'aprovada'
                            ? 'Parabéns! Sua candidatura foi aprovada.'
                            : candidatura.status === 'reprovada'
                            ? 'Candidatura não aprovada.'
                            : 'Candidatura cancelada.'
                        )}
                      </p>
                    </div>

                    <div className="p-3 bg-wireframe-light rounded-lg border-l-4 border-wireframe-accent">
                      <h4 className="text-sm font-medium wireframe-text mb-2">Próximos Passos:</h4>
                      <p className="text-sm text-muted-foreground">{getNextSteps(candidatura.status)}</p>
                    </div>

                    {candidatura.status === 'aprovada' && (
                      <div className="flex space-x-2">
                        <Button size="sm">
                          <User className="h-4 w-4 mr-2" />
                          Contatar Professor
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Detalhes da Vaga
                        </Button>
                      </div>
                    )}

                    {candidatura.status === 'reprovada' && (
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => navigate('/student/vagas')}>
                          Ver Outras Vagas
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="wireframe-section text-center py-8">
              <h3 className="wireframe-subheader">Nenhuma candidatura encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {selectedStatus === 'all' 
                  ? 'Você ainda não se candidatou para nenhuma vaga de monitoria.'
                  : `Não há candidaturas com status "${selectedStatus}".`
                }
              </p>
              <Button onClick={() => navigate('/student/vagas')}>
                Buscar Vagas de Monitoria
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};