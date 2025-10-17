import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { VagaCard } from '@/components/portal/VagaCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Search } from 'lucide-react';

// Mock data
const mockVagas = [
  {
    id: '1',
    disciplina: 'Cálculo I',
    professor: 'Ana Maria Silva',
    vagas: 2,
    prazo: '15/12/2024',
    cargaHoraria: '8h/semana',
    area: 'Exatas',
    campus: 'RJ',
    status: 'ativa' as const,
    descricao: 'Monitoria focada em derivadas, integrais e limites. Experiência prévia desejável.'
  },
  {
    id: '2',
    disciplina: 'Programação Orientada a Objetos',
    professor: 'Carlos Roberto',
    vagas: 1,
    prazo: '20/12/2024',
    cargaHoraria: '6h/semana',
    area: 'Tecnologia',
    campus: 'SP',
    status: 'ativa' as const,
    descricao: 'Auxílio em Java, conceitos de OOP e desenvolvimento de projetos práticos.'
  },
  {
    id: '3',
    disciplina: 'Contabilidade Geral',
    professor: 'Maria João Santos',
    vagas: 3,
    prazo: '10/12/2024',
    cargaHoraria: '10h/semana',
    area: 'Negócios',
    campus: 'RJ',
    status: 'ativa' as const,
    descricao: 'Monitoria em balanços patrimoniais, DRE e análise financeira.'
  }
];

export const BuscarVagas = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');

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

  const filteredVagas = mockVagas.filter(vaga => {
    const matchesSearch = !searchQuery || 
      vaga.disciplina.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaga.professor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArea = !selectedArea || selectedArea === "todas" || vaga.area === selectedArea;
    const matchesCampus = !selectedCampus || selectedCampus === "todos" || vaga.campus === selectedCampus;
    
    return matchesSearch && matchesArea && matchesCampus;
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
          <h2 className="wireframe-subheader">Filtros de Busca</h2>
          
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar por disciplina ou professor</label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Área de conhecimento</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as áreas</SelectItem>
                  <SelectItem value="Exatas">Exatas</SelectItem>
                  <SelectItem value="Humanas">Humanas</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Negócios">Negócios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Campus</label>
              <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os campus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os campus</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="BH">Belo Horizonte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Mostrando {filteredVagas.length} de {mockVagas.length} vagas</span>
            {(searchQuery || selectedArea || selectedCampus) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedArea('');
                  setSelectedCampus('');
                }}
              >
                Limpar filtros
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
                  disciplina={vaga.disciplina}
                  professor={vaga.professor}
                  vagas={vaga.vagas}
                  prazo={vaga.prazo}
                  cargaHoraria={vaga.cargaHoraria}
                  area={vaga.area}
                  campus={vaga.campus}
                  status={vaga.status}
                  onClick={() => handleVagaClick(vaga.id)}
                />
              ))}
            </div>
          ) : (
            <div className="wireframe-section text-center py-8">
              <p className="text-muted-foreground mb-4">
                Nenhuma vaga encontrada com os filtros selecionados
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedArea('');
                  setSelectedCampus('');
                }}
              >
                Ver todas as vagas
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 wireframe-section">
          <h2 className="wireframe-subheader">Precisa de Ajuda?</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/student/candidaturas')}>
              Ver Minhas Candidaturas
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/student/monitores')}>
              Buscar Monitores
            </Button>
            <Button variant="outline" size="sm">
              Dúvidas Frequentes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};