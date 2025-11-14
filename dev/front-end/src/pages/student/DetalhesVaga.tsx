import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, MapPin, User, FileText, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';

type VagaDetalhe = {
  id: number;
  disciplina_nome: string;
  coordenador_nome: string;
  coordenador: number;
  titulo: string;
  descricao: string;
  requisitos: string;
  vagas: number;
  status: 'aberta' | 'em_analise' | 'encerrada';
};

export const DetalhesVaga = () => {
  const { vagaId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [vaga, setVaga] = useState<VagaDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MIN_MOTIVATION = 50;

  useEffect(() => {
    const load = async () => {
      try {
        if (!vagaId) throw new Error('Vaga inválida');
        const data = await api.monitorias.get(Number(vagaId));
        setVaga(data);
      } catch (e) {
        setLoadError('Não foi possível carregar a vaga.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [vagaId]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const handleSubmitCandidatura = async () => {
    if (!motivation.trim() || motivation.trim().length < MIN_MOTIVATION) {
      toast({
        title: 'Campo obrigatório',
        description: `Descreva sua motivação (mínimo de ${MIN_MOTIVATION} caracteres).`,
        variant: 'destructive',
      });
      return;
    }

    if (!vagaId) {
      toast({
        title: 'Vaga inválida',
        description: 'Não foi possível identificar a vaga.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.candidaturas.create({ monitoria: Number(vagaId), observacoes_aluno: motivation });
      toast({
        title: 'Candidatura enviada com sucesso!',
        description: "Acompanhe o status da sua candidatura na seção 'Minhas Candidaturas'.",
      });
      navigate('/student/candidaturas');
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar candidatura',
        description: error?.message || 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  if (loading) return null;

  if (loadError || !vaga) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{loadError || 'Vaga não encontrada'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        userName={`${user.first_name} ${user.last_name}`}
        userRole={user.tipo_usuario}
        onLogout={handleLogout}
        onProfile={handleProfile}
      />

      <div className="academic-layout py-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/student/vagas')}>
            ← Voltar para Buscar Vagas
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl wireframe-text">{vaga.titulo}</CardTitle>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{vaga.coordenador_nome}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {vaga.vagas} {vaga.vagas === 1 ? 'vaga' : 'vagas'} disponível
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Carga horária a definir</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Campus a definir</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Descrição da Vaga</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-muted-foreground">{vaga.descricao}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {vaga.requisitos
                    ? vaga.requisitos.split('\n').map((line, index) => (
                        <li key={index} className="flex items-start space-x-2 text-muted-foreground">
                          <span className="text-wireframe-accent mt-1">•</span>
                          <span>{line}</span>
                        </li>
                      ))
                    : (
                        <li className="text-muted-foreground">Sem requisitos específicos.</li>
                      )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Candidatar-se</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="font-medium">Nome:</label>
                    <p className="text-muted-foreground">{`${user.first_name} ${user.last_name}`}</p>
                  </div>
                  <div>
                    <label className="font-medium">E-mail:</label>
                    <p className="text-muted-foreground">{user.email_institucional}</p>
                  </div>
                  {user.matricula && (
                    <div>
                      <label className="font-medium">Matrícula:</label>
                      <p className="text-muted-foreground">{user.matricula}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Por que você gostaria de ser monitor desta disciplina?</Label>
                  <Textarea
                    id="motivation"
                    placeholder="Descreva sua motivação, experiência na disciplina e como pode contribuir para o aprendizado dos outros alunos..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <p className={`text-xs ${motivation.trim().length < MIN_MOTIVATION ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {motivation.trim().length}/{MIN_MOTIVATION} caracteres mínimos
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Histórico Escolar (opcional)</Label>
                  <div className="wireframe-placeholder h-20 cursor-pointer hover:bg-wireframe-light transition-colors">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Clique para anexar</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Formatos aceitos: PDF (máx. 5MB)</p>
                </div>

                <Button
                  onClick={handleSubmitCandidatura}
                  disabled={user.tipo_usuario !== 'aluno' || isSubmitting || motivation.trim().length < MIN_MOTIVATION}
                  className="w-full"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {user.tipo_usuario === 'aluno' ? 'Enviar Candidatura' : 'Apenas alunos podem se candidatar'}
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Você receberá uma confirmação por e-mail e poderá acompanhar o status da sua candidatura.
                </p>
              </CardContent>
            </Card>

            {/* Box de Informações Importantes removido conforme solicitação */}
          </div>
        </div>
      </div>
    </div>
  );
};