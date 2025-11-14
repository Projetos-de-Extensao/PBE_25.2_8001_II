import { useState, useEffect } from 'react';
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
import { api } from '@/lib/api';
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

const statusOptions = ['Todos', 'Pendente', 'Aprovada', 'Rejeitada'];

export const Candidatos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFiltro, setStatusFiltro] = useState('Todos');
  const [candidaturaSelecionada, setCandidaturaSelecionada] = useState<string | null>(null);

  useEffect(() => {
    const loadCandidaturas = async () => {
      try {
        const data = await api.candidaturas.list();
        setCandidaturas(data.results || data);
      } catch (error) {
        console.error('Erro ao carregar candidaturas:', error);
        toast({
          title: 'Erro ao carregar candidaturas',
          description: 'Não foi possível carregar as candidaturas.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    loadCandidaturas();
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

  const handleAprovar = async (candidaturaId: string) => {
    try {
      await api.candidaturas.avaliar(Number(candidaturaId), 'aprovada');
      
      setCandidaturas(candidaturas.map(c =>
        c.id === candidaturaId ? { ...c, status: 'aprovada' } : c
      ));
      
      toast({
        title: "Candidatura aprovada",
        description: "O aluno será notificado por e-mail sobre a aprovação.",
      });
    } catch (error) {
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar a candidatura.",
        variant: "destructive"
      });
    }
  };

  const handleRejeitar = async (candidaturaId: string) => {
    try {
      await api.candidaturas.avaliar(Number(candidaturaId), 'reprovada');
      
      setCandidaturas(candidaturas.map(c =>
        c.id === candidaturaId ? { ...c, status: 'reprovada' } : c
      ));
      
      toast({
        title: "Candidatura rejeitada",
        description: "O aluno será notificado por e-mail sobre a decisão.",
      });
    } catch (error) {
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar a candidatura.",
        variant: "destructive"
      });
    }
  };

  const candidaturasFiltradas = candidaturas.filter((candidatura: any) => {
    const matchStatus = statusFiltro === 'Todos' ||
                       (statusFiltro === 'Pendente' && candidatura.status === 'pendente') ||
                       (statusFiltro === 'Aprovada' && candidatura.status === 'aprovada') ||
                       (statusFiltro === 'Rejeitada' && candidatura.status === 'rejeitada');
    
    return matchStatus;
  });

  const candidaturaAtual = candidaturas.find(c => c.id === candidaturaSelecionada);

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
                {candidaturasFiltradas.map((candidatura: any) => {
                  const nomeAluno = candidatura.aluno_nome || 'Candidato';
                  const iniciais = nomeAluno.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  
                  return (
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
                        <AvatarImage src="" alt={nomeAluno} />
                        <AvatarFallback className="bg-wireframe-medium text-wireframe-text text-xs">
                          {iniciais}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium wireframe-text truncate">{nomeAluno}</p>
                        <p className="text-xs text-muted-foreground">{candidatura.monitoria_disciplina}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(candidatura.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
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
                      <CardTitle className="wireframe-text">{(candidaturaAtual as any).aluno_nome || 'Candidato'}</CardTitle>
                      <p className="text-sm text-muted-foreground">{(candidaturaAtual as any).monitoria_disciplina}</p>
                    </div>
                    {getStatusBadge((candidaturaAtual as any).status)}
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
                          <span className="text-sm">{(candidaturaAtual as any).aluno_email || 'Email não disponível'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">ID: {(candidaturaAtual as any).aluno}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Monitoria: {(candidaturaAtual as any).monitoria_disciplina}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Carta de Motivação */}
                  <div>
                    <h3 className="wireframe-subheader mb-3">Carta de Motivação</h3>
                    <div className="p-4 bg-wireframe-light rounded-lg border border-wireframe-medium">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        "{(candidaturaAtual as any).carta_motivacao || 'Sem carta de motivação'}"
                      </p>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  <div>
                    <h3 className="wireframe-subheader mb-3">Informações Adicionais</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center justify-between p-3 bg-wireframe-light rounded-lg">
                        <span className="text-sm">Data da candidatura:</span>
                        <span className="text-sm font-medium">{(candidaturaAtual as any).data_candidatura ? new Date((candidaturaAtual as any).data_candidatura).toLocaleDateString('pt-BR') : 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-wireframe-light rounded-lg">
                        <span className="text-sm">Status:</span>
                        <span className="text-sm font-medium">{(candidaturaAtual as any).status}</span>
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