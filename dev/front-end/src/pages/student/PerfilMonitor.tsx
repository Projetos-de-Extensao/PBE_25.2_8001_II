import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  MessageSquare,
  CheckCircle,
  BookOpen,
  CalendarDays
} from 'lucide-react';

// Mock data - in real app would fetch by ID
const mockMonitorDetails = {
  id: '1',
  nome: 'Maria Santos',
  disciplina: 'Cálculo I',
  avaliacao: 4.8,
  totalAvaliacoes: 15,
  totalSessoes: 120,
  bio: 'Monitor há 2 anos na disciplina de Cálculo I. Especializada em derivadas, integrais e limites. Formada em Engenharia com metodologia didática e muita paciência para explicar conceitos complexos de forma simples.',
  especializacoes: ['Derivadas e Integrais', 'Limites', 'Funções', 'Aplicações Práticas'],
  horarios: [
    { dia: 'Segunda', periodo: '16:00 - 18:00', disponivel: true },
    { dia: 'Terça', periodo: '14:00 - 16:00', disponivel: false },
    { dia: 'Quarta', periodo: '16:00 - 18:00', disponivel: true },
    { dia: 'Quinta', periodo: '14:00 - 16:00', disponivel: true },
    { dia: 'Sexta', periodo: '14:00 - 16:00', disponivel: true },
    { dia: 'Sábado', periodo: '09:00 - 12:00', disponivel: true }
  ],
  avaliacoes: [
    {
      id: '1',
      comentario: 'Excelente monitora! Muito didática e paciente. Me ajudou bastante com derivadas.',
      nota: 5,
      data: '15/11/2024'
    },
    {
      id: '2',
      comentario: 'Explica muito bem e sempre tira todas as dúvidas. Recomendo!',
      nota: 5,
      data: '10/11/2024'
    },
    {
      id: '3',
      comentario: 'Boa monitora, mas às vezes um pouco rápida nas explicações.',
      nota: 4,
      data: '05/11/2024'
    }
  ]
};

export const PerfilMonitor = () => {
  const { monitorId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedHorario, setSelectedHorario] = useState<string>('');
  const [duvidas, setDuvidas] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const handleBookSession = async () => {
    if (!selectedHorario) {
      toast({
        title: "Selecione um horário",
        description: "Por favor, escolha um horário disponível para agendar.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Sessão agendada com sucesso!",
        description: "Você receberá uma confirmação por e-mail em breve.",
      });
      
      navigate('/agendamentos');
    } catch (error) {
      toast({
        title: "Erro ao agendar sessão",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  const monitor = mockMonitorDetails;

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
          <Button variant="outline" onClick={() => navigate('/student/monitores')}>
            ← Voltar para Buscar Monitores
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monitor Profile */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={monitor.nome} />
                    <AvatarFallback className="bg-wireframe-medium text-wireframe-text text-lg">
                      {monitor.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl wireframe-text">{monitor.nome}</CardTitle>
                    <p className="text-lg text-muted-foreground">{monitor.disciplina}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.floor(monitor.avaliacao) 
                                  ? 'fill-wireframe-dark text-wireframe-dark' 
                                  : 'text-wireframe-medium'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {monitor.avaliacao.toFixed(1)} ({monitor.totalAvaliacoes} avaliações)
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4" />
                        <span>{monitor.totalSessoes} sessões realizadas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="wireframe-subheader">Sobre o Monitor</h3>
                    <p className="text-muted-foreground">{monitor.bio}</p>
                  </div>
                  
                  <div>
                    <h3 className="wireframe-subheader">Especializações</h3>
                    <div className="flex flex-wrap gap-2">
                      {monitor.especializacoes.map((spec, index) => (
                        <span key={index} className="text-xs bg-wireframe-light px-2 py-1 rounded border border-wireframe-medium">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horários Disponíveis */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Horários Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {monitor.horarios.map((horario, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        horario.disponivel 
                          ? selectedHorario === `${horario.dia} ${horario.periodo}`
                            ? 'border-wireframe-dark bg-wireframe-light'
                            : 'border-wireframe-medium hover:bg-wireframe-light'
                          : 'border-wireframe-medium bg-muted opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (horario.disponivel) {
                          setSelectedHorario(`${horario.dia} ${horario.periodo}`);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium wireframe-text">{horario.dia}</p>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{horario.periodo}</span>
                          </div>
                        </div>
                        {!horario.disponivel && (
                          <span className="text-xs text-muted-foreground">Ocupado</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Avaliações */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Avaliações dos Alunos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitor.avaliacoes.map((avaliacao) => (
                    <div key={avaliacao.id} className="p-4 border border-wireframe-medium rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= avaliacao.nota 
                                  ? 'fill-wireframe-dark text-wireframe-dark' 
                                  : 'text-wireframe-medium'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{avaliacao.data}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{avaliacao.comentario}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Agendamento */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Agendar Sessão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Horário Selecionado</Label>
                  <div className="p-3 bg-wireframe-light rounded-lg border border-wireframe-medium">
                    {selectedHorario ? (
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4 text-wireframe-accent" />
                        <span className="text-sm wireframe-text">{selectedHorario}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Selecione um horário acima</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duvidas">Quais suas principais dúvidas? (opcional)</Label>
                  <Textarea
                    id="duvidas"
                    placeholder="Descreva os tópicos que gostaria de revisar na sessão..."
                    value={duvidas}
                    onChange={(e) => setDuvidas(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button 
                  onClick={handleBookSession}
                  disabled={isBooking || !selectedHorario}
                  className="w-full"
                >
                  {isBooking ? (
                    'Agendando...'
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Confirmar Agendamento
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Você receberá uma confirmação por e-mail com os detalhes da sessão.
                </p>
              </CardContent>
            </Card>

            {/* Informações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Informações da Monitoria</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-3 w-3" />
                  <span>Presencial ou Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>Duração: 1-2 horas por sessão</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-3 w-3" />
                  <span>Material de apoio fornecido</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-3 w-3" />
                  <span>Cancele com até 2h de antecedência</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};