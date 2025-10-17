import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/portal/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  CalendarDays
} from 'lucide-react';

// Mock data - in real app would fetch from API
const mockAgendaData = [
  {
    dia: 'Segunda-feira',
    horarios: [
      { 
        id: '1', 
        periodo: '14:00 - 16:00', 
        status: 'disponivel',
        alunosAgendados: 0,
        maxAlunos: 3
      },
      { 
        id: '2', 
        periodo: '16:00 - 18:00', 
        status: 'ocupado',
        alunosAgendados: 2,
        maxAlunos: 3
      }
    ]
  },
  {
    dia: 'Terça-feira',
    horarios: [
      { 
        id: '3', 
        periodo: '14:00 - 16:00', 
        status: 'disponivel',
        alunosAgendados: 1,
        maxAlunos: 3
      }
    ]
  },
  {
    dia: 'Quarta-feira',
    horarios: [
      { 
        id: '4', 
        periodo: '16:00 - 18:00', 
        status: 'disponivel',
        alunosAgendados: 0,
        maxAlunos: 3
      }
    ]
  },
  {
    dia: 'Quinta-feira',
    horarios: [
      { 
        id: '5', 
        periodo: '14:00 - 16:00', 
        status: 'ocupado',
        alunosAgendados: 3,
        maxAlunos: 3
      },
      { 
        id: '6', 
        periodo: '16:00 - 18:00', 
        status: 'disponivel',
        alunosAgendados: 0,
        maxAlunos: 3
      }
    ]
  },
  {
    dia: 'Sexta-feira',
    horarios: [
      { 
        id: '7', 
        periodo: '14:00 - 16:00', 
        status: 'disponivel',
        alunosAgendados: 2,
        maxAlunos: 3
      }
    ]
  },
  {
    dia: 'Sábado',
    horarios: [
      { 
        id: '8', 
        periodo: '09:00 - 12:00', 
        status: 'disponivel',
        alunosAgendados: 1,
        maxAlunos: 4
      }
    ]
  }
];

export const Agenda = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agenda, setAgenda] = useState(mockAgendaData);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/auth/profile');
  };

  const getStatusBadge = (horario: any) => {
    if (horario.alunosAgendados === horario.maxAlunos) {
      return <Badge variant="secondary">Lotado</Badge>;
    } else if (horario.alunosAgendados > 0) {
      return <Badge variant="outline">Parcialmente ocupado</Badge>;
    } else {
      return <Badge className="bg-wireframe-success text-white">Disponível</Badge>;
    }
  };

  const handleRemoveHorario = (diaIndex: number, horarioId: string) => {
    const newAgenda = [...agenda];
    newAgenda[diaIndex].horarios = newAgenda[diaIndex].horarios.filter(h => h.id !== horarioId);
    setAgenda(newAgenda);
    
    toast({
      title: "Horário removido",
      description: "O horário foi removido da sua agenda.",
    });
  };

  const handleAddHorario = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A adição de novos horários estará disponível em breve.",
    });
  };

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
            <Button variant="outline" onClick={() => navigate('/monitor/dashboard')}>
              ← Voltar ao Dashboard
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="wireframe-header">Gerenciar Minha Agenda</h1>
          <p className="text-muted-foreground">Configure seus horários de monitoria disponíveis</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="wireframe-text">Horários da Semana</CardTitle>
                  <Button onClick={handleAddHorario} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Horário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {agenda.map((dia, diaIndex) => (
                    <div key={dia.dia}>
                      <h3 className="wireframe-subheader mb-3">{dia.dia}</h3>
                      {dia.horarios.length > 0 ? (
                        <div className="space-y-3">
                          {dia.horarios.map((horario) => (
                            <div key={horario.id} className="p-4 border border-wireframe-medium rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-wireframe-accent" />
                                    <span className="font-medium wireframe-text">{horario.periodo}</span>
                                  </div>
                                  {getStatusBadge(horario)}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <div className="text-sm text-muted-foreground">
                                    <Users className="h-4 w-4 inline mr-1" />
                                    {horario.alunosAgendados}/{horario.maxAlunos}
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveHorario(diaIndex, horario.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-dashed border-wireframe-medium rounded-lg text-center text-muted-foreground">
                          Nenhum horário configurado para {dia.dia.toLowerCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="wireframe-text">Resumo da Agenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total de horários:</span>
                  <span className="text-sm font-medium">
                    {agenda.reduce((total, dia) => total + dia.horarios.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Horários disponíveis:</span>
                  <span className="text-sm font-medium">
                    {agenda.reduce((total, dia) => 
                      total + dia.horarios.filter(h => h.alunosAgendados < h.maxAlunos).length, 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Alunos agendados:</span>
                  <span className="text-sm font-medium">
                    {agenda.reduce((total, dia) => 
                      total + dia.horarios.reduce((subtotal, h) => subtotal + h.alunosAgendados, 0), 0
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm wireframe-text">Como usar</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• Use "Novo Horário" para adicionar blocos de tempo</p>
                <p>• Horários podem ser editados ou removidos</p>
                <p>• O status é atualizado automaticamente conforme agendamentos</p>
                <p>• Alunos só podem agendar horários disponíveis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};