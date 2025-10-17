import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  User, 
  FileText,
  Send
} from 'lucide-react';

// Mock data - in real app would fetch by ID
const mockVagaDetails = {
  id: '1',
  disciplina: 'Cálculo I',
  professor: 'Ana Maria Silva',
  email: 'ana.silva@ibmec.edu.br',
  vagas: 2,
  prazo: '15/12/2024',
  cargaHoraria: '8h/semana',
  area: 'Exatas',
  campus: 'Rio de Janeiro',
  descricao: `Esta monitoria é voltada para alunos que cursam ou cursaram Cálculo I e desejam auxiliar outros estudantes na compreensão dos conceitos fundamentais da disciplina.

As principais atividades incluem:
• Auxílio na resolução de exercícios de limites, derivadas e integrais
• Esclarecimento de dúvidas teóricas e práticas
• Preparação de material de apoio
• Suporte em horários de plantão de dúvidas

É desejável que o candidato tenha obtido nota igual ou superior a 8,0 na disciplina e demonstre facilidade para explicar conceitos matemáticos de forma didática.`,
  requisitos: [
    'Ter cursado Cálculo I com aprovação',
    'Nota mínima 8,0 na disciplina',
    'Disponibilidade para 8h semanais',
    'Facilidade de comunicação e didática',
    'Experiência prévia em monitoria (desejável)'
  ]
};

export const DetalhesVaga = () => {
  const { vagaId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const handleSubmitCandidatura = async () => {
    if (!motivation.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva sua motivação para ser monitor.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Candidatura enviada com sucesso!",
        description: "Acompanhe o status da sua candidatura na seção 'Minhas Candidaturas'.",
      });
      
      navigate('/student/candidaturas');
    } catch (error) {
      toast({
        title: "Erro ao enviar candidatura",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  // In real app, would handle loading and error states for vaga fetch
  const vaga = mockVagaDetails;

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
          <Button variant="outline" onClick={() => navigate('/student/vagas')}>
            ← Voltar para Buscar Vagas
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vaga Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl wireframe-text">{vaga.disciplina}</CardTitle>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Prof. {vaga.professor}</span>
                  <span>•</span>
                  <span>{vaga.email}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{vaga.vagas} {vaga.vagas === 1 ? 'vaga' : 'vagas'} disponível</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{vaga.cargaHoraria}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Campus {vaga.campus}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Prazo: {vaga.prazo}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Descrição da Vaga</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-muted-foreground">
                  {vaga.descricao}
                </div>
              </CardContent>
            </Card>

            {/* Requisitos */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {vaga.requisitos.map((requisito, index) => (
                    <li key={index} className="flex items-start space-x-2 text-muted-foreground">
                      <span className="text-wireframe-accent mt-1">•</span>
                      <span>{requisito}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Candidatura */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Candidatar-se</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dados preenchidos automaticamente */}
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="font-medium">Nome:</label>
                    <p className="text-muted-foreground">{user.nome}</p>
                  </div>
                  <div>
                    <label className="font-medium">E-mail:</label>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  {user.matricula && (
                    <div>
                      <label className="font-medium">Matrícula:</label>
                      <p className="text-muted-foreground">{user.matricula}</p>
                    </div>
                  )}
                </div>

                {/* Motivação */}
                <div className="space-y-2">
                  <Label htmlFor="motivation">
                    Por que você gostaria de ser monitor desta disciplina?
                  </Label>
                  <Textarea
                    id="motivation"
                    placeholder="Descreva sua motivação, experiência na disciplina e como pode contribuir para o aprendizado dos outros alunos..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo de 50 caracteres
                  </p>
                </div>

                {/* Upload de histórico (opcional) */}
                <div className="space-y-2">
                  <Label>Histórico Escolar (opcional)</Label>
                  <div className="wireframe-placeholder h-20 cursor-pointer hover:bg-wireframe-light transition-colors">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Clique para anexar
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceitos: PDF (máx. 5MB)
                  </p>
                </div>

                {/* Botão de envio */}
                <Button 
                  onClick={handleSubmitCandidatura}
                  disabled={isSubmitting || motivation.length < 50}
                  className="w-full"
                >
                  {isSubmitting ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Candidatura
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Você receberá uma confirmação por e-mail e poderá acompanhar o status da sua candidatura.
                </p>
              </CardContent>
            </Card>

            {/* Informações adicionais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Informações Importantes</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• O processo seletivo pode incluir entrevista</p>
                <p>• Resultado em até 5 dias úteis</p>
                <p>• Bolsa mensal conforme regulamento</p>
                <p>• Certificado de participação emitido</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};