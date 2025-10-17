import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { MonitorCard } from '@/components/portal/MonitorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Search } from 'lucide-react';

// Mock data
const mockMonitores = [
  {
    id: '1',
    nome: 'Maria Santos',
    disciplina: 'Cálculo I',
    avaliacao: 4.8,
    totalAvaliacoes: 15,
    bio: 'Monitor há 2 anos, especializada em derivadas e integrais. Metodologia didática e paciente.',
    horariosDisponiveis: ['Sex 14:00-16:00', 'Sáb 09:00-12:00', 'Seg 16:00-18:00']
  },
  {
    id: '2',
    nome: 'João Pedro Silva',
    disciplina: 'Programação Orientada a Objetos',
    avaliacao: 4.6,
    totalAvaliacoes: 22,
    bio: 'Desenvolvedor e monitor experiente em Java, Python e conceitos de POO. Projetos práticos!',
    horariosDisponiveis: ['Ter 18:00-20:00', 'Qui 18:00-20:00', 'Sáb 14:00-17:00']
  },
  {
    id: '3',
    nome: 'Ana Carolina Lima',
    disciplina: 'Contabilidade Geral',
    avaliacao: 4.9,
    totalAvaliacoes: 8,
    bio: 'Monitora focada em balanços patrimoniais e DRE. Explicações claras com exemplos práticos.',
    horariosDisponiveis: ['Qua 15:00-17:00', 'Sex 10:00-12:00']
  },
  {
    id: '4',
    nome: 'Carlos Eduardo',
    disciplina: 'Estatística Aplicada',
    avaliacao: 4.5,
    totalAvaliacoes: 12,
    bio: 'Monitor especializado em análise de dados e interpretação estatística. Uso de ferramentas práticas.',
    horariosDisponiveis: ['Seg 19:00-21:00', 'Qui 16:00-18:00']
  }
];

const disciplinasDisponiveis = [...new Set(mockMonitores.map(m => m.disciplina))];

export const BuscarMonitores = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const handleMonitorClick = (monitorId: string) => {
    navigate(`/student/monitor/${monitorId}`);
  };

  const filteredMonitores = mockMonitores.filter(monitor => {
    const matchesSearch = !searchQuery || 
      monitor.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monitor.disciplina.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDisciplina = !selectedDisciplina || selectedDisciplina === "todas" || monitor.disciplina === selectedDisciplina;
    
    return matchesSearch && matchesDisciplina;
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
          <h1 className="wireframe-header">Buscar Monitores</h1>
          <p className="text-muted-foreground">
            Encontre monitores qualificados para te ajudar nas disciplinas que você precisa
          </p>
        </div>

        {/* Search and Filters */}
        <div className="wireframe-section mb-6">
          <h2 className="wireframe-subheader">Qual disciplina você precisa de ajuda?</h2>
          
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar por monitor ou disciplina</label>
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
              <label className="text-sm font-medium">Disciplina</label>
              <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as disciplinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as disciplinas</SelectItem>
                  {disciplinasDisponiveis.map((disciplina) => (
                    <SelectItem key={disciplina} value={disciplina}>
                      {disciplina}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Mostrando {filteredMonitores.length} de {mockMonitores.length} monitores</span>
            {(searchQuery || selectedDisciplina) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDisciplina('');
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="wireframe-subheader">Monitores Disponíveis</h2>
          
          {filteredMonitores.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMonitores.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  nome={monitor.nome}
                  disciplina={monitor.disciplina}
                  avaliacao={monitor.avaliacao}
                  totalAvaliacoes={monitor.totalAvaliacoes}
                  bio={monitor.bio}
                  horariosDisponiveis={monitor.horariosDisponiveis}
                  onClick={() => handleMonitorClick(monitor.id)}
                />
              ))}
            </div>
          ) : (
            <div className="wireframe-section text-center py-8">
              <p className="text-muted-foreground mb-4">
                Nenhum monitor encontrado com os filtros selecionados
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDisciplina('');
                }}
              >
                Ver todos os monitores
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 wireframe-section">
          <h2 className="wireframe-subheader">Precisa de Ajuda?</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/agendamentos')}>
              Meus Agendamentos
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/student/vagas')}>
              Buscar Vagas de Monitoria
            </Button>
            <Button variant="outline" size="sm">
              Como Funciona a Monitoria
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="wireframe-section text-center">
            <h3 className="text-2xl font-bold wireframe-text">{mockMonitores.length}</h3>
            <p className="text-sm text-muted-foreground">Monitores Ativos</p>
          </div>
          <div className="wireframe-section text-center">
            <h3 className="text-2xl font-bold wireframe-text">{disciplinasDisponiveis.length}</h3>
            <p className="text-sm text-muted-foreground">Disciplinas Disponíveis</p>
          </div>
          <div className="wireframe-section text-center">
            <h3 className="text-2xl font-bold wireframe-text">4.7</h3>
            <p className="text-sm text-muted-foreground">Avaliação Média</p>
          </div>
        </div>
      </div>
    </div>
  );
};