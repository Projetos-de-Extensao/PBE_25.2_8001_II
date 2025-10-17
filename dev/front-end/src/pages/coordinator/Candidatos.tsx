import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  Calendar,
  GraduationCap,
  Mail,
  User,
  FileText
} from 'lucide-react';

// Mock data - in real app would fetch from API
const mockCandidaturas = [
  {
    id: '1',
    aluno: {
      nome: 'Pedro Santos Silva',
      email: 'pedro.santos@ibmec.edu.br',
      matricula: '2023001',
      periodo: '5º período',
      cra: 8.7
    },
    vaga: {
      id: '1',
      disciplina: 'Cálculo I',
      professor: 'Prof. Ana Silva'
    },
    motivacao: 'Sempre tive facilidade em matemática e gostaria de ajudar outros alunos com as dificuldades que eu mesmo já enfrentei. Tenho experiência em dar aulas particulares e acredito que posso contribuir muito com o programa de monitoria.',
    dataCandidatura: '2024-11-18',
    status: 'pendente',
    historico: true
  },
  {
    id: '2',
    aluno: {
      nome: 'Ana Costa Oliveira',
      email: 'ana.costa@ibmec.edu.br',
      matricula: '2022045',
      periodo: '7º período',
      cra: 9.1
    },
    vaga: {
      id: '2',
      disciplina: 'Programação I',
      professor: 'Prof. João Costa'
    },
    motivacao: 'Programação é minha paixão e já desenvolvo projetos pessoais há 3 anos. Quero compartilhar meu conhecimento e ajudar os colegas que estão começando na área. Tenho experiência com Python, Java e JavaScript.',
    dataCandidatura: '2024-11-17',
    status: 'pendente',
    historico: true
  },
  {
    id: '3',
    aluno: {
      nome: 'Carlos Roberto Lima',
      email: 'carlos.lima@ibmec.edu.br',
      matricula: '2023078',
      periodo: '4º período',
      cra: 8.2
    },
    vaga: {
      id: '3',
      disciplina: 'Estatística Aplicada',
      professor: 'Prof. Maria Lima'
    },
    motivacao: 'Tenho interesse em estatística aplicada a negócios e quero aprofundar meus conhecimentos ajudando outros alunos. Já trabalhei com análise de dados em estágio e posso trazer exemplos práticos.',
    dataCandidatura: '2024-11-16',
    status: 'pendente',
    historico: false
  },
  {
    id: '4',
    aluno: {
      nome: 'Marina Silva Santos',
      email: 'marina.silva@ibmec.edu.br',
      matricula: '2022033',
      periodo: '6º período',
      cra: 8.9
    },
    vaga: {
      id: '1',
      disciplina: 'Cálculo I',
      professor: 'Prof. Ana Silva'
    },
    motivacao: 'Já fui monitora de matemática no ensino médio e adorei a experiência. Quero continuar ajudando colegas e desenvolvendo minhas habilidades didáticas. Tenho muito material de estudo organizado.',
    dataCandidatura: '2024-11-15',
    status: 'aprovada',
    historico: true
  },
  {
    id: '5',
    aluno: {
      nome: 'João Paulo Reis',
      email: 'joao.reis@ibmec.edu.br',
      matricula: '2023012',
      periodo: '5º período',
      cra: 7.8
    },
    vaga: {
      id: '2',
      disciplina: 'Programação I',
      professor: 'Prof. João Costa'
    },
    motivacao: 'Gosto muito de programar e sempre ajudo meus colegas com as atividades. Quero me tornar monitor para formalizar essa ajuda e desenvolver minhas habilidades de ensino.',
    dataCandidatura: '2024-11-14',
    status: 'rejeitada',
    historico: false
  }
];

const disciplinas = ['Todas', 'Cálculo I', 'Programação I', 'Estatística Aplicada'];
const statusOptions = ['Todos', 'Pendente', 'Aprovada', 'Rejeitada'];

export const Candidatos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidaturas, setCandidaturas] = useState(mockCandidaturas);
  const [disciplinaFiltro, setDisciplinaFiltro] = useState('Todas');
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [candidaturaSelecionada, setCandidaturaSelecionada] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'aprovada':
        return <Badge className="bg-green-100 text-green-800">Aprovada</Badge>;
      case 'rejeitada':
        return <Badge className="bg-red-100 text-red-800">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">Status</Badge>;
    }
  };

  const handleAprovar = (candidaturaId: string) => {
    setCandidaturas(candidaturas.map(c =>
      c.id === candidaturaId ? { ...c, status: 'aprovada' } : c
    ));
    
    toast({
      title: "Candidatura aprovada",
      description: "O aluno será notificado por e-mail sobre a aprovação.",
    });
  };

  const handleRejeitar = (candidaturaId: string) => {
    setCandidaturas(candidaturas.map(c =>
      c.id === candidaturaId ? { ...c, status: 'rejeitada' } : c
    ));
    
    toast({
      title: "Candidatura rejeitada",
      description: "O aluno será notificado por e-mail sobre a decisão.",
    });
  };

  const candidaturasFiltradas = candidaturas.filter(candidatura => {
    const matchDisciplina = disciplinaFiltro === 'Todas' || candidatura.vaga.disciplina === disciplinaFiltro;
    const matchStatus = statusFiltro === 'Todos' ||
                       (statusFiltro === 'Pendente' && candidatura.status === 'pendente') ||
                       (statusFiltro === 'Aprovada' && candidatura.status === 'aprovada') ||
                       (statusFiltro === 'Rejeitada' && candidatura.status === 'rejeitada');
    
    return matchDisciplina && matchStatus;
  });

  const candidaturaAtual = candidaturas.find(c => c.id === candidaturaSelecionada);

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
          <h1 className="wireframe-header">Análise de Candidatos</h1>
          <p className="text-muted-foreground">Avalie as candidaturas e selecione os monitores</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar - Lista de Candidaturas */}
          <div className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Disciplina</label>
                  <Select value={disciplinaFiltro} onValueChange={setDisciplinaFiltro}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinas.map((disc) => (
                        <SelectItem key={disc} value={disc}>{disc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Status</label>
                  <Select value={statusFiltro} onValueChange={setStatusFiltro}>
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

            {/* Lista de Candidaturas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">
                  Candidaturas
                  <Badge variant="outline" className="ml-2">
                    {candidaturasFiltradas.length} resultado{candidaturasFiltradas.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {candidaturasFiltradas.map((candidatura) => (
                  <div 
                    key={candidatura.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      candidaturaSelecionada === candidatura.id 
                        ? 'border-wireframe-dark bg-wireframe-light'
                        : 'border-wireframe-medium hover:bg-wireframe-light'
                    }`}
                    onClick={() => setCandidaturaSelecionada(candidatura.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={candidatura.aluno.nome} />
                        <AvatarFallback className="bg-wireframe-medium text-wireframe-text text-xs">
                          {candidatura.aluno.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium wireframe-text truncate">{candidatura.aluno.nome}</p>
                        <p className="text-xs text-muted-foreground">{candidatura.vaga.disciplina}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(candidatura.status)}
                          <span className="text-xs text-muted-foreground">CRA: {candidatura.aluno.cra}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Detalhes da Candidatura */}
          <div className="lg:col-span-2">
            {candidaturaAtual ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="wireframe-text">{candidaturaAtual.aluno.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">{candidaturaAtual.vaga.disciplina} • {candidaturaAtual.vaga.professor}</p>
                    </div>
                    {getStatusBadge(candidaturaAtual.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informações do Aluno */}
                  <div>
                    <h3 className="wireframe-subheader mb-3">Informações do Candidato</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{candidaturaAtual.aluno.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Matrícula: {candidaturaAtual.aluno.matricula}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{candidaturaAtual.aluno.periodo}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">CRA: {candidaturaAtual.aluno.cra}</span>
                          {candidaturaAtual.aluno.cra >= 8.5 && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Alto rendimento</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Carta de Motivação */}
                  <div>
                    <h3 className="wireframe-subheader mb-3">Carta de Motivação</h3>
                    <div className="p-4 bg-wireframe-light rounded-lg border border-wireframe-medium">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        "{candidaturaAtual.motivacao}"
                      </p>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div>
                    <h3 className="wireframe-subheader mb-3">Informações Adicionais</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center justify-between p-3 bg-wireframe-light rounded-lg">
                        <span className="text-sm">Data da candidatura:</span>
                        <span className="text-sm font-medium">{candidaturaAtual.dataCandidatura}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-wireframe-light rounded-lg">
                        <span className="text-sm">Histórico escolar anexado:</span>
                        <div className="flex items-center space-x-1">
                          {candidaturaAtual.historico ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">Sim</span>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Não</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  {candidaturaAtual.status === 'pendente' && (
                    <div className="flex items-center space-x-3 pt-4 border-t border-wireframe-medium">
                      <Button 
                        onClick={() => handleAprovar(candidaturaAtual.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar Candidatura
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => handleRejeitar(candidaturaAtual.id)}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeitar Candidatura
                      </Button>
                    </div>
                  )}

                  {candidaturaAtual.status !== 'pendente' && (
                    <div className="text-center p-4 bg-wireframe-light rounded-lg border border-wireframe-medium">
                      <div className="flex items-center justify-center space-x-2">
                        {candidaturaAtual.status === 'aprovada' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                          Candidatura {candidaturaAtual.status === 'aprovada' ? 'aprovada' : 'rejeitada'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Selecione uma candidatura para analisar</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};