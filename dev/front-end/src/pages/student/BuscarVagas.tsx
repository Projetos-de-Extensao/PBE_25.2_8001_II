import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { VagaCard } from '@/components/portal/VagaCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';

type Vaga = {
  id: number;
  disciplina_nome: string;
  coordenador_nome: string;
  vagas: number;
  titulo: string;
  status: 'aberta' | 'em_analise' | 'encerrada';
};

export const BuscarVagas = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.monitorias.abertas();
        setVagas(data);
      } catch (e) {
        setError('Não foi possível carregar as vagas.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const handleVagaClick = (vagaId: string) => {
    navigate(`/student/vaga/${vagaId}`);
  };

  const filteredVagas = useMemo(() => vagas.filter((vaga) => {
    const matchesSearch = !searchQuery || 
      vaga.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaga.disciplina_nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaga.coordenador_nome.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }), [vagas, searchQuery]);

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
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/home')}>
            ← Voltar ao Home
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="wireframe-header">Buscar Vagas de Monitoria</h1>
          <p className="text-muted-foreground">
            Encontre oportunidades de monitoria disponíveis em diversas disciplinas
          </p>
        </div>

        {/* Search and Filters */}
        <div className="wireframe-section mb-6">
          <h2 className="wireframe-subheader">Buscar Vagas</h2>
          
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium">Buscar por disciplina, título ou coordenador</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Digite para buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Mostrando {filteredVagas.length} de {vagas.length} vagas</span>
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSearchQuery('')}
              >
                Limpar busca
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="wireframe-subheader">Vagas Disponíveis</h2>
          
          {filteredVagas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredVagas.map((vaga) => (
                <VagaCard
                  key={vaga.id}
                  disciplina={vaga.disciplina_nome}
                  professor={vaga.coordenador_nome}
                  vagas={vaga.vagas}
                  status={vaga.status === 'aberta' ? 'ativa' : 'encerrada'}
                  onClick={() => handleVagaClick(String(vaga.id))}
                />
              ))}
            </div>
          ) : (
            <div className="wireframe-section text-center py-8">
              <p className="text-muted-foreground mb-4">
                Nenhuma vaga encontrada com a busca atual
              </p>
              <Button 
                variant="outline"
                onClick={() => setSearchQuery('')}
              >
                Ver todas as vagas
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 wireframe-section">
          <h2 className="wireframe-subheader">Ações Rápidas</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/student/candidaturas')}>
              Ver Minhas Candidaturas
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/student/vagas')}>
              Ver Kanban de Monitorias
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};