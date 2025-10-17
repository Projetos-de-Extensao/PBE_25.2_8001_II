import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { StatusBadge } from '@/components/portal/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, User, Clock, FileText } from 'lucide-react';

// Mock data
const mockCandidaturas = [
  {
    id: '1',
    disciplina: 'Cálculo I',
    professor: 'Ana Maria Silva',
    dataCandidatura: '10/11/2024',
    status: 'em-analise' as const,
    observacoes: 'Candidatura em processo de avaliação pela coordenação.'
  },
  {
    id: '2',
    disciplina: 'Programação Orientada a Objetos',
    professor: 'Carlos Roberto',
    dataCandidatura: '05/11/2024',
    status: 'aprovada' as const,
    observacoes: 'Parabéns! Sua candidatura foi aprovada. Entre em contato com o professor para combinar os detalhes.'
  },
  {
    id: '3',
    disciplina: 'Estatística Aplicada',
    professor: 'João Pedro Lima',
    dataCandidatura: '01/11/2024',
    status: 'rejeitada' as const,
    observacoes: 'Candidatura não aprovada. Considere aplicar para outras disciplinas ou aprimorar seus conhecimentos na área.'
  },
  {
    id: '4',
    disciplina: 'Contabilidade Geral',
    professor: 'Maria João Santos',
    dataCandidatura: '25/10/2024',
    status: 'recebida' as const,
    observacoes: 'Candidatura recebida com sucesso. Aguarde o processo de análise.'
  }
];

export const MinhasCandidaturas = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const filteredCandidaturas = selectedStatus === 'all' 
    ? mockCandidaturas 
    : mockCandidaturas.filter(c => c.status === selectedStatus);

  if (!user) {
    navigate('/auth/login');
    return null;
  }

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
      case 'rejeitada':
        return 'Considere se candidatar para outras vagas disponíveis.';
      case 'em-analise':
        return 'Aguarde o resultado da análise. Você será notificado por e-mail.';
      default:
        return 'Sua candidatura foi recebida e será analisada em breve.';
    }
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
              Todas ({mockCandidaturas.length})
            </Button>
            <Button 
              variant={selectedStatus === 'recebida' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('recebida')}
            >
              Recebidas ({mockCandidaturas.filter(c => c.status === 'recebida').length})
            </Button>
            <Button 
              variant={selectedStatus === 'em-analise' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('em-analise')}
            >
              Em Análise ({mockCandidaturas.filter(c => c.status === 'em-analise').length})
            </Button>
            <Button 
              variant={selectedStatus === 'aprovada' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('aprovada')}
            >
              Aprovadas ({mockCandidaturas.filter(c => c.status === 'aprovada').length})
            </Button>
            <Button 
              variant={selectedStatus === 'rejeitada' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('rejeitada')}
            >
              Rejeitadas ({mockCandidaturas.filter(c => c.status === 'rejeitada').length})
            </Button>
          </div>
        </div>

        {/* Lista de Candidaturas */}
        <div className="space-y-4">
          {filteredCandidaturas.length > 0 ? (
            filteredCandidaturas.map((candidatura) => (
              <Card key={candidatura.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg wireframe-text">
                        {candidatura.disciplina}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <User className="h-4 w-4" />
                        <span>Prof. {candidatura.professor}</span>
                      </div>
                    </div>
                    <StatusBadge status={candidatura.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Candidatura enviada em {candidatura.dataCandidatura}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-wireframe-light rounded-lg">
                      <h4 className="text-sm font-medium wireframe-text mb-2">Observações:</h4>
                      <p className="text-sm text-muted-foreground">{candidatura.observacoes}</p>
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

                    {candidatura.status === 'rejeitada' && (
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

        {/* Ações Rápidas */}
        <div className="mt-8 wireframe-section">
          <h2 className="wireframe-subheader">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/student/vagas')}>
              Buscar Novas Vagas
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/student/monitores')}>
              Buscar Monitores
            </Button>
            <Button variant="outline" size="sm">
              Dúvidas sobre Monitoria
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};